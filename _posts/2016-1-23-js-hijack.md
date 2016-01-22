---
layout: post
title: Jacascript 如何劫持一个绑定了匿名函数的点击事件？
tags:
- javascript
---

在对一个页面二次开发中遇到了一个问题，此页面中有一个节点绑定了一个点击事件，我想在这个点击事件前执行一段函数，根据这个函数再来决定执行这个点击事件。因为这个点击事件绑定的是匿名函数，所以我无法单独来调用这段函数。（也许有办法，我实在不知道）以上是可以在页面中插入新的 Javascript 代码，最好不要在原有代码上修改所带来的困难，最后还好解决了。

说简单点就是，在只增加新代码而不修改原有代码的情况下，如何劫持一个绑定了匿名函数的点击事件，使得在原先的点击操作前插入一个操作或者逻辑判断来决定是否执行原有的事件。

想了一段时间，翻了一些资料，例如 jQuery 的 .bind() .live() .delegate() .on() 等绑定事件的区别（这些 jQuery 方法是不是都在冒泡阶段处理事件？），也走了一些弯路，最后还是找到了解决办法。


因为一般默认的事件处理在冒泡阶段，所以我们首先需要在事件捕获阶段就通过函数来劫持接下来的操作。

`target.addEventListener(type, listener, true );`

然后在函数中阻止接下来的事件冒泡。

{% highlight javascript %}
// 作用于阻止事件向上冒泡。
Event.stopPropagation()
// 不仅阻止向上冒泡，也作用于阻止此节点上绑定相同的事件函数执行。
Event.stopImmediatePropagation()
{% endhighlight %}

但是这么阻止后发现，不仅点击事件被阻止了，我直接用 javascript 调用点击事件`.click()`也被阻止了，阻止成功了但我无法调用点击事件了。还好我发现了一个窍门，Event 事件有一个属性`isTrusted`,根据这个属性我就可以判断是用户点击产生的事件还是 javascript 直接调用的事件。

用户点击的事件劫持，直接调用的放行就可以达到目的了。

最后强调一点，自己的劫持函数可以直接和被劫持事件绑定的节点是相同的，但是你要保证你的函数在被劫持事件绑定之前已经绑定到节点上了，为了方便以及保险，我选择在父节点上绑定我的劫持事件，再通过`Event.traget`来判断需不需要劫持。

最后代码
{::nomarkdown}
<a class="jsbin-embed" href="http://jsbin.com/pohogogewu/embed?html,js,console,output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.35.9"></script>
{:/nomarkdown}

