//footer  custom
function tounicode(str){
    return str.split('')
    .map(function(e){
        var byte = e.charCodeAt(0).toString(16);
        return byte.length<=4? "\\u"+(new Array(5-byte.length)).join('0')+byte: "\\u"+byte
    }).join('');
}
var bq = [
"\u0044\u006f\u006e\u0027\u0074\u0020\u006e\u0065\u0076\u0065\u0072\u0020\u0074\u0072\u0079\u0020\u0074\u006f\u0020\u006a\u0075\u0064\u0067\u0065\u0020\u006d\u0065\u0020\u0044\u0075\u0064\u0065\u002c\u0020\u0079\u006f\u0075\u0020\u0064\u006f\u006e\u0027\u0074\u0020\u006b\u006e\u006f\u0077\u0020\u0077\u0068\u0061\u0074\u0020\u0046\u0075\u0063\u006b\u0020\u0049\u0020\u0062\u0065\u0065\u006e\u0020\u0074\u0068\u0072\u006f\u0075\u0067\u0068",
"\u0049\u0074\u0027\u0073\u0020\u006f\u006e\u006c\u0079\u0020\u0061\u0066\u0074\u0065\u0072\u0020\u0077\u0065\u0027\u0076\u0065\u0020\u006c\u006f\u0073\u0074\u0020\u0065\u0076\u0065\u0072\u0074\u0068\u0069\u006e\u0067\u0020\u0074\u0068\u0061\u0074\u0020\u0077\u0065\u0027\u0072\u0065\u0020\u0066\u0072\u0065\u0065\u0020\u0074\u006f\u0020\u0064\u006f\u0020\u0061\u006e\u0079\u0074\u0068\u0069\u006e\u0067\u0021",
"\u0049\u0020\u0062\u0065\u006c\u0069\u0065\u0076\u0065\u0020\u0077\u0068\u0061\u0074\u0065\u0076\u0065\u0072\u0020\u0064\u006f\u0065\u0073\u006e\u0027\u0074\u0020\u006b\u0069\u006c\u006c\u0020\u0079\u006f\u0075\u002c\u0020\u0073\u0069\u006d\u0070\u006c\u0079\u0020\u006d\u0061\u006b\u0065\u0073\u0020\u0079\u006f\u0075\u0020\u002e\u002e\u002e\u0020\u0073\u0074\u0072\u0061\u006e\u0067\u0065\u0072",
"\u53c2\u5dee\u591a\u6001\u4e43\u5e78\u798f\u672c\u6e90",
"\u4f60\u95ee\u6211\u8981\u53bb\u5411\u4f55\u65b9\uff0c\u6211\u6307\u7740\u5927\u6d77\u7684\u65b9\u5411",
"\u81ea\u6211\u6210\u957f\u9700\u8981\u9760\u624b\u6deb",
"\u4e0d\u8981\u6362\u6211\u4e0b\u573a\uff0c\u6211\u6b7b\u540e\u591a\u7684\u662f\u65f6\u95f4\u4f11\u606f"
]
function random(len){
  return Math.floor(Math.random()*len)
}
var input = document.getElementById("quote");
input.innerText = bq[random(bq.length)];