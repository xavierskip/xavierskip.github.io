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
                var i = decrypt(img); // decode DataURL
                i?document.getElementById('deimg').src=i:0
            }
        })(file);
        reader.readAsDataURL(file);
    },true);  
}
function decrypt(img){
    var c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img,0,0);
    var data = ctx.getImageData(0,0,c.width,c.height).data;
    var rgb = [];
    for(var i=0;i<data.byteLength;i++){
        if((i+1)%4!=0){
            var b = data[i];
            b>=127?b=1:b=0;
            rgb.push(b);        
        }
    }
    var ascii = rgb.join('').match(/[01]{8}/g).map(function(b){
        return String.fromCharCode( parseInt(b,2) )
    }).join('');
    var pos = ascii.indexOf('AlloyImage');
    if(pos!=-1){
        console.log(ascii.slice(0,pos));
        var b64 = btoa(ascii.slice(0,pos));
        return "data:image/png;base64,"+b64;
    }else{
        console.log(-1)
        return -1;
    }
}

var decodeimg = document.getElementById('decodeimg');
dropinto(decodeimg);

