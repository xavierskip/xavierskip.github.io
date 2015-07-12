---
layout: post
title: 生日快乐
tags:
- 乱七八糟
---

{% highlight python %}
ans = ask("明年还会祝我生日快乐吗？")
if ans == “NO":
     say(“谢谢。")
else:
     ans = ask(“明年就别祝了吧！")
     if ans == “ok”:
          say(“谢谢。")
     else:
          say(“对不起。")
{% endhighlight %}