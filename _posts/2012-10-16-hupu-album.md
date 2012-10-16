---
layout: post
title: 虎扑相册下载脚本使用指南
excerpt: 一个简单的python脚本
tags: python  script
---

一个简单的python脚本

###原理
抓取提供的相册url地址，`正则表达式`匹配或生成出需要的页面信息，如相册标题和相册所有的页面地址，然后抓取相册所有页面的内容并匹配出相册的图片url，并转换成大图地址。本脚本会在所处路径生成与要下载的相册同名的文件夹，所有的图片url会写入此文件夹下的urls文件中，然后调用系统中的`wget`软件来下载所有的图片。（没有`wget`也没有关系，可以复制urls文件中的内容用其他的下载软件下载。）

###运行环境
* `python`环境 （linux发行版和mac自带python环境，不用担心）
   * [windows用户配置python环境]()
* `wget` 软件 
   * [windows用户安装wget]()              

###使用方法
**注意**：相册的url为个人相册页面中的单个相册地址。like this:
* http://my.hupu.com/ariesbuji/photo/a195704.html
* http://my.hupu.com/ariesbuji/photo/a195704.html

把要下载的相册页面url作为本脚本的参数运行。
`>: python hupu_Album.py http://my.hupu.com/jzgk/photo/a75782-1.html`  
（也可直接修改脚本内的url为要下载的相册url，直接运行）

####windows用户配置python环境  
（如果你安装过java环境，是一回事）
先到[www.python.org](http://www.python.org/getit/)下载安装包。版本2.7.3即可；

  * [python-2.7.3.msi](http://www.python.org/ftp/python/2.7.3/python-2.7.3.msi) windows 32位系统  
  * [python-2.7.3.amd64.msi](http://www.python.org/ftp/python/2.7.3/python-2.7.3.amd64.msi) windows 64位系统

默认安装即可（python会安装到系统盘 `C:\python27` ）
接下来配置一下环境变量就ok了；  
右键-`我的电脑`>>>`属性`>>>`高级`>>>`环境变量`
在`系统变量`中找到`path`变量；双击添加`变量值`，添加进你的python安装路径，默认是`C:\python27`,并以`;`结尾。搞定！

验证配置是否成功：
 * 运行cmd： `win + R`输入cmd 运行
 * 输入`python`回车 能够进入python解释器界面就算成功

####windows用户安装wget
此页面下载(WGET for Windows)[http://users.ugent.be/~bpuype/wget/]
(wget.exe)[http://users.ugent.be/~bpuype/cgi-bin/fetch.pl?dl=wget/wget.exe]
将下载下来的wget.exe放到目录`c:\windows\sytem32`下
进入命令行：
运行>cmd>`wget -h` 验证是否安装成功


