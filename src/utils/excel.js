/**
 * JS转成ex文件，前端进行导出
 * @param {*} JSONData  JSON数据
 * @param {*} FileName   你希望导出文件的文件名
 * @param {*} title     你希望的字段名也就是表头，一般情况下直接，没有特殊需求的话直接填入false就好
 * @param {*} filter   你希望过滤的行数   如果没有也直接填入false就好
 */
export const JSONToExcelConvertor = (JSONData, FileName, title, filter) => {
  if (!JSONData)
      return;
  //转化json为object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  var excel = "<table>";
  //设置表头  
  var row = "<tr>";
  if (title) {
      //使用标题项
      for (var i in title) {
          row += "<th align='center'>" + title[i] + '</th>';
      }
  }
  else {
      //不使用标题项
      for (var i in arrData[0]) {
          row += "<th align='center'>" + i + '</th>';
      }
  }
  excel += row + "</tr>";
  //设置数据  
  for (var i = 0; i < arrData.length; i++) {
      var row = "<tr>";
      for (var index in arrData[i]) {
          //判断是否有过滤行
          if (filter) {
              if (filter.indexOf(index) == -1) {
                  var value = arrData[i][index] == null ? "" : arrData[i][index];
                  row += '<td>' + value + '</td>';
              }
          }
          else {
              var value = arrData[i][index] == null ? "" : arrData[i][index];
              row += "<td align='center'>" + value + "</td>";
          }
      }
      excel += row + "</tr>";
  }
  excel += "</table>";

  //下面是构建文件的代码
  var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";
  var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
  //创建一个a标签
  var link = document.createElement("a");
  //给a标签一个路径
  link.href = uri;
  //为了防止这个a标签显示在视图上，需要先把他隐藏
  link.style = "visibility:hidden";
  //为文件添加后缀名，告诉他这是一个ex文件
  link.download = FileName + ".xls";
  //把a标签添加到body上
  document.body.appendChild(link);
  //触发a标签，等于访问这个文件地址，实现文件下载
  link.click();
  //文件下载完毕后删除a标签，以免对DOM产生冗余
  document.body.removeChild(link);
} 

