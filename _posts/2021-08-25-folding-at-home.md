---
layout: post
title: 显卡除了用来挖矿还能干什么？
tags:
- 分享
---



众所周知，显卡就是用来~~挖矿~~的，它还能用来干什么呢？

### 起因

某天中午我看到一条[微博](https://weibo.com/1560906700/Kt67GiQtl)，提到[Folding@home](https://foldingathome.org/?lng=zh-CN)，这是一个关于生物医药方向研发的项目，需要海量的计算机算力资源，你可以作为志愿者**无偿**提供自己的计算机算力，做到真正的~~用爱发电~~。像这种目标宏大、举手之劳即可参与，为了全人类科学事业发展做出贡献的项目，当然会引起我这个技术宅的注意，这个项目成为热点最近的一次应该是在去年年初疫情在全世界爆发的时候，当时我可能看过相关的新闻但是并未引起我的注意，为什么呢？因为当时我并没有性能不错的台式电脑及显卡，但是今年不一样了，我第一次组装了个人的台式电脑，并购买了独立显卡，对你没有听错，在今年这个时间段购买显卡，了解行情的人都知道这并不是合理的入手时机除了刚需，但是我从来没有拥有过属于自己的台式电脑，所以这也算了了一桩心事。

### Folding@home是什么

> **Folding@home**（简称**FAH**或**F@h**）是一个研究[蛋白质折叠](https://zh.wikipedia.org/wiki/蛋白质折叠)、误折、聚合及由此引起的相关疾病的[分布式计算](https://zh.wikipedia.org/wiki/分布式计算)工程。由[斯坦福大学](https://zh.wikipedia.org/wiki/史丹佛大學)[化学](https://zh.wikipedia.org/wiki/化學)系的潘德实验室（Pande Lab）主持，于2000年10月1日正式引导。Folding@home现时是世界上最大的分布式计算计划，于2007年为[吉尼斯世界纪录](https://zh.wikipedia.org/wiki/吉尼斯世界纪录)所承认[[2\]](https://zh.wikipedia.org/wiki/Folding@home#cite_note-2)。
>
> via: https://zh.wikipedia.org/wiki/Folding@home

一个依赖海量算力支持的分布式计算项目，并且已经运行了二十多年了，也许你听说过[SETI@home](https://setiathome.berkeley.edu/)（已于去年3月停止）这个用来分析射电望远镜数据来寻找外星人的项目，都是一样的利用千千万万个分布在世界各地的电脑计算资源来帮助计算，不仅仅用于最新的[新冠病毒](https://foldingathome.org/diseases/infectious-diseases/covid-19/?lng=zh-CN)的研究，包括了癌症（[乳腺癌](https://foldingathome.org/diseases/cancer/breast-cancer/?lng=zh-CN)、[肾癌](https://foldingathome.org/diseases/cancer/kidney-cancer/?lng=zh-CN)）、传染病、神经性疾病([阿兹海默](https://foldingathome.org/diseases/neurological-diseases/alzheimers-disease/?lng=zh-CN))等等...

### 如何使用

其实很简单，进入[下载页面](https://foldingathome.org/alternative-downloads/?lng=zh-CN)，选择相应安装包，下载安装，安装过程会有详细的指导，安装步骤提示完成即可。

其中有一个注册用来验证身份的步骤，相当于有了这个注册的身份可以用来给自己累积分数，这样看起来更好玩更有成就感一点。

具体过程可以参考此处：https://www.equn.com/forum/thread-38404-1-1.html

安装中几点注意事项我提一下，以Windows平台为例：

##### 可以选择手动启动软件，没必要安装屏保

![image.png](https://i.loli.net/2021/08/29/molSTCDj6vhL8BI.png)

##### 手动运行程序

![image.png](https://i.loli.net/2021/08/29/B2C1Ab37haxmqyv.png)

安装完成后有几个程序，该点哪一个。点 **Folding@home**，FAHControl 和 Web control 只是控制面板。

##### 两个控制面板

![一个是网页控制面板，一个是高级控制面板](https://i.loli.net/2021/08/29/2LDvhbc4kCyi6tm.png)

一个是网页控制面板，一个是高级控制面板

##### 默认是打开软件自动打开网页控制面板，可以在设置里修改

![image.png](https://i.loli.net/2021/08/29/1xwcPWtCVgzmLOb.png)



##### 高级控制面板里的名词解释

有一个名词**PPD**即 Points Per Day 每日得分的意思，

![image.png](https://i.loli.net/2021/08/29/gvHbDZryzJQB4wK.png)

注意：里面的每项任务领以后只能暂停，**结束**的意思是在这个任务完成后不再去领新的任务，并不是取消掉这个任务，要想取消只能等待任务超时过期后才能领新的任务。

就是说你的一个运算单元，比如说你的显卡接受了一个任务，这个任务的过期时间是3天后，如果你不在这3天中完成这个任务，那么你的这个运算单元在这个期间内是不能接受新任务的，除非你跑完你的任务。

这个控制面板不仅可以控制本机的运算程序，还可以联机控制别的电脑上的运算程序，在面板左侧可以添加管理其他机器，这样就可以在Windows电脑上用GUI图形界面控制跑在另一台机器上比如Linux上的folding@home程序了。具体可参考此贴：https://www.equn.com/forum/thread-48322-1-1.html

##### linux 手动安装

参考官方教程：https://foldingathome.org/support/faq/installation-guides/linux/manual-installation-advanced/

个人觉得只需要安装 **fahclient** 即可，**fahcontrol_all** 因为依赖于python2 的原因在 Ubuntu 20.04 上安装会有问题，而且可以把控制交给别的电脑上的控制面板。

### 我干的这么样

我已经跑了2百万分了。推荐大家加入**[China Folding@Home Power](https://fah.manho.org/)**团队，代号3213。

除了在官网可以查看[成绩](https://stats.foldingathome.org/)，还可在这里查看更具体的数据统计：https://folding.extremeoverclocking.com/user_summary.php?s=&u=1276691

~~分数并不重要~~，重要的持之以恒😂😂，夏天跑跑电脑还是很热的，冬天倒是可以多跑点，权当做电暖炉用了。



![FoldingAtHome-wus-certificate-548990173](https://tva1.sinaimg.cn/large/008i3skNgy1gtxn9ahmxkj60hs0dcwfz02.jpg)



### 相关推荐

分布式计算论坛：https://www.equn.com/forum/

其他分布式计算平台 [BOINC](https://boinc.berkeley.edu/)：https://boinc.berkeley.edu/download.php

