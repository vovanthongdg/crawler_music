const mysql = require('mysql');


const conn = mysql.createConnection({
    host    : '000Webhost.com',
    
    user    : 'id13641014_thongdg6688',
    password: 'Thongpro098!',
    database: 'id13641014_lovemusic'
});
//kết nối.
conn.connect(function (err){
    //nếu có nỗi thì in ra
    if (err) throw err.stack;
    //nếu thành công
    console.log('Kết nối thành công!!');
    
});
module.exports = conn;