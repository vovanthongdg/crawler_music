// Gọi module Nightmare để sử dụng
const Nightmare = require('nightmare');
 // thêm option lúc khởi tạo nightmare
const nightmare = Nightmare({
  gotoTimeout: 10000,
  show: true // hiển thị web khi chạy, nếu không có option này thì chạy ẩn
})
// sau khi khởi tạo -> truy xuất vào trang vnexpress.net
nightmare.goto('http://vnexpress.net/')
.evaluate(function () {
    // news là 1 mảng chứa các thẻ <a> nằm trong <div> có class 'title_news'
    let news = document.querySelectorAll('.title_news a');
    // khai báo 1 mảng rỗng để chứa các tiêu đề
    let titles = [];
    // chạy qua mảng này và lấy tiêu đề
    news.forEach((article) => { // article ở đây là mỗi phần tử trong mảng news
      titles.push(article.innerText.trim()); // lần lượt đẩy các tiêu đề vào mảng titles
    })
    return titles; // kết thúc hàm trả về mảng titles
  })

.end() // kết thúc quy trình trên electron -> đóng electron
  .then(function (titles) { // titles trong then() này chính là kết quả titles đc trả về ở trên
    console.log(titles);
    console.log('Số lượng bài viết: ', titles.length);
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR: ', error);
  })
