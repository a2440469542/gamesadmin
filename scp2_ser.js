const request = require('request');
const FormData = require('form-data');
const fs = require('fs');
 
// 文件路径和服务器上传API的URL
const filePath = './dist/test.ico';
const uploadUrl = 'https://test.rs6bot.com/admin/';
 
// 创建form-data
const formData = new FormData();
formData.append('file', fs.createReadStream(filePath));
 
// 配置request选项
const options = {
  method: 'POST',
  url: uploadUrl,
  headers: {
    Authorization:"b33bd6377644db431adae4c07a8510e6707249abf35991cf53dae7f31ac342b9",
    ...formData.getHeaders()
  },
  body: formData,
  // 如果你想要看到进度，可以取消注释下面的行
  onPart: part => {
    if (part.byteCount) {
      console.log(`Uploaded ${part.byteCount} bytes`);
    }
  }
};
 
request(options, function(error, response) {
  if (error) {
      console.log("error",error)
  }else{
    console.log(response.body);

  }
});