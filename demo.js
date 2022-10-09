const Nightmare = require('nightmare');
// khởi tạo nightmare
const nightmare = Nightmare()
const mysql = require('mysql');
const conn = require('./connect.js');

nightmare
  .goto('https://beta.chiasenhac.vn/mp3/vietnam/v-pop/tinh-em-la-dai-duong~duy-manh~ts' + '3wd33cq9mwwv.html')
  .wait(3000)
  .evaluate(function () {
    try {
    let obj = {};
    let title = document.querySelector('.card-body h2.card-title').textContent;
    let infor = document.querySelectorAll('.col-md-4 .list-unstyled li a');

    let arr = [];

    infor.forEach((article) => {
      arr.push(article.textContent);
    })
    
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
  .then(function (obj) { // titles trong then() này chính là kết quả titles đc trả về ở trên
    console.log(obj);
    
    
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR: ', error);
  })