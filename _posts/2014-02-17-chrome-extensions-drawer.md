---
layout: post
title: “抽屉”一个chrome浏览器扩展
tags: 
- javascript
- chrome extensions
---
**介绍**：当你面对浏览器上的一堆标签页面想等一下或者下次再来浏览的时候，你会？

固定这些标签页或者将这些页面都收藏到书签中，然后关闭浏览器？  
———— 如果你下一次使用浏览器并不像马上继续浏览这些内容，还得慢腾腾的等待这些页面加载完毕。在书签文件夹中收藏然后打开浏览的页面是不是还得定期清理，毕竟这些页面只是临时浏览而不是收藏。

不关闭浏览器，最小化窗口或者直接和上笔记本的盖子，直接进行其他的任务？  
———— 我想你会担心你的chrome浏览器所占用的内存吧。

本扩展将标签页的信息存储在扩展中，帮助你保存这些标签页的信息，在您需要浏览时打开页面浏览。

下载地址：[drawer.crx](http://blog.xavierskip.com/project/drawer.crx)

update 2014/3/11  
**[version: 0.2]**  

重写了一遍，没有再用bookmarks存储页面信息了，直接用 chrome.storage.local。可能没有 bookmarks看起来直观，也没有书签管理器来管理，我觉得也没有必要。存储信息，打开就可以了。

![](http://ww1.sinaimg.cn/large/6a0c2c15jw1eec9ja1vtcj20b905x74m.jpg)


** [version: 0.1]** 

这个浏览器扩展是用来帮你保存当前浏览的页面，以及当你需要时，打开这些页面。不会因为不关闭浏览器或者这些页面，而占据大量内存，或者将这些页面固定在窗口，当你使用浏览器时这些页面都会加载，哪怕你只是要浏览其他的某一个页面。

开发代号为：抽屉.drawer

这么个小玩意，纯粹自用，从过年前写到现在，因为对js不够熟悉，不过通过此了解了回调函数，chrome 的api 基本都是回调函数，异步的编程还是和以前写的普通函数有所区别的，函数的执行顺序和思考方式要有所调整，javascripte涉及到比较多的 dom操作和网络连接，更多的是异步的方式，还是要慢慢适应。同时在写的过程中思路的反反复复，花费了很长一段时间。虽然现在可以用了，但其实我自己也不是很满意。

还是放出来，如果你使用了，希望能给提点建议。

![](http://ww1.sinaimg.cn/large/6a0c2c15gw1edma9qq6vnj20sg0yowm6.jpg)