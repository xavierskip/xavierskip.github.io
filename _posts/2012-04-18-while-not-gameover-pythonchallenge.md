---
comments: true
date: 2012-04-18 11:38:54
layout: post
slug: while-not-gameover-pythonchallenge
title: 'while not GameOver:    pythonchallenge()'
wordpress_id: 508
categories:
- Geek
- python
tags:
- game
---

不出意料的话，应该是是个长文



其实很早就知道这个网站了，也不是很早了，去年吧。玩了几关就放在收藏夹内了。再没有动过。

这种网页解密的游戏还有很多类似的。。。比如：[http://notpron.org/notpron/](http://notpron.org/notpron/)

其实攻略我也找到了：



	
  * [http://garethrees.org/2007/05/07/python-challenge/](http://garethrees.org/2007/05/07/python-challenge/) （英文的）

	
  * [http://www.cnblogs.com/jimnox/archive/2009/12/08/tips-to-python-challenge.html](http://www.cnblogs.com/jimnox/archive/2009/12/08/tips-to-python-challenge.html) （中文的）

	
  * wiki [http://wiki.pythonchallenge.com/index.php?title=Main_Page](http://wiki.pythonchallenge.com/index.php?title=Main_Page)


以我的能力这33关，估计得～～～～～～

废话不多说，记录下来，同时督促自己吧。
0;1;





## 第0关




[http://www.pythonchallenge.com/pc/def/0.html](http://www.pythonchallenge.com/pc/def/0.html)


很简单，玩过类似的游戏的都明白。

直接命令行,求出2的38次方，就得到下一关的url了。

    
    >>> print pow(2,38)
    >>> print 2**39
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
    '123123


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
































未完待续～～～
