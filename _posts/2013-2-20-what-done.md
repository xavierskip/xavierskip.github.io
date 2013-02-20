---
layout: post
title: 过去做了点什么
tags: 乱七八糟
---

过去的好长一段时间blog都没怎么动过了。也许从来都没有人看，缺少一种动力吧。

从前有一只小鸟，它有着世界上最优美动听的嗓音，它生活在一个山谷，山谷中也没有其他的小鸟，而它从来没能飞出这个山谷。有一天小鸟死了。那这个歌声最美的小鸟在这个世界上存在过吗？？

看了许多，想了许多，可是觉得没什么好说的。作罢。

那就看我做了什么吧。

之前在准备用js写一个迷宫小游戏。使用`<canvas>`元素来画图，通过查找了些迷宫生成的算法，总算能够画出迷宫出来了，不过游戏最重要的构成，操作部分由于某些因素，搁置下来了，不了了之〜

接下来想，了解web编程，一如既往的pyton，选择了flask这个高级的web框架，跟着官方教程中的例子中写了个小网站，还是有点意思的，不过使用的高级web框架，对于网络编程抽象了太多，对于网络编程还是没有多少更多的了解。
一个完整的网站所需要的还是需要各方面的知识的，例如：数据库，（我对数据库的了解和使用实在是太少了）对框架的熟悉程度也很重要，更需要好的想法。我想对http协议，tcp/ip的运行机制跟多的了解，对网络通信和结构的跟多了解，应该都会更有帮助吧。还有网站的安全应该是非常重要的。

于是我找到了这几个系列文章
 * [Python快速教程](http://www.cnblogs.com/vamei/archive/2012/09/13/2682778.html)
 * [协议森林](http://www.cnblogs.com/vamei/archive/2012/12/05/2802811.html)
 * [Linux的概念与体系](http://www.cnblogs.com/vamei/archive/2012/10/10/2718229.html) 

温习了下python，写了一个显示目录树型结构的脚本和一个迷你httpServer，有些类似`python -m SimpleHTTPServer`。不够还是不太适应用class，面向对象的来写程序，不过对于一些高级语言来说，万物皆对象，本就是面向对象的，不用专门写class。为了面向对象而面向对象，不好，不管是面向对象还是面向过程还是函数式，不过都是设计模式而已。


代码很烂。。。

#directory_tree.py
{% highlight python %}
#!/usr/bin/env python
#coding:utf-8

import os

def directory_tree(pwd,d=0):
	if os.path.isdir(pwd):
		print d*'-'+'\__',os.path.basename(pwd)
		for i in os.listdir(pwd):
			directory_tree(pwd+'/'+i,d+1)
	else:
		print d*'-'+'|--',os.path.basename(pwd)

if __name__ == '__main__':
	pwd = os.getcwd()
	directory_tree(pwd)
{% endhighlight %}

#http.py
{% highlight python %}
#!/usr/bin/env python
#coding:utf-8

import socket,os

text_header = '''
HTTP/1.1 200 OK  
Content-Type: text/html; charset=UTF-8
Server: MineCraft/0.0.1

'''

img_header = '''
HTTP/1.1 200 OK  
Content-Type: image/jpg

'''

download_header = '''
HTTP/1.1 200 OK  
Content-Type: application/download

'''

edit = '''
data:text/html, <style type="text/css">#e{position:absolute;top:0;right:0;bottom:0;left:0;}</style><div id="e"></div><script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script><script>var e=ace.edit("e");e.setTheme("ace/theme/monokai");e.getSession().setMode("ace/mode/ruby");</script>
'''

HOST='0.0.0.0'
PORT=8081


def htmlpage():
	def html(title,content):
		return '''
<!DOCTYPE html>
<html>
<head>
	<title> %(title)s</title>
	<style type="text/css"> h1 {border-bottom: 1px solid #c0c0c0;margin-bottom: 10px;padding-bottom: 10px;white-space: nowrap;}</style>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>
	<h1> Directory listing for %(title)s</h1>
	%(content)s
</body>
		''' %{'title':title,'content':content}
	return html

def element(inner,tags):
	return inner.join(tags)

def listpage(pwd):
	file_list = os.listdir(pwd)
	file_list.sort() #sort list
	li = ''
	forback = '<li><a href="..">..<a></li>'
	li = forback + li  # back
	for i in file_list:
		if os.path.isdir(pwd+'/'+i):
			i+='/'
		i = '<a href="%(url)s">%(url)s</a>' %{'url':i}
		li += element(i,['<li>','</li>'])
	content = element(li,['<ul>','</ul>'])
	html = htmlpage()
	return html(pwd,content)

def get_file(path):
	try:
		f = open(path, 'rb')
		response = f.read()
		f.close()
		return response
	except  IOError:
		return '404 <b>%s</b> File not found!' %path

def getResponse(src):
	path = src[1:] # relative path
	if path == '':
		path = './'
	if path[-1] == '/':
		#directory
		return text_header+listpage(path) 
	else:
		#file
		return get_file(path)

def main():
	s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
	s.bind((HOST, PORT))
	print 'Server on: http://%s:%d' %(HOST,PORT)
	while True:
		s.listen(5)
		conn,addr = s.accept()
		request   = conn.recv(2048)

		if request != '':
			method = request.split(' ')[0]
			src    = request.split(' ')[1]
			print addr,'%s %s' %(method, src)
			# main
			if method == 'GET':
				content = getResponse(src)
				conn.send(content)
				conn.close()
			# need to improve
			if method == 'POST':
				conn.send(request)
				conn.close()

			if method == 'EDIT':
				conn.send(edit)
				conn.close()
		else:
			print 'request empty'
			conn.close()


if __name__ == '__main__':
	main()
{% endhighlight %}

高兴的是这两个小程序在linux和win下都可以运行，哈哈，跨平台就是好！httpServer不支持中文。要是给这个httpserver加上上传文件的功能后，以后局域网内的文件分享就很方便了，不管是别人给我传文件还是我传文件给别人。


老写这些有意思么？就不能写写生活。

我想也没有人会对我是生活感兴趣吧。就算写出来也是 It's broing.

而且我也不会说：“这就是我的生活呀。”

显然还有其他的。

我败了个mx2。用起来感觉还行，挺漂亮的，美观，也实用，不过系统的bug和不满意之处也挺多的，电量也是捉襟见肘的，我并没有插电话卡使用，电量一天一冲必须的，android都这样？屏幕很细腻，摄像头，照相成像感觉很一般，没有宣传的那样好。

来几个样张？

![1](http://ww3.sinaimg.cn/large/6a0c2c15jw1e1zrxpcfktj.jpg)
![2](http://ww3.sinaimg.cn/large/6a0c2c15jw1e1zrxw67rnj.jpg)
![3](http://ww2.sinaimg.cn/large/6a0c2c15jw1e1zry4oh9hj.jpg)
![4](http://ww1.sinaimg.cn/large/6a0c2c15jw1e1zrxz6z2sj.jpg)

