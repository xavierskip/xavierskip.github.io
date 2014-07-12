---
layout: post
title: 在Apache和mod_wsgi中掉入的坑
tags: 
- code
- 坑
---


最近写了个小工具，抓取局域网内机器所使用的IP和MAC地址并统计，然后在一台机器上跑一个web服务，方便查看。看似很简单的工具，也折腾了好一段时间，使用python写的，通过定时任务来抓取信息，使用我熟悉的Flask来提供web服务。但是条件有限，只能放在windows机器上，开始并不想折腾web server的，很简单的东西能用就行，就想看可不可以直接使用IIS，果然找到一片文章[running a python web app (flask) on windows server (iis) using fastcgi and wfastcgi.py](https://medium.com/what-i-learned-today/b49875b637f7),但是我按照步骤走下去就是不行，谁成功了告诉我一声。

于是，想想还是换成Apache吧，这下，掉进了一连串的坑中。

其实也不算是坑吧，因为我对怎么配置apache根本就没谱。

怎么安装apache和mod_wsgi我就不说了，在ubuntu上就是两句命令的事。

关键是配置apache server，原本我认为我的要求很简单，应该能在网上找几个教程看看，差不多就可以配置成功吧。

毕竟flask app 已经可以在dev server上跑起来了，化一个路径，写一个最简单的wsgi就行了。

可是按照各种教程上的步骤，总是不能正常显示网页，我找不到错误所在。哪怕后来我知道在apache log中找错误信息，可也有像 httpd.conf配置的错误信息，让我一直都认为是我的apache配置有误，毕竟我对apache的配置毫无概念。没办法，偷不了懒，还是从了解apache配置，wsgi配置慢慢来吧。就这样从最简单的各种“hello world”开始配置，慢慢的有所概念了。可是我的应用真的很简单呀，为什么要我搭建server这么的麻烦。


从各种“hello world”开始配置起，都没什么问题。那就不是我服务配置的问题了，可是我的网页还是error 500，而且log中没有相关的记录。百思不得其解，当然这就是突破口。我各种搜索，你知道这一段时间以来google被墙的厉害，所以就这样从开始到现在所有的都在挫败我！

我所要做的就是找到问题所在。所有没有错误处理的程序都是耍流氓！！

我找不到错误所在，那我就制造点错误，看看错误会在哪，这样就能找到错误了！

可是我故意制造的错误，我依旧找不到，亚无音信，在apache的log中找不到任何信息！

他们在哪？

我又开始尝试了，在调试flask时，是`app.debug = True`的，如果不设置debug，是不会在log中显示错误的。

于是你得在wsgi文件的`from app import app as application`后面再在加上一句`application.debug = True`，妈蛋，终于在apache log中看见错误信息了。

tips：有的还说关打开debug还不行，还得这样[500 Error without anything in the apache logs](http://stackoverflow.com/questions/8007176/500-error-without-anything-in-the-apache-logs)
	
	import logging, sys
	logging.basicConfig(stream=sys.stderr)

flask的mod_wsgi[文档](http://dormousehole.readthedocs.org/en/latest/deploying/mod_wsgi.html)中提到了要在配置文件中加上`WSGIRestrictStdout Off`，可是我不知道我加上去就是个错误配置？

或者这样

	import sys
	sys.stdout = sys.stderr

不管怎样，看到了错误信息，接下来就简单了。原来是因为我用sqlite这种文件型的数据库，而之前开发测试时用的相对路径就可以打开了，可是现在在服务器上这个路径就不好把握了，这个时候相对与服务器的相对路径显然没有绝对路径更容易定位了。
[Python's working directory when running with WSGI and Apache](http://stackoverflow.com/questions/12081789/pythons-working-directory-when-running-with-wsgi-and-apache)

	import os
	here = os.path.dirname(__file___)
	database = os.path.join(here, 'database.db')

这样我想就能搞定了。

终于可以在服务器上跑了！！！！

虽然还有很多概念都还没搞清楚，特别是对apache的<Directory>路径权限什么的还不太清楚，但是需要搞清楚的太多了，整个体系还是很庞大的。而且完成最开始的能够运行的目标更重要。


总之，还是学艺不精吧。而且看英文文档还是有些吃力，看到长篇的英文就想跳过去直接看命令，且不说词汇量的问题，很多英文句子要看两遍以上才能弄懂意思。慢慢提高，习惯看英文。
	



