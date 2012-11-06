---
comments: true
date: 2012-02-02 07:39:15
layout: post
slug: '%e5%b0%86%e4%bd%a0%e7%9a%84%e9%9d%99%e6%80%81%e7%bd%91%e9%a1%b5%e5%ad%98%e6%94%be%e5%9c%a8googlecode%e4%b8%ad%e5%b9%b6%e5%8f%af%e4%bb%a5%e7%9b%b4%e6%8e%a5%e7%94%a8%e6%b5%8f%e8%a7%88%e5%99%a8%e6%b5%8f'
title: 将你的静态网页存放在Googlecode中并可以直接用浏览器浏览
wordpress_id: 358
categories:
- Geek
tags:
- Googlecode
- html
---

不知道我这个题目表达清楚意思没？

估计没有。



我这个博客不是搭建在[SAE](http://sae.sina.com.cn)上的么，空间有限，而且是需要云豆的，以前每天还送一点云豆，可以免费维持像我这种根本没人看的小站的。但是后来新浪一次性送了我2000云豆后，就不送了，看着每况愈下的云豆数量，不禁担心起来了。



好吧，我平时做的些简单的demo网页本都是放在[SAE](http://sae.sina.com.cn)上的，还是占了很多的空间的。在网上乱逛的时候，发现有人把它制作的网页，小玩意（html,css,js）,直接放到Googlecode上，直接链接出来可以直接浏览器浏览，显示效果。于是这样把我的网页的demo转移到googlecode上不就好了。

我以前只知道Google code 是用来存放代码的开源社区。就像**[GitHub](https://github.com/)**一样吧。原来还可以这么用，屌暴了。







于是我就去创建一个我的Googlecode吧，结果第一次版本控制选择了git，应该选择svn的，没用过git，暂时先不接触，以后再来摸索**[GitHub](https://github.com/)**



svn也是因为SAE需要svn来部署代码，，使用的是TortoiseSVN，不过有人说git好些。以后再说吧。

我创建的 svn [http://code.google.com/p/xavierskips/](http://code.google.com/p/xavierskips/) git [http://code.google.com/p/xavierskip/](http://code.google.com/p/xavierskip/) 这个版本控制方式选错了可以再设置么？



就再创建了个，这回没选错，svn就把代码传上去了，结果打开一看，文件会直接以文本的方式在浏览器中显示而不是网页被浏览器运行呀！？？

我就搞不清楚了，Google之～～

终于了解了    [Google Code里的HTML文件显示源代码的问题](http://younglab.blog.51cto.com/416652/353061)


> 一直都发现自己在Google Code上的HTML文件打开后都是显示源代码（有些文件在IE里面能看到页面），一直不知道什么原因，今天在查看Google Code的时候，无意间打开了Firebug，发现HTML文件的响应头信息Content-Type`为text/plain，而实际上应该是``text/html。于是上网搜了下，原来是需要修改SVN的自动属性svn:mime-type。`




当然你手动为每个文件设置属性然后上传也行，我很懒，可以自动么？当然有这个功能。

可以配置SVN的config文件，自动添加文件属性，上传。



config 配置文件的位置:



	
  * Unix 平台全局的配置文件 位置为：/etc/subversion/config；每个用户主目录 还有配置文件覆盖全局配置文件的设置：~/.subversion/config；

	
  * Windows 平台全局配置文 件：%ALLUSERSPROFILE%\Application Data\Subversion\config，用户个人配置文件：%APPDATA%\Subversion\config


win7 的话，应该是在这里 C:\Users\#username#\AppData\Roaming\Subversion\config



国际惯例 # 后面的是注释，找到 enable-auto-props，设置enable-auto-props=yes，然后找到 [auto-props]

在 [auto-props] 下面添加 mime-type：

不过我好像只需要这两行

    
    *.htm* = svn:eol-style=native;svn:mime-type=text/html;svn:keywords=Rev Date
    *.css = svn:eol-style=native;svn:keywords=Rev Date


完整版

    
    *.java = svn:eol-style=native;svn:keywords=Rev Date
    *.xml = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    *.xsl = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    *.xsd = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    *.xjb = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    *.wsdl = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    *.properties = svn:mime-type=text/plain;svn:eol-style=native;svn:keywords=Rev Date
    .checkstyle = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    .pmd = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    .ruleset = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date
    *.c = svn:eol-style=native;svn:keywords=Rev Date
    *.cpp = svn:eol-style=native;svn:keywords=Rev Date
    *.h = svn:eol-style=native;svn:keywords=Rev Date
    *.dsp = svn:eol-style=CRLF
    *.dsw = svn:eol-style=CRLF
    *.sh = svn:eol-style=native;svn:executable
    *.bat = svn:eol-style=native
    *.pl = svn:eol-style=native
    *.py = svn:eol-style=native
    *.cmd = svn:eol-style=native
    *.txt = svn:eol-style=native;svn:mime-type=text/plain
    *.cat = svn:eol-style=native;svn:mime-type=text/plain
    *.htm* = svn:eol-style=native;svn:mime-type=text/html;svn:keywords=Rev Date
    ChangeLog = svn:eol-style=native;svn:mime-type=text/plain
    README* = svn:eol-style=native;svn:mime-type=text/plain
    LICENSE* = svn:eol-style=native;svn:mime-type=text/plain
    NOTICE* = svn:eol-style=native;svn:mime-type=text/plain
    TODO* = svn:eol-style=native;svn:mime-type=text/plain
    KEYS* = svn:eol-style=native;svn:mime-type=text/plain
    INSTALL* = svn:eol-style=native;svn:mime-type=text/plain
    WHATSNEW* = svn:eol-style=native;svn:mime-type=text/plain
    NEWS* = svn:eol-style=native;svn:mime-type=text/plain
    COPYING = svn:eol-style=native;svn:mime-type=text/plain
    *.png = svn:mime-type=image/png
    *.jpg = svn:mime-type=image/jpeg
    *.gif = svn:mime-type=image/gif
    Makefile = svn:eol-style=native
    *.css = svn:eol-style=native;svn:keywords=Rev Date
    *.js = svn:eol-style=native
    *.jsx = svn:eol-style=native
    *.cxf = svn:mime-type=text/xml;svn:eol-style=native;svn:keywords=Rev Date


搞定，看这里，blog上的链接也搞好了，也许我也没说清楚，不清楚哦，下面留言

[http://xavierskips.googlecode.com/svn/trunk/](http://xavierskips.googlecode.com/svn/trunk/)

[http://xavierskips.googlecode.com/svn/trunk/merryxmas/xxx.html](http://xavierskips.googlecode.com/svn/trunk/merryxmas/xxx.html)

[http://xavierskips.googlecode.com/svn/trunk/loca/index.html](http://xavierskips.googlecode.com/svn/trunk/loca/index.html)

[http://xavierskips.googlecode.com/svn/trunk/newyear/newyear.html](http://xavierskips.googlecode.com/svn/trunk/newyear/newyear.html)


