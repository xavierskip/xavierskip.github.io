---
comments: true
date: 2012-08-13 02:20:36
layout: post
title: 阶乘以及后面有几个零
wordpress_id: 601
tags:
- python
---


求阶乘 递归的方式，但是貌似不能求大于999的数，999可以，1000就不行了。

    
{% highlight python %}
from sys import argv

len = int(argv[1])
def fact(num):
    if num>1:
    	return num*fact(num-1)
    else:
    	return 1

print '%d!: %d' %(len,fact(len)) 
{% endhighlight %}    



迭代的方式，那种更好咧？

    
{% highlight python %}    
from sys import argv
    
len = int(argv[1])
    
def fact(num):
    r = 1
    while num>1:
    	r *=num
    	num=num-1
    return r
    
print '%d!: %d' %(len,fact(len))
{% endhighlight %}     




某个阶乘数后面有几个零
计算n的阶乘末尾有多少个0，例如5! = 120 末尾有1个0，10!= 3628800末尾有2个0。
有多少的个零取决于有几个因子5，比如 100/5 = 20 , 20/5 = 4 , 4/5 = 0 ,总共有20+4+0 = 24个，100！后面就有24个零。


    
{% highlight python %}     
from sys import argv
    
num   = int(argv[1])
def main(num):
    count = num/5
    if num/5 != 0:
    	count += main(num/5)
    	return count
    else:
    	return 0
    
print main(num)
{% endhighlight %}     
