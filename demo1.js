const Nightmare = require('nightmare');
const fs = require('fs');
const request = require('request');
// khởi tạo nightmare
const nightmare = new Nightmare({
	switches: {
    'ignore-certificate-errors': true
  }
  
});

nightmare
.goto('https://beta.chiasenhac.vn/mp3/vietnam/v-pop/nam-lay-tay-anh~tuan-hung~ts' +
    '35db73qhmqtw.html')
  .wait(3000)
      .evaluate(function () {
        let link = document.querySelector('#pills-download .card-body a').href;
        
        let data = link.replace(/^(http(s)?):\/\/data.+\/128\//, '');
        let dec = decodeURI(data);
        return dec;
      })
      .end()
      .then(function (dec) { // titles trong then() này chính là kết quả titles đc trả về ở trên
        
        console.log(dec);
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR: ', error);
  })