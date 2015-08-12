---
layout: post
title: [油猴脚本]帮你在网易云音乐中快速找到豆瓣 FM 中正在播放的曲目
tags:
- script
---

豆瓣FM刚刚给我放了阴三的《老师好》，我想这歌不是被封了么？赶紧去网易上看看是不是没了？果然 

之前听豆瓣FM时，经常听到某首歌想去网易云音乐上看看，毕竟网易上可以看到其他人的评论还可以下载，可是在豆瓣FM网页上根本不好选择歌曲信息，再搜索很是麻烦。 

就写了个脚本解决这个需求，刚开始找豆瓣FM歌曲信息还废了点功夫，结果发现在本地localStorage中存着了，就简单了。

<script src="https://gist.github.com/xavierskip/861d9f3569142a1ec1e7.js"></script>

安装好后，点击页面上的链接，根据歌曲信息直接打开网易云音乐的搜索地址，歌曲轻松找到了！（搜索信息是歌曲名和表演者，不知道为什么豆瓣存储的信息表演者和专辑名是一样的）

最近还更新了我三年写的删除新浪微博的脚本，脚本地址：[https://github.com/xavierskip/delete-weibo/blob/master/del_weibo.js](https://github.com/xavierskip/delete-weibo/blob/master/del_weibo.js)
许久没用了，修改了下适应了改版后的新浪微博页面。