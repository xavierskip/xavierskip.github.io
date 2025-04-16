---
layout: post
title: 软件 Everything 提供的 HTTP 功能中限定搜索目录的解决方案 
tags:
- software
- note
---

前言：
许久没有写新 blog 了，我认为更新 blog 的频率在平均每月一篇是比较合适的。同时我希望我公开出来的东西是对别人有用的，能够解决问题的，有原创性质的，不是说遇到了一个问题把 Google 搜索结果前几页的几篇文章上的知识整理整理就拿来自己发表了，还是要有自己思考在里面，否则在本地笔记本中记录就行了不用发出来了。

对知识的整理以及操作、思考，我会记录在笔记本中了，如果我认为也许会对别人有帮助，我会将它发到 blog 中。

另外我这个 blog 也没有什么读者，所以我认为我是在面对搜索引擎写作。希望别人在遇到和我类似的问题时，这样搜索结果或许就能帮助他。

正文：
几年前，在使用 Everything 这款软件的时候就发现了它提供的 HTTP 功能，这个功能允许你通过网络来搜索和访问你的本地文件，当时并没有重视这个功能，认为并不实用，因为在这个功能中我并没有发现限制搜索、访问目录的选项。这样开启了 HTTP 功能后，其他人可以搜索到你整个计算机上的文件，虽然可以设置为不允许下载，但是这样依旧不安全，不能下载也让这个功能变的鸡肋。

在最近迁移 FTP 数据的过程中，我再一次审视这个功能的时候，发现提供 HTTP 搜索及下载功能并限制目录这个需求，还是有解决方案的，我首先的想法是通过搭建一个反向代理，让 Everything 的 HTTP 服务只绑定本地地址，对外只访问这个代理，然后让代理对访问路径进行修改重写，这样来达到限制目录的目的，这个解决方案我认为理论上是可行的。刚好机器上安装了 Apache 服务器，准备看 Apache 的文档来配置一个代理，但是后来我发现我想多了。

我找到了 Everything 的帮助文档，[多实例](http://www.voidtools.com/zh-cn/support/everything/multiple_instances) ，其实是可以运行多个 Everything 的。

Everything 限制搜索路径我是知道的，设置了限制搜索路径以便提供 HTTP 功能后，这样我自己使用就很不方便了。如果能够运行多个 Everything 这样问题就很好解决了。

我单独运行一个提供 HTTP 服务的 Everything，并单独设置即可。这样也不影响我自己使用 Everything。

在软件安装目录运行以下命令，运行一个新的 Everything 实例。我的版本是 V1.4.1.877。

    Everything.exe -instance "HTTP Server”

[索引>NTFS]不需要的分卷取消『包含到数据库』的选项，仅包含的文本框中填写你需要分享的目录，多个目录用”;”符号分割。

![索引>NTFS](https://f.skip2.top/i/bc76e173d70e66d796e4ecd89adf231f56ceb2719feb5b9966798cd1e9c285ed.jpg)

当然别忘了在[常规]选项中选中[随系统自启动]、[Everything 服务]，以及打开 HTTP 服务器功能

![随系统自启动](https://f.skip2.top/i/315e74695a20dc17b68d6c468c6be8fa7d13dd33aee5c71d826f945b8f0b45a6.jpg)

最后你也可以根据[HTTP](http://www.voidtools.com/zh-cn/support/everything/http/)帮助来自定义 web 界面。

![web 界面](https://f.skip2.top/i/ecbeffec2f13b790bce080718395005a75ec3e346779b9835209ef3cfafd6ee3.jpg)


