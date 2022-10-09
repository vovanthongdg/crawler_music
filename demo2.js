const Nightmare = require('nightmare');
const fs = require('fs');
const request = require('request');
const mysql = require('mysql');
const conn = require('./connect.js');
// khởi tạo nightmare
const nightmare = new Nightmare({
	switches: {
    'ignore-certificate-errors': true
  }
  
});

nightmare
.goto('https://beta.chiasenhac.vn/mp3/vietnam/v-pop/nam-lay-tay-anh~tuan-hung~ts' +
    '35db73qhmqtw.html')
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


              return obj;
            } catch (err) {
                console.log(err.message);
                return {};
            }
      })
      .end()
      .then(rs => {
            let sql = "INSERT INTO songtbl (filename, mime, original_filename, artist, singer) VALUES ('"+rs.filename+"', '"+rs.mime+"', '"+rs.title+"', '"+rs.artist+"', '"+rs.singer+"')";
                  conn
                  .query(sql, function (err, result) {
                    if (err) throw err;
                      console.log("them thanh cong!!");
                  });
              })

  .catch(error => {
    console.log('ERROR: ', error);
  })