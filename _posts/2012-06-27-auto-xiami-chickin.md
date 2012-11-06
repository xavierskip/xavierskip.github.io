---
comments: true
date: 2012-06-27 15:07:18
layout: post
slug: '%e8%99%be%e7%b1%b3%e7%bd%91%e8%87%aa%e5%8a%a8%e7%ad%be%e5%88%b0_%e6%b2%b9%e7%8c%b4%e8%84%9a%e6%9c%ac'
title: 虾米网自动签到_油猴脚本
wordpress_id: 556
tags:
- 油猴脚本
- javascript
---

为了偷个懒，不用每次打开虾米网然后去点那个签到按钮。
于是就搞了个这个。
我真是有签到强迫症呀！

**注意**这个只是半自动的，需要你打开虾米网的页面，不是首页也行，然后自动签到，当然需要登录你的帐号了
学习了解Greasemonkey --油猴脚本 可以看这里：http://www.firefox.net.cn/dig/install/what-is-greasemonkey.html
进阶：http://commons.oreilly.com/wiki/index.php/Greasemonkey_Hacks/Getting_Started
很简单的实现，还有点画蛇添足,还可以完善下。
猛击[这里](http://userscripts.org/scripts/source/137123.user.js)安装



更新0.13


code：

    
    
    // ==UserScript==
    // @name           Auto_checkin_xiami.com
    // @description   打开虾米网页面的时候自动签到。
    // @version         0.13
    // @author          @xavierskip
    // @include         http://*.xiami.com/*
    // @exclude        http://www.xiami.com/song/play?*
    // @updateURL   https://userscripts.org/scripts/source/137123.meta.js
    // @downloadURL https://userscripts.org/scripts/source/137123.user.js     
    // @license	  MIT License
    // ==/UserScript==
    
    var require = new XMLHttpRequest();
    require.open('POST','http://www.xiami.com/task/signin',false);
    require.send(null);
    var response = require.responseText;
    
    if (response != '') {
    	var elm = document.createElement('link');
    	elm.setAttribute('rel','stylesheet');
    	elm.setAttribute('type','text/css');
    	elm.setAttribute('href','http://xavierskips.googlecode.com/svn/trunk/debug.css');
    	if(typeof elm != undefined){
    		document.getElementsByTagName('head')[0].appendChild(elm);
    	};
    
    	var div = document.createElement('div');
    	div.setAttribute('id','widget');
    	div.innerHTML = response+'<span class="Font_9">天</span><p class="Font_13">连续签到</p>';
    	document.getElementsByTagName('body')[0].appendChild(div);
    }else{
    	pass
    };
    
