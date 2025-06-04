---
layout: post
title: 解决盟军敢死队在 Windows10 上无法运行的问题 
tags:
- game
---

最近游戏瘾上来了，玩了一些游戏，特别是在我给闲弃的 SSD 装上硬盘盒然后安装上了 Windows 10 后，能玩的游戏就更多了（还有 ps2 模拟器可以用）。发现 steam 上盟军敢死队合集在打折才￥7，就下单买了，本来还想买《英雄连》的，但是价格￥68而且最近我还不一定有时间玩就放在一边等有打折的时候再买吧。（这些老游戏只能在 Windows 上运行）

盟军敢死队合集包括

1. Commandos:Behind Enemy Lines
2. Commandos:Beyond the Call of Duty
3. Commandos2:Men of Courage
4. Commandos3:Destination Lines

当我下载完成后，发现 盟军敢死队2和3都不能正常运行。如果进入游戏文件夹内直接点击应用程序运行会提示"0xc0000022"的错误。
!["0xc0000022"应用程序错误](https://f.xavierskip.com/i/61fb9b30d340df3f45465f68927bfcf634f3cd3717e3261e143d14a0fea200a2.jpg)
尝试了以兼容或者管理员模式运行都无效。在网络搜索中找了很多也没有解决。然后在 steam 相关的讨论社区中发了求助贴。谁知，在等待回复的时候，发现和我问同样问题的帖子中有了新回复，而这个回复解决了我的问题，真是幸运而及时。

解决方案很简单，只是需要打开一项 Windows 功能就行。打开 DirectPlay 功能。如图：![打开 DirectPlay 功能](https://f.xavierskip.com/i/dd6b8cc737ab105b950071e7398e334749068c8e5566bde15abd451de6464ec0.jpg)

这样就是可以正常运行游戏了！！！

2024-08-08 更新：

如果你使用 Windows 10 还是不能打开游戏，可以尝试一下 [cnc-ddraw](https://github.com/FunkyFr3sh/cnc-ddraw)，或许能够解决老旧2D游戏运行问题的工具。

相关：
* [Game won't launch on Windows 10?](http://steamcommunity.com/app/6830/discussions/0/135511757693937462/)
* [How to Enable DirectPlay in Windows 8/8.1/10](https://www.youtube.com/watch?v=6XYyGB-Tn3g)
* [盟军敢死队合集包](http://store.steampowered.com/sub/4156/)
* [英雄连](http://store.steampowered.com/app/4560/Company_of_Heroes/)


