const Nightmare = require('nightmare');
const async = require('async');
// module shell giúp viết các câu lệnh của command line cho Node
const shell = require('shelljs');
const fs = require('fs');
// sử dụng module này để tải file nhạc
const request = require('request');
// khởi tạo nightmare
const nightmare = new Nightmare();
// kết nối csdl
const mysql = require('mysql');
const conn = require('./connect.js');
//----chạy nightmare-----
nightmare
  .goto('http://old.chiasenhac.vn/')
  .wait(2000)
  .type('#s', 'Phạm Trưởng') // điền thông tin tìm kiếm
  .wait(2000)
  .type('#s', "\u000d") // nhấn enter
  .wait(3000)
  .click('#martist') // lọc chỉ hiển thị file nhạc
  .click(".tk-tbt input[type='submit']") // click công cụ tùy chỉnh
  .wait(5000)
  .evaluate(function () {
    // lấy các url của bài hát
    let musicTable = document.querySelector('tbody');
    let songs = musicTable.querySelectorAll('tr:not(:first-child) a.musictitle');
    // chạy qua từng thẻ và lấy đường dẫn để tải
    let musicUrls = [];
    songs.forEach(song => {
      musicUrls.push(song.getAttribute('href'));
    })
    // mảng musicUrls có tất cả 25 bài hát
    // lấy 5 bài để chạy thử 
    return musicUrls;
  })
  .end()
  .then(musicUrls => {
    // musicUrls này mới là url trang bài hát trên chiasenhac, chưa phải là link để
    // download cần chạy nightmare vào từng link để lấy đường dẫn tải nhạc
    crawl(musicUrls, function (err, res) {
      if (err) {
        console.log(err.message);
      }
      console.log('Hoàn thành chạy crawl()');
    });

  })
  .catch(error => {
    console.log('ERROR: ', error);
  })

/**
 * Hàm cào dữ liệu chính nhận 1 mảng các url và tạo nightmare đọc dữ liệu của từng link
 * @param {array} arr - mảng chứa tất cả các url của sản phẩm
 * @param {function} cb - hàm callback khi hoàn thành 1 tiến trình nightmare tải nhạc
 */
function crawl(arr, cb) {
  
  function crawlEachUrl(item, cb) {
    // item is each url
    let nightmare = new Nightmare();
    nightmare
      .goto(item)
      .wait(5000)
          .evaluate(function () {
            try {
              let obj = {};
              let arr = [];
              //lấy tất cả thông tin bài hẩt
              let link = document
                .querySelector('#pills-download .card-body a')
                .href;
              let title = document.querySelector('.card-body h2.card-title').textContent;
              let infor = document.querySelectorAll('.col-md-4 .list-unstyled li a');
                infor.forEach((article) => {
                  arr.push(article.textContent);
                })
              let songTitle = document
                .querySelector('title')
                .innerText;
              let data = link.replace(/^(http(s)?):\/\/data.+\/128\//, '');
              let filename = decodeURI(data);
              obj['filename'] = filename;
              let songname = filename.replace(/\.\w+/, '');
              obj['original'] = songname;
              let mime = filename.match(/\.\w+/);
              obj['mime'] = mime[0];

              obj['title'] = title;
              obj['singer'] = arr[0];
              obj['artist'] = arr[1];


              return [obj, link, filename];
            } catch (err) {
                console.log(err.message);
                return {};
            }
          })
          .end()
          .then(result => {
            if (!result) {
              cb(null, {});
            }
            try {
              //update csdl
              let sql = "INSERT INTO songtbl (filename, mime, original_filename, artist, singer, type, year, country) VALUES ('"+result[0].filename+"', '"+result[0].mime+"', '"+result[0].title+"', '"+result[0].artist+"', '"+result[0].singer+"', 'Nhạc Trẻ', '2019', 'Việt Nam')";
              conn
                .query(sql, function (err, result) {
                    if (err) throw err;
                      console.log("thêm thành công!!");// thêm vào CSDL thành công;
                  }); 
              // sử dụng module request để tải file nhạc 
              request
                .get(result[1])
                .on('error', function (err) {
                  // handle error
                  if (err)
                    throw err;
                })
                .pipe(fs.createWriteStream(`${destPath}/${result[2]}`));
              cb(null, result); // tải xong gọi hàm cb báo với async để chạy tiến trình mới
            } catch (err) {
              console.log(err.message);
              cb(null, {});
            }
          })
          .catch(error => {
            console.log('ERROR: ', error);
          })
      .catch(error => {
        console.log('ERROR: ', error);
      })
  }
  // tạo folder để chứa file nhạc
  let destPath ='C:/xampp/htdocs/MusicOnline/public/frontend/uploads';
  shell.mkdir('-p', destPath);
  // dùng module async để giới hạn số tiến trình nightmare chạy 1 lúc
  async.mapLimit(arr, 3, crawlEachUrl, function (err, res) {
    cb(null, res);
  });
}