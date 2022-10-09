const Nightmare = require('nightmare');
const fs = require('fs');
const request = require('request');
// khởi tạo nightmare
const nightmare = new Nightmare({
	show: true,
	switches: {
    'ignore-certificate-errors': true
  }
  
});

nightmare
.goto('https://beta.chiasenhac.vn/mp3/vietnam/v-pop/nam-lay-tay-anh~tuan-hung~ts' +
    '35db73qhmqtw.html')
  .wait(5000)
      .evaluate(function () {
        let link = document.querySelector('#pills-download .card-body a').href;
        let songTitle = document.querySelector('title').innerText;
        
        var data = link.replace(/^(http(s)?):\/\/data.+\/128\//, '');
        var filename = decodeURI(data);
        var songname = filename.replace(/\.\w+/, '');
        var mime = filename.match(/\.\w+/);
        return [link, filename];
    
      })
      .end()
      .then(result => {
        request
          .get(result[0])
          .on('error', function (err) {
            // handle error
            if (err)
              throw err;
          })
          .pipe(fs.createWriteStream(`${result[1]}`));
      })
  .catch(error => {
    console.log('ERROR: ', error);
  })