---
layout: post
title: 「油猴脚本」在网易云音乐中快速找到豆瓣 FM 中正在播放的曲目  
tags:
- script
- archived
---

豆瓣FM刚刚给我放了阴三的《老师好》，我想这歌不是被封了么？赶紧去网易上看看是不是没了？果然 

之前听豆瓣FM时，经常听到某首歌想去网易云音乐上看看，毕竟网易上可以看到其他人的评论还可以下载，可是在豆瓣FM网页上根本不好选择歌曲信息，再搜索很是麻烦。 

就写了个脚本解决这个需求，刚开始找豆瓣FM歌曲信息还废了点功夫，结果发现在本地`localStorage`中存着了，就简单了。

最新版本在此!
[https://greasyfork.org/zh-CN/scripts/11674-doubanfm2netease](https://greasyfork.org/zh-CN/scripts/11674-doubanfm2netease)

```javascript
// ==UserScript==
// @name         doubanFM2NetEase
// @namespace    http://xavierskip.com/
// @version      0.1
// @description  doubanFM searching in netease cloud music
// @author       xavier skip
// @match        http://douban.fm/*
// @grant        none
// ==/UserScript==
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

function getSong(){
    var info = window.localStorage.getItem('bubbler_song_info');
    return JSON.parse(info);
}

function generateSearchURL(song){
    //不知道为什么豆瓣存储的信息song.artist和song.album是一样的
    var info = encodeURIComponent(song.song_name+" "+song.artist);
    return "http://music.163.com/#/search/m/?s="+info
}

function Ahref(){
    var song = getSong();
    var url = generateSearchURL(song);
    return url;
}

var a = document.createElement("a");
var content = document.querySelector(".send-song-to-phone");
a.id = "netease";
a.href=Ahref();
a.target="_blank";
a.innerText = "在网易云音乐中查找当前播放歌曲";
a.addEventListener("click",function(e){
    a.href = Ahref();
},false);
content.appendChild(a);
content.style.zIndex = 50;
addGlobalStyle('#netease { color: #888;z-index:300;} #netease:hover{background: 0;color: #5b9;}');
```

安装好后，点击页面上的链接，根据歌曲信息直接打开网易云音乐的搜索地址，歌曲轻松找到了！（搜索信息是歌曲名和表演者，不知道为什么豆瓣存储的信息表演者和专辑名是一样的）

最近还更新了我三年写的删除新浪微博的脚本。

脚本地址：[https://github.com/xavierskip/delete-weibo/blob/master/del_weibo.js](https://github.com/xavierskip/delete-weibo/blob/master/del_weibo.js)

许久没用了，修改了下适应了改版后的新浪微博页面。

