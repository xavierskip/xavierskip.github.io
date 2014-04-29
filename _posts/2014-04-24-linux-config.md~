---
layout: post
title: 男人有钱就变坏，程序猿有钱就换MAC
tags: 
- linux
- 折腾
---

我没有钱，还是继续用linux吧。

之前使用12.04很长的一段时间了，有些小问题，无大碍，手贱，升级13.10。新问题，疑惑，例如外接显示器双屏显示器，无奈，刚好ubuntu14.04LTS出来了，升级，谁知道，之前的问题还在，新问题更多。实在忍受不了。重新安装 ubuntu 14.04


##安装系统
1. 下载系统镜像

ubuntu 14.04 amd64

2. 制作硬盘启动，将系统镜像文件写入u盘中

用了好几款软件，在windows下制作u盘启动，不知道为什么像 UltraISO和unetbootin制作的都不能正确启动系统安装，可是我以前就是那样做的。不解，还尝试了在linux下制作，安装“startup disk creater”软件，可是下载安装的速度太慢，放弃了。最后找到了 [ryfus](http://rufus.akeo.ie/)这款软件，安装成功。

3. u盘启动安装系统

安装以及分区过程略过，不知道不分配 swap 交换分区会有什么样的影响，对于6G
内存的机器来说。

4. 等待安装，其他配置

安装完整语言支持，显卡驱动，一个字，等。。。

## 软件安装

* dropbox --- 同步

根据这个页面安装 [https://www.dropbox.com/install?os=lnx](https://www.dropbox.com/install?os=lnx)
安装完毕后，可是在面板上没有显示dropbox的图标，`sudo apt-get install libappindicator1`后就可以了，可是我记得 dropbox文件夹上应该有同步的标记的呀，现在怎么没了。搞不懂。
还需要设置自动启动，先下载dropbox.py，打开"startip applications"，在其中加入相应的启动命令`python dropbox.py start` ,我不知道为什么 dropbox.py 的 autostart选项为什么不起作用。


* chrome ---浏览器

鉴于chrome浏览器越来越卡，我不想自动升级了，就直接下的 deb包安装

如果你的系统是英文，那么网页的中文显示默认的是宋体而不是文泉驿微米黑。
调整字体也是很麻烦的。不多说了。
[http://forum.ubuntu.org.cn/viewtopic.php?f=8&t=323233](http://forum.ubuntu.org.cn/viewtopic.php?f=8&t=323233)
`sudo gedit  /etc/fonts/conf.avail/69-language-selector-zh-cn.conf `
<string>WenQuanYi Micro Hei</string>


* 搜狗输入法

在此页面下载 deb包安装即可。[pinyin.sogou.com/linux/help.php](http://pinyin.sogou.com/linux/help.php)
记住 ubuntu 14.04 不要删除 ibus，`sudo apt-get remove ibus`后系统设置的很多选项就都不见了。

* goagent

配置：加入启动项，加入证书。

* vim

我还不会怎么用，只知道基本的用法，只需要安装就不配置了。


* ubuntu-tweak

[https://launchpad.net/ubuntu-tweak/+download](https://launchpad.net/ubuntu-tweak/+download)

* sublime text 3

中文输入待解决



## 开发环境
* 各种包

`sudo apt-get install python-pip`这样安装各种python包就方便了。还要安装ipython，我觉得ipython-qtconsole更方便，`sudo apt-get install ipython-qtconsole
`

* 密钥公匙

[https://help.github.com/articles/generating-ssh-keys](https://help.github.com/articles/generating-ssh-keys)

## 系统配置

* grub配置

启动项的顺序和默认启动项
在 /etc/grub.d/ 中进行修改
`update-grub`更新


* 在此目录打开终端

`sudo apt-get install nautilus-open-terminal`


* 文件夹链接

将某个文件夹软链接到dropbox目录下，备份，同步。cd 进入 dropbox目录下`ls -s 你要链接的文件夹路径`。


* 文泉驿微米黑字体
`sudo apt-get install ttf-wqy-microhei`



系统安装完毕，配置结束后，可是还是有很多小问题让人摸不着头脑和不省心。比如合盖休眠后再唤醒系统，系统的反应就会变慢，是没睡醒吗？

于是又萌发了换其他的发行版的念头，于是又回到的了文章的开头。

哎，要不换 mac吧。

好累，完全是浪费时间。
