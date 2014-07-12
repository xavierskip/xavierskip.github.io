// draw board init
var board = document.getElementById('board'),
    cursor = document.getElementById('cursor');
var btx = board.getContext('2d');
var ctx = cursor.getContext('2d');
var pen = {
    draw: 0,
    x: 0,
    y: 0,
    pos: [],
    lineWidth: 3,
    color: "#000000"
}
btx.strokeStyle = pen.color;
btx.lineWidth = pen.lineWidth;
// drag box
var dragbox = document.getElementById("dragbox");
var setcolor = document.getElementById('setcolor');
var setlineWidth = document.getElementById('setlineWidth');
var clearboard = document.getElementById("clearboard");
var dragtitle = dragbox.querySelector('header');
var drag = 0,startX,startY;
setcolor.value = pen.color;
setlineWidth.value = pen.lineWidth;
// mouse event
function bind () {
    cursor.onmouseenter = function(e){
        document.body.style.cursor = 'none';
        e.preventDefault();
        e.stopPropagation();
    }
    cursor.onmouseleave = function(e){
        document.body.style.cursor = '';        
    }
    cursor.onmouseout = function(e){
        pen.draw = 0;
        ctx.clearRect(0,0,cursor.width,cursor.height); // claear
    }
    cursor.onmousedown = function(e){
        e.preventDefault();
        pen.draw = 1;
        pen.pos = [];
        var beginX = e.offsetX||e.clientX - board.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
        var beginY = e.offsetY||e.clientY - board.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
        // draw
        btx.beginPath();
        btx.moveTo(beginX,beginY);
        pen.pos.push({x: beginX,y: beginY});   
    }
    cursor.onmousemove = function(e){
        var moveX = e.offsetX||e.clientX - board.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft),
            moveY = e.offsetY||e.clientY - board.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
        // cursor
        ctx.clearRect(0,0,cursor.width,cursor.height); // claear
        ctx.beginPath();
        ctx.arc(moveX,moveY,pen.lineWidth/2,0,Math.PI*2) // circle
        ctx.fill();
        ctx.stroke();
        // draw
        if(pen.draw){
            pen.pos.push({x: moveX,y: moveY});
            if(pen.pos.length<3) return;
            pen.pos[2] = {x: (pen.pos[2].x + pen.pos[1].x) / 2, y: (pen.pos[2].y + pen.pos[1].y) / 2};
            btx.quadraticCurveTo(pen.pos[1].x,pen.pos[1].y,pen.pos[2].x,pen.pos[2].y);
            pen.pos.splice(0, 2);
            btx.stroke();
        }
    }
    cursor.onmouseup = function(e){
        if(pen.draw){
        var x = e.offsetX||e.clientX - board.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft),
            y = e.offsetY||e.clientY - board.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);        
        if(pen.pos.length === 1){
            btx.beginPath();
            btx.arc(x,y,btx.lineWidth/2,0,Math.PI*2);
            btx.fill();         
        }
        }
        pen.draw = 0;
    }
    // drag box
    dragtitle.onmousedown = function(e){
        drag = 1;
        e.preventDefault();
        startX = e.clientX - dragbox.offsetLeft;
        startY = e.clientY - dragbox.offsetTop;
    }
    dragtitle.onmouseup = function(e){
        drag = 0;
    }
    dragtitle.onmousemove = function(e){
        if(drag){
            dragbox.style.left = e.clientX - startX + 'px';
            dragbox.style.top = e.clientY - startY + 'px';
        }
    }
    // button function
    clearboard.onclick = function(e){
        btx.clearRect(0,0,board.width,board.height);
    }
    setcolor.onchange = function(e){
        btx.strokeStyle = this.value;
    }
    setlineWidth.onchange =function(e){
        btx.lineWidth = this.value*2;
        pen.lineWidth = this.value*2
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
var image = document.getElementById("image");
var encode = document.getElementById("encode");
// addEventListener
dropinto(image);
bind();
encode.onclick = function(){
    var start = new Date();
    var i = image.querySelector('img');
    var encodeimg = document.getElementById('encodeimg').querySelector('img');
    encodeimg.src = encrypt(i,board)
    var end = new Date();
    console.log("所耗时间 "  + (end-start));  
}
function encrypt(img,canvas){
    // img
    var c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img,0,0);
    var ImageData = ctx.getImageData(0, 0, c.width, c.height);
    var Data = ImageData.data;
    //canvas
    var dataurl = canvas.toDataURL();
    var d = atob(dataurl.slice(dataurl.indexOf(',')+1));
    d+='AlloyImage';
    console.log(d);
    var bin = d.split('').map(function(e){
        var byte = e.charCodeAt(0).toString(2);
        return byte.length<=8? (new Array(9-byte.length)).join('0')+byte: byte
    }).join('');
    // threshold 127
    for(var i=0;i<bin.length;i++){
        var x = Math.floor(i/3)+i;
        var b = Data[x];
        if(bin[i]==1){
            b>=127?1:Data[x]+=127
        }else{
            b<127?1:Data[x]-=127
        }
    }
    ctx.putImageData(ImageData, 0, 0);
    return c.toDataURL();
}