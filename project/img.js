var carrier = document.getElementById("carrier");
var hidden = document.getElementById("hidden");
var encode = document.getElementById("encode");
var decode = document.getElementById("decode");
var enimg = document.getElementById("enimg");
var deimg = document.getElementById("deimg");
//
function isImage(type) {
    switch (type) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/bmp':
        case 'image/jpg':
            return true;
        default:
            return false;
    }
}
// drag and drop
function dropinto(ele){
    var text = ele.textContent;
    ele.addEventListener('dragenter',function(e){
        this.classList.add('over');
        !this.querySelector('img') && (this.textContent = 'drop into there');        
    },true);
    ele.addEventListener('dragover',function(e){
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.        
    },true);
    ele.addEventListener('dragleave',function(e){
        this.classList.remove('over');
        !this.querySelector('img') && (this.textContent = text);
    },true);
    ele.addEventListener('drop',function(e){
        e.stopPropagation();
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        this.classList.remove('over');
        var thebox = this;
        //
        var reader = new FileReader();
        reader.onload = (function(thefile){
            thebox.innerHTML = '';
            return function(e){
                var img = new Image();
                img.className = 'preview'
                img.src = e.target.result;
                thebox.appendChild(img);
            }
        })(file);
        reader.readAsDataURL(file);        
    },true);  
}
// addEventListener
dropinto(carrier);
dropinto(hidden);
// img function
encode.onclick = function(){
    var start = new Date();
    var cImg = carrier.querySelector('img');
    var hImg = hidden.querySelector('img')
    // hidden
    var h_DataURL = hImg.src;
    var d = atob(h_DataURL.slice(h_DataURL.indexOf(',')+1))+'andsoon'
    var h_bin = d.split('')
    .map(function(e){
        var byte = e.charCodeAt(0).toString(2);
        return byte.length<=8? (new Array(9-byte.length)).join('0')+byte: byte
    }).join('');
    // get source img width height
    var i = new Image();
    i.src = cImg.src;
    // canvas
    var c = document.createElement('canvas');
    c.width = i.width;
    c.height = i.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(cImg,0,0);
    var img = ctx.getImageData(0, 0, c.width, c.height);
    var data = img.data;
    for(var i=0;i<h_bin.length;i++){
        var x = Math.floor(i/3)+i;
        var b = data[x];
        if(h_bin[i]==1){
            b>=127?1:data[x]+=127
        }else{
            b<127?1:data[x]-=127
        }
    }
    ctx.putImageData(img, 0, 0);
    enimg.textContent = ''; // clear 
    enimg.appendChild(c);
    var end = new Date();
    console.log("所耗时间 "  + (end-start));  
}
decode.onclick = function(){
    var e = document.getElementById('enimg').querySelector('canvas');
    var etx = e.getContext('2d');
    var img = etx.getImageData(0,0,e.width,e.height);
    var data = img.data;
    var rgb = [];
    for(var i=0;i<data.byteLength;i++){
        if((i+1)%4!=0){
            var b = data[i];
            b>=127?b=1:b=0;
            rgb.push(b);        
        }
    }
    var rgbs = rgb.join('')
    var str = rgbs.match(/[01]{8}/g)
    .map(function(b) { return String.fromCharCode( parseInt(b,2) ) })
    .join('');
    var end = str.search(/andsoon/);
    var ascii = str.slice(0,end);
    var base64 = btoa(ascii);
    var base64img = new Image();
    base64img.src = "data:image/png;base64,"+base64;
    deimg.textContent = ''; // clear 
    deimg.appendChild(base64img);
}