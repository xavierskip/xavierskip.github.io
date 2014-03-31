---
layout: post
title: 腾讯《前端突击队》第二季（攻略）
tags: 
- 前端
- 技术
---

发现这个玩意是偶然的一次使用 web QQ的时候打开控制台发现了这个[http://codestar.alloyteam.com/](http://codestar.alloyteam.com/),就玩通了第一季。这不第二季又开始了。

题目范围挺广的，很多都不知道，不过不知道不要紧，可以上网查资料就行。花了一些时间，在一些难点上卡了一段时间，不过还是搞定了。唯独“腐蚀的画”那道始终找不到头绪，根据题目的解释就是找不到相应的字符，看来还另有蹊跷，请大侠赐教！


// start

**以下哪个js库是国产的？**(D) // 因为没听说过。哈哈

A. jQuery  
B. MochiKit  
C. MooTools  
D. JX  

**在js数字类型中浮点数的最高精度多少位小数？**(C) // 自行搜索

A. 15  
B. 16  
C. 17  
D. 18  

**下面关于进程跟线程的描述哪个正确？** (C)

A. 一个线程只有一个进程  
B. 一个进程只有一个线程  
C. 一个进程可以有多个线程  
D. 一个线程可以有多个进程  


**在IOS中大于(不等于)哪个系统版本开始支持position:fixed？**(C) //搜索得到

A. 3.2  
B. 4.2  
C. 4.3  
D. 5.0  

**[]==[] 返回什么？** (B) //控制台一试就知道了

A. true  
B. false  
C. error  
D. 0  

**在正则表达式中，负向先行断言是？**(B) //自行搜索 “正则  负向先行断言”

A. !?)  
B. (?!  
C. =?)  
D. (?=  

**以下哪个css属性可能会引起移动端（如IOS7等）多行省略号( 利用text-overflow: ellipsis)的样式变异？**(D)   //自行搜索

A. box-sizing: border-box;  
B. word-break: break-all;  
C. box-shadow: 1px 0 #fff;  
D. text-align:justify;  
E. transform: translate3d(0, 0, 0);  

**Node.js的适用场景是？**(B)  //呵呵，不会Node.js ,道听途说，瞎蒙的

A. 大循环、聊天、大数据  
B. 高并发、聊天、实时推送  
C. 高并发、聊天、大数据  
D. 实时推送、多进程、大数据  


<a href="//a.xxx.com" ></a> //送分题，用过 jQuery 或者 其他 js 库的 CDN 的都知道。


**下列哪个移动端属性可以禁止用户选中文字** (B) //没接触过移动开发，通过搜索

A. -webkit-touch-callout:none  
B. -webkit-user-select: none  
C. -webkit-text-size-adjust: none  
D. -webkit-transform: rotateX(100deg)  
E. -webkit-appearance: none  

**~~520.1314 等于什么？**(B) //通过控制台

A. -520.1314  
B. 520  
C. 0.1314  
D. 520.1314  

**以下那个缓存控制方法不会与server校验新鲜度?** (C) // http协议里面的

A. Cache-Control: max-age=0  
B. Cache-Control: no-cache  
C. Cache-Control: no-store  
D. Cache-Control: must-revalidate  

**请填入正确的CSS使子元素2宽度自适应填满整行，父元素及子元素1宽度不确定**
// 这个难倒我了，父元素和其中一个子元素的宽度都不确定，css的元素定位和文本流本就是难点不好理解，特别还是这种位置不固定的流体布局。不过最后还是找到了 css3的新属性 flex搞定了。
[使用 CSS 弹性盒](https://developer.mozilla.org/zh-CN/docs/CSS/Tutorials/Using_CSS_flexible_boxes)
[CSS box-flex属性，弹性盒子模型简介](http://www.zhangxinxu.com/wordpress/2010/12/css-box-flex%E5%B1%9E%E6%80%A7%EF%BC%8C%E7%84%B6%E5%90%8E%E5%BC%B9%E6%80%A7%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B%E7%AE%80%E4%BB%8B/)

    .parent{
        display: flex;
    }
    .child1{
        flex: 1;
    }
    .child2{
        flex: 1;
    }


**下面代码，若在同步执行的情况下，得到的结果是?** (D) //同步执行！？不太清楚

    var countLen = 4;
    while(countLen--){
        (function(i){
            setTimeout(function(){
                alert(i);
            },0);
        })(countLen);
        alert(countLen);
    }

A. 32103201  
B. 32102103  
C. 32100123  
D. 32103210  
E. 32101023  

**从性能上看，以下哪个效率最低?** （D）

A. 使用常量  
B. 使用变量  
C. 访问数组元素  
D. 访问对象属性  

//完成上面的题，就可以进入新的地图了！


**请补全代码使得输入框在iPhone浏览器上能够呼起图示的键盘**

    Text: <input type="text" /> <!-- display a standard keyboard -->
    Telephone: <input type="tel" /> <!-- display a telephone keypad -->
    URL: <input type="url" /> <!-- display a URL keyboard -->
    Email: <input type="email" /> <!-- display an email keyboard -->
    Zip Code: <input type="text" pattern="[0-9]*" /> <!-- display a numeric keyboard -->


**请填入正确的CSS使容器相对父元素垂直水平居中定位(父容器及子元素大小不确定)**
// 我想很多人都遇到过这种问题，这种应该是是最基础的视觉效果在css中的实现却是这么的麻烦。唉！
{% highlight css %}
.child{
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin:auto;
} 
{% endhighlight %}

**吃了太多啤酒与炸鸡，产品MM肚子疼得不行，需求根本交不了差，怎么办？来自星星的前端特工，你，只能尝试用超能力停止时间了！据说，当创造出的时间等于地球时间时，就会代替地球时间流逝，使时间静止…**

//好像在腾讯前端特工第一季就有这么一道题，我还记得。我折腾了半天，还以为要发送数据到服务器上，哪知道，创建一个提交按钮，手点更新时间就可以了！！！
{% highlight html %}
    <input id="power" type="text" placeholder="超能力创造的时间" value="0:0:0">
    <input type="submit" value="提交" onclick="document.getElementById('power').value = (new Date()).getHours()+':'+(new Date()).getMinutes()+':'+(new Date()).getSeconds()">
{% endhighlight %}

**请完成如下所示 loading效果:**
**请在下面空格处补齐代码:输入必要的css:**
//其实很简单，但是只有当你填进正确的数据才会有动画，坑爹！
{% highlight css %}
.container,#content,.ring{
    border-radius: 75px;
}
#cspan {
    -webkit-animation: fade 1s linear infinite;
}
@-webkit-keyframes fade {
    from {
        opacity: 0;  
    } 50% {
        opacity: 1;  
    } to {
        opacity: 0;
    }
}
.ring {
    -webkit-animation: rotate 1s linear infinite;
}
@-webkit-keyframes rotate {
    0 {
        transform: rotate(0deg);
    } 100% {
        transform: rotate(360deg);
    }
}
{% endhighlight %}

// 进入最后的地图了！！

**下面是在Android 4.0+设备上Wi-fi网络下以"Transfer-Encoding:chunked"方式返回的页面[HTML5 Navigation timing](http://www.w3.org/TR/navigation-timing/) 上报数据图，我们修改了其中一项数据的延时，试找出这项被修改的非正常数据：**  
**测速点上报量延时慢速用户占比 **  ( M ) //这个真的是蒙的。

A. unloadEventStart|660|0.711621|4.55%
B. unloadEventEnd|660|0.711636|4.55%
C. redirectStart|0-|-
D. redirectEnd|0-|-
E. fetchStart|150050|0.00279225|-
F. domainLookupStart|153640|0.00320123|-
G. domainLookupEnd|153640|0.00704166|0.03%
H. connectStart|153640|0.00704166|0.03%
I. connectEnd|153640|0.00885284|0.03%
J. requestStart|153700|0.00886571|0.03%
K. responseStart|153700|0.01796|0.04%
L. responseEnd|1314680|0.825854|2.86%
M. domLoading|1314710|1.216628|2.6%
N. domInteractive|1314530|1.7728|5.71%
O. domContentLoadedEventStart|1314530|1.77283|5.71%
P. domContentLoadedEventEnd|1314530|1.77284|5.71%
Q. domComplete|1011240|1.68819|3.95%
R. loadEventStart|1011240|1.68848|3.95%
S. loadEventEnd|1011240|1.68848|3.95%
 
### 火柴人动画

// 看源码，知道了这么创建动作，根据其他模板套用即可，同步的问题，找到动画对象的同步方法调用即可。可能难住人的是提交答案的方式。我是直接安装源码中的 submit()提交方式提交的。

{% highlight javascript %}
var answers = {
    naughty1: "naughty1.playTo('gaocha',30,15,true).setPos(880,300).synchto(referObj);",
    naughty2: "naughty2.playTo('gaocha',30,15,true).setPos(80,540).setReverse(false).synchto(referObj)",
    naughty3: "naughty3.playTo('gaocha',30,15,true).setPos(240,540).synchto(referObj)"
}
window.parent.postMessage({
    type : 'checkAnswer',
    data : {answer:answers}
}, '*');
{% endhighlight %}

###[腐蚀的画](http://codestar.alloyteam.com/q2/cgi/q/b29b6a737c6e38edddb380ce54ae672b621efbec15cf4ea02293611594bed3c4)
// 难点在于，第二步，对rgb的四个信息，想办法让它变成0和1。如果你直接将数值转化为二进制，那么你就将陷进沼泽中。你需要反相的去思考出题人是如何将信息藏到那张图中间去的。最后经人点拨，是使用了图像处理最常见二值化方法，这样答案就一目了然了。
{% highlight javascript %}
var c = document.getElementById('myCanvas'),
    img = document.getElementById('myImg');
var ctx = c.getContext('2d');
ctx.drawImage(img,0,0);
var imgData = ctx.getImageData(0,0,c.width,c.height);
var data = imgData.data;
var rgb = [];
for(var i=0;i<data.byteLength;i++){
    if((i+1)%4!=0){
        var b = data[i];
        b>127?b=1:b=0;
        rgb.push(b);        
    }
}
var rgbs = rgb.join('')
var str = rgbs.match(/[01]{8}/g)
.map(function(b) { return String.fromCharCode( parseInt(b,2) ) })
.join('');
var end = str.search(/AlloyImage/);
var ascii = str.slice(0,end);
var base64 = btoa(ascii);
var base64img = document.getElementById("base64");
base64img.src = "data:image/png;base64,"+base64;
{% endhighlight %}