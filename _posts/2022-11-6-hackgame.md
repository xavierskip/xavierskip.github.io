---
layout: post
title: 关于flag、关于Hackergame
tags:
- ctf
---

从2020年开始每年都参加一次CTF夺旗赛比赛，20、21年是在[i春秋](https://www.ichunqiu.com/)平台上参与的某行业内的网络安全大赛（非计算机行业，水平有限，刚好符合我这种新手玩一玩），今年的比赛到目前为止没有消息。但是看到了中国科学技术大学组织的 hackergame 比赛，而且可以公开参加，就也玩了一下。

这个 hackergame 比赛形式也是夺旗赛，内容也是网络安全相关，其实这种编程的比赛一直有玩，比如 [python challenge](https://blog.xavierskip.com/2013-06-23-python-game/)、[腾讯《前端突击队》](https://blog.xavierskip.com/2014-03-28-codestart/)，只不过内容并不是网络安全相关。这类比赛的目的就是找到隐藏的信息称作flag，flag信息会以各种形式隐藏在题目里，需要你使用各种手段找到这个flag，找到即可得分或者过关。

接下来记录下我参加 [中科大 2022 hackergame](https://hack.lug.ustc.edu.cn/) 的解题过程。只有我尝试做过的题目，毕竟本人能力有限，只能做一点简单的题目。

![得分成绩](https://h.xavierskip.com:42049/i/70cfd0b6f2420f5f583015109bf2adcc23b0f74f6be83119a22b1ff2f0ad2356.jpg)

官方解题 writeups 可以看这里 [https://github.com/USTC-Hackergame/hackergame2022-writeups](https://github.com/USTC-Hackergame/hackergame2022-writeups)

#### 1、[签到](http://202.38.93.111:12022/)

众所周知，签到题吧，就是用来计数参赛的选手有多少人的，可以看到完成此题的人数有2643人，而我的总排名为“417/2747”，对于一个菜鸟还行吧。

打开题目会看到在网页上手写几个数字，需要写下2022这几个数字，但是有时间限制，似乎是个不可能完成的任务，转念一想签到题不可能有什么难度，在网页控制台中调用js这种难度都应该不是的，尝试点击提交按钮了发现了玄机，识别结果都是本地执行的，客户端发送请求那还是自己说了算，直接修改url中的参数提交即可得到flag。

#### 2、[猫咪问答喵](http://202.38.93.111:10002/)

这是几道问答题，主要考察信息的搜索能力。我只回答对了一半，前三个找出来了，后三个没有。

第一个问题搜索“NEBULA 战队”google搜索第一结果中就有“成立于2017年3月”。

第二题通过搜索“Software Freedom Day”或者“软件自由日 USTC 中科大”可以找到当天的会议资料PPT，根据资料的URL还能发现一切其他的资料，甚至有活动的[全场录像](https://ftp.lug.ustc.edu.cn/%E6%B4%BB%E5%8A%A8/2022.9.20_%E8%BD%AF%E4%BB%B6%E8%87%AA%E7%94%B1%E6%97%A5/video/)，在我仔细观察ppt没有发现相关细节的时候，只好观看了相关会议讲座，根据讲者的描述，听发音搜索“kdenlife”结果发现是“Kdenlive”，一款视频编辑软件。

第三题，搜索结果里会有干扰，多试几次就得到结果了。

四五六尝试了，没有答出来。
其实第四题很简单，在github相关的[仓库](https://github.com/torvalds/linux)上里搜索“CVE-2021-4034”，选择 [Commits](https://github.com/torvalds/linux/search?q=CVE-2021-4034&type=commits) 就看到了。
第五题要用[https://www.shodan.io/](https://www.shodan.io/)这个搜索引擎来搜索。其实我之前还写过一篇文件“[ssh远程登陆中的钥匙指纹是什么以及如何比对](https://blog.xavierskip.com/2019-11-09-ssh-fingerprint/)”来探讨这个指纹这么的出来的。
既然第四第五题都没答出来，第六题我浅浅的搜索了一下就没继续尝试了。

#### 3、[家目录里的秘密](https://hack.lug.ustc.edu.cn/#%E5%AE%B6%E7%9B%AE%E5%BD%95%E9%87%8C%E7%9A%84%E7%A7%98%E5%AF%86)

其实题目里讲的很清楚了，将下载下来的文件用vscode打开，直接搜索“flag”就能找了。第一问相当于是送分了，同时告诉大家vscode的历史记录里会保存你删除的文件，小心自己的代码被泄露。

第二问更加明显了，就是需要了解一下Rclone这个软件是啥。毕竟`rclone.conf`里有加密的信息，并且写清楚了就是flag2，上网搜索一下“rclone password”，了解了下 rclone obscure，在机器上安装了rclone试了一下，flag应该就是用`rclone obscure`混淆保存了，配置文件的密码被掩盖了肯定是可以被还原的，要不然怎么用配置里的账号密码登录服务呢。继续搜索，在GitHub上甚至找到了项目的源码[obscure.go](https://github.com/rclone/rclone/blob/master/fs/config/obscure/obscure.go),这里面明显有个`Reveal`函数，最后在一个[issue](https://github.com/rclone/rclone/issues/2265#issuecomment-615900929)中找到了方法直接使用命令`rclone reveal [pass]`就找到了flag2！


#### 4、[HeiLang]([HeiLang](https://hack.lug.ustc.edu.cn/#HeiLang))

很简单，懂python语法的用编辑器查找替换讲语法改过来运行即可得到结果

#### 5、[Xcaptcha](http://202.38.93.111:10047/)

用python直接http请求得到。有点爬虫的都没什么问题。

```python
import requests
import re
url='http://202.38.93.111:10047/?token={you token here!}'
s = requests.session()
r = s.get(url)
# print(r.text)
url='http://202.38.93.111:10047/xcaptcha'
r = s.get(url)
print(r.text)
html = r.text
caps = re.findall('\d+\+\d+', html)
print(r)
data = {}
for i in range(3):
    name = 'captcha' + str(i+1)
    data[name] = sum(map(int,caps[i].split('+'))) 

r = s.post(url,data=data)
print(r.text)
```

#### 6、[旅行照片 2.0](http://202.38.93.111:10055/)

照片分析很简单，直接看图片的exif信息即可。接下来的社工，我就知道在日本千叶的海洋球场，找航班实在是没法子了，去看官方答案吧。

我发现这种根据照片推理位置的玩法还真有一些人喜欢玩，还有专门的网站做这种的游戏。国外的网站有：[geoguessr](https://www.geoguessr.com)，国内的网站有[炒饭网络迷踪图寻](https://chao.fan/tuxun)，可以看相关的[UP主 EasyEnglish](https://www.bilibili.com/video/BV1Gd4y1w72Y/)来了解一下。

#### 7、[LaTeX 机器人](http://202.38.93.111:10020/)

啥不不懂，上网搜索呗。按照这篇文件介绍的内容[how hacking with LaTex](https://exexute.github.io/2019/04/24/how-hacking-with-LaTex/)发现除了读文件，不能执行命令，就找到flag1，flag2找不到了。去看别人的[答案](https://github.com/USTC-Hackergame/hackergame2022-writeups/search?q=LaTeX)吧。



#### 8、[光与影](http://202.38.93.111:10121/)

看到flag被一个阴影给挡住了，既然是在浏览器中渲染的，那我就把网页整个下载下来，看看那个参数修改修改能改变flag的位置，也许就能看到了。自觉告诉我就是`fragment-shader.js`文件中的`sceneSDF`函数，我就把修改下面的内容

`vec4 pTO = mk_trans(35.0, -30.0, -20.0) * mk_scale(1.5, 1.5, 1.0) * pH;`

flag现身了。


还有一些有意思且完成人数超过200的题目也尝试过，比如：Flag 的痕迹、线路板、Flag 自动机、微积分计算小练习。很不幸都没搞出来。

行吧，就这。赛后，组织方承诺：平台和题目也仍然会继续运行至少三个月。感兴趣的可以去玩玩看。还有[第二届北京大学信息安全综合能力竞赛](https://geekgame.pku.edu.cn/#/game)也要开赛了！继续冲！！！