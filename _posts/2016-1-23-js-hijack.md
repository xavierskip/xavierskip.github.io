---
layout: post
title: Javascript 如何劫持一个绑定了匿名函数的事件？
tags:
- javascript
---
### 由来
在对一个页面二次开发中遇到了一个问题，此页面中有一个节点绑定了一个点击事件，我想在这个点击事件前执行一段函数，根据这个函数再来决定执行这个点击事件。因为原点击事件绑定的是个匿名函数，所以我无法单独来调用这段函数。（也许有办法，我实在不知道）以上是可以在页面中插入新的 Javascript 代码以及最好不要在原有代码上修改所带来的困难。

说简单点就是，在只增加新代码而不修改原有代码的情况下，如何劫持一个绑定了匿名函数的点击事件，使得在原先的点击操作前插入一个操作或者逻辑判断来决定是否执行原有的事件。

开始是想从 jQuery 的 .bind() .live() .delegate() .on() 等绑定事件来入手（这些 jQuery 方法是不是都在冒泡阶段处理事件？），翻了一些资料，也走了一些弯路，最后在了解了DOM 事件处理流程后找到了解决办法。

![DOM event flow](https://www.w3.org/TR/DOM-Level-3-Events/images/eventflow.svg)
图片来源[3]

### 解决过程


因为一般默认的事件处理在冒泡阶段，所以我们首先需要在事件捕获阶段就通过函数来劫持接下来的操作。

`target.addEventListener(type, listener, true );`

然后在函数中阻止接下来的事件冒泡。

{% highlight javascript %}
// 作用于阻止事件向上冒泡。
Event.stopPropagation()
// 不仅阻止向上冒泡，也作用于阻止此节点上绑定相同的事件函数执行。
Event.stopImmediatePropagation()
{% endhighlight %}

但是这么阻止后发现，不仅点击事件被阻止了，我直接用 JavaScript 调用点击事件`.click()`也被阻止了，阻止成功了但我也无法调用点击事件了。还好我发现了一个窍门，Event 事件有一个属性`isTrusted`,根据这个属性我就可以判断是用户点击产生的事件还是 JavaScript 直接调用的事件。

**对用户点击的事件劫持，对 JavaScript 直接调用的放行就可以达到目的了。**

最后强调一点，当自己的劫持事件和被劫持事件绑定的节点是相同时，你要保证你的劫持事件在被劫持事件之前执行，以便可以阻止此节点上事件的所有冒泡（这里说[1]，当事件触发的节点和事件绑定节点相同的时候，没有事件捕获阶段，直接从目标阶段开始，然后就是冒泡阶段了，`addEventListener`的第三个参数是无效的。想起来有人喜欢问“从输入 URL 到页面加载完成的过程中都发生了什么事情？[2]”，那么鼠标在浏览器上的点击到浏览器执行相应的点击操作的过程中又发发生了什么？[3]，那具体的要去看 W3C 的规范）

为了方便以及保险，我选择在父节点上绑定我的劫持事件，再通过`Event.traget`来判断需不需要劫持。

最后上代码
{::nomarkdown}
<a class="jsbin-embed" href="http://jsbin.com/pohogogewu/embed?html,js,console,output" target="_blank">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.35.9"></script>
{:/nomarkdown}

```html
<!DOCTYPE html>
<html>
<head>
<script src="https://code.jquery.com/jquery-1.9.1.js"></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>
<div id="D">DIV
  <a id="A" href="#test">aaa</a>
</div>
</body>
</html>
```
```javascript
var A = document.getElementById('A');

A.addEventListener('click', function(e){
  e.preventDefault();
  console.log('A clicked');
}, false);

var D = document.getElementById('D');

function hijack(){
    if(confirm('y/n ?')){
      A.click();
    }
}

D.addEventListener('click', function(e){
//   console.log(e.target);
  if(e.target == A){
    if(e.isTrusted === true){
      e.stopImmediatePropagation();
      hijack();
    }
  }
}, true);
```

[1]:http://harttle.com/2015/07/31/javascript-event.html
[2]:http://fex.baidu.com/blog/2014/05/what-happen/
[3]:http://www.w3.org/TR/DOM-Level-3-Events/#dom-event-architecture

