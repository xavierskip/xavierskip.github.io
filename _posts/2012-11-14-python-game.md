---
layout: post
excerpt: pythonchallenge 游戏
title: python challenge
tags:
- game
- python
---




其实很早就知道这个网站了，也不是很早了，去年吧。玩了几关就放在收藏夹内了。再没有动过。

这种网页解密的游戏还有很多类似的。。。比如：[http://notpron.org/notpron/](http://notpron.org/notpron/)

其实攻略我也找到了：

	
  * [http://garethrees.org/2007/05/07/python-challenge/](http://garethrees.org/2007/05/07/python-challenge/) （英文的）

	
  * [http://www.cnblogs.com/jimnox/archive/2009/12/08/tips-to-python-challenge.html](http://www.cnblogs.com/jimnox/archive/2009/12/08/tips-to-python-challenge.html) （中文的）

	
  * wiki [http://wiki.pythonchallenge.com/index.php?title=Main_Page](http://wiki.pythonchallenge.com/index.php?title=Main_Page)


以我的能力这33关，估计得～～～～～～

废话不多说，记录下来，同时督促自己吧。


## 第零关
[http://www.pythonchallenge.com/pc/def/0.html](http://www.pythonchallenge.com/pc/def/0.html)


很简单，玩过类似的游戏的都明白。

直接命令行,求出2的38次方，就得到下一关的url了。

    
    >>> print pow(2,38)
    >>> print 2**38
    274877906944


## 第一关
[http://www.pythonchallenge.com/pc/def/map.html](http://www.pythonchallenge.com/pc/def/map.html)


根据给出的图  K >M  ;  O > Q ; E > G ;

应该就是根据字母表的顺序后移两位就可以解出密文的内容了。

首先想到的是 replace() ,不能进行多个替换好麻烦，一点都不酷，翻书看看还有什么好办法么？

在讲translate方法中有介绍 maketrans 函数，可以根据自己的要求创建一个转换表，作为 translate 方法的参数进行转换
就像这样：

    
    >>> from string maketrans
    >>> table = maketrans('abc','123')
    >>> 'abc123'.translate(table)
    123123


当然我们可以把这样替换maketrans('abcdef……xyz','cdefgh……zab'),不过是不是太傻了？？

而据我所知 lowercase 正是这样的小写字符串。so：

    
    from string  import maketrans,lowercase
    text = "g fmnc wms bgblr rpylqjyrc gr zw fylb.…………………………"
    #这句话有点长，我就不都贴上了
    L = lowercase
    table = maketrans(L,L[2:]+L[:2])
    print text.translate(table)
    raw_input() #这样就可以看见结果，不会运行完CMD窗口就关闭了。。


于是我们得到了下面这段话
“i hope you didnt translate it by hand. thats what computers are for. doing it in by hand is
inefficient and that's why this text is so long. using string.maketrans() is recommended. now
apply on the url.”
就是我们用这个规则转换下url就得到下一关的地址了。map>>ocr 脑补就够了
Go！！！


## 第二关
[http://www.pythonchallenge.com/pc/def/ocr.html](http://www.pythonchallenge.com/pc/def/ocr.html)

根据提示在源代码中找

就找到了`<!--find rare characters in the mess below:-->`

要我们在下面的乱码中找到少见的字符。（我使劲看都没有在下面的乱码中看见字符。。）

于是我们先将页面下下来，然后正则找出这堆乱码，然后再在乱码中找出字符串，试一下

{% highlight python %}
import urllib2,re

html = urllib2.urlopen("http://www.pythonchallenge.com/pc/def/ocr.html").read()
txt = re.compile(r'<!--([^\B]+?)-->').findall(html)[-1]  
print ''.join(re.findall('[A-Za-z]',txt))
{% endhighlight %}

也没搞清楚正则中`\B`的意思。瞎猫碰死老鼠搞出来的  
`\B` = `[^\b]` 而 `\b` 匹配 `\w` 和 `\W` 之间，把我搞糊涂了。。

算了不纠结正则表达式了，进入下一关。


## 第三关
[http://www.pythonchallenge.com/pc/def/equality.html](http://www.pythonchallenge.com/pc/def/equality.html)

第三关还是一样的。依旧是根据提醒从网页源码中的一堆乱码中找出内容。

>hints：“One small letter, surrounded by EXACTLY three big bodyguards on each of its sides.”

就是要找出那些小写字母，这个小写字母的左右都有三个大写字母。

`re.findall('[^A-Z][A-Z]{3}?([a-z])[A-Z]{3}[^A-Z]', text)`

这个正则就可以了

## 第四关
[http://www.pythonchallenge.com/pc/def/linkedlist.php](http://www.pythonchallenge.com/pc/def/linkedlist.php)

一样的在源代码中找到提示，似乎页面上有个链接，点点看！返回`and the next nothing is 44827`   
看来就是不停的将返回的 nothing 参数提交，看看最后返回的是什么？？
因该会是答案。
{% highlight python %}
import urllib2

def catch(url,nothing):
	response = urllib2.urlopen(url+nothing).read()
	print response
	return response.split()[-1]

url = 'http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing='
nothing = '12345'
for x in xrange(1,400):
	print x,'!'
	nothing = catch(url,nothing)
{% endhighlight %}

他说不会超过400次，我相信他。来试一下。

我盯着终端看，在277次的时候，返回了`peak.html`。可是还会继续返回 nothing。管他的呢，通关。

## 第五关
[http://www.pythonchallenge.com/pc/def/peak.html](http://www.pythonchallenge.com/pc/def/peak.html)


什么玩意？“pronounce it” 发音？ “peak hell sounds familiar ??”，然后就发现有个 `baner.p`文件，里面是一些〜 实在搞不懂于是就翻攻略了。

需要用到 `pickle`模块，pickle的发音是不是像peak hell? 查了点资料，这个模块的作用就是将 python 中的对象序列化以及反过来，`baner.p`中的内容就是序列化的对象，我们将它转化为对象就会看见

	[[(' ', 95)], [(' ', 14), ('#', 5), (' ', 70), ('#', 5), (' ', 1)], [(' ', 15), ('#', 4), (' ', 71), ('#', 4), (' ', 1)], .......

称它多维列表？发现每一维的数字加起来都是95，会不会是数字就是多少个字符，每一维就是一行？？打印出来试一试。

{% highlight python  linenos %}
import urllib2,pickle

p = urllib2.urlopen('http://www.pythonchallenge.com/pc/def/banner.p')
data = pickle.load(p)

for row in data:
	t = ''
	for x in row:
		t += x[0]*x[1]
	print t

# 可是要列表解析才 pythonic 嘛
print '\n'.join([''.join([ x[0]*x[1] for x in row]) for row in data])
{% endhighlight%}

然后你就看见了

## 第六关
[http://www.pythonchallenge.com/pc/def/channel.html](http://www.pythonchallenge.com/pc/def/channel.html)

惯例，看源代码，没看见什么信息，就看见要捐助的信息了。可是这么过关咧？看见了注释`<!--<--zip-->`把html替换成zip试一下？

于是就`wget  http://www.pythonchallenge.com/pc/def/channel.zip`,果然得到了一个zip文件，解压一看，好多txt文件，每个文件的内容就是nothing的值什么的，还有一个README，里面有两个提示：

1. 开头是90052文件。
2. 答案就在其中。

头大~




























未完待续～～～
