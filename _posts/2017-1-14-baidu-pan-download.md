---
layout: post
title: 直接下载百度网盘资源,不要限速
tags:
- wget
---

最近更换网络，小水管换成了电信大水管（但是相比较之前的移动，电信的出国带宽明显感觉变窄了）以前费时费力的下载现在变轻松了，激发了我下载资源的欲望，下载了些游戏与电影。

互联网上版权管制越来越严，网络上的资源是越来越难找了，带宽越来越大，设备接入互联网越来方便，人们都习惯了在线浏览，下载保存资源成了小众的习惯。P2P 下载没落了，百度网盘上还有一些比较好的资源，但是百度网盘下载需要安装客户端，显然我是不愿安装的，并且如果你直接在百度网盘页面上下载资源，你会发现速度特别慢，显然是被限速了。

还好我找到了解决方案，先安装[百度网盘直接下载助手](https://greasyfork.org/zh-CN/scripts/23635-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B) 。一个油猴脚本，可以获取百度网盘资源的直接下载地址，而且我发现其中一种下载链接没有被限速，非常好用。

我来举个例子。我想下载我网盘中的 《[Futurama](https://movie.douban.com/subject_search?search_text=Futurama)》剧集。选中我们相应的文件后，点击下载助手，选择 API 下载，如果你只下载一个文件点击即可下载，如果需要下载多个文件点击批量链接。

![](https://ww1.sinaimg.cn/large/006tNc79gw1fbqbr1ga3yj30rw05o404.jpg)

![](https://ww2.sinaimg.cn/large/006tNbRwgw1fbqbr084mij30lx0ec10a.jpg)

复制保存好这些链接，接下来我们需要使用下载工具来批量下载这些文件，我使用的是 wget，**注意：下载的同时必须带上你的 cookies。**

下面是如何获取到你的 cookies。我们来利用 chrome 的开发工具获取。首先从上面的链接中挑一个出来。

例如：`http://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=250528&path=%2Ffuturama%2F%E9%A3%9E%E5%87%BA%E4%B8%AA%E6%9C%AA%E6%9D%A54%2F409.rmvb`

随便修改修改一下：`http://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=250528&path=%2Ffutu`

使用错误的链接地址是方便我们找到 cookies，打开开发工具，访问错误的链接，找到 cookies 就行了。

![](https://ww1.sinaimg.cn/large/006tNbRwgw1fbqe6o2fqoj313u0aitd6.jpg)

最后一步，直接带上我们找到 cookies 用 wget 批量下载。

	wget -i futurama.txt --content-disposition --header "Cookie:a=A;b=B"
	
	-i 你保存链接的文件
	--header 设置你的 cookies
	--content-disposition 让 wget 能够根据相应的响应头信息保存正确的文件名称，而不是根据 url 来保存文件名
	

相关阅读：

[知乎：百度网盘下载限速如何破解？](https://www.zhihu.com/question/28333225)

[wget 相关命令解释](https://www.gnu.org/software/wget/manual/html_node/HTTP-Options.html)


