---
layout: post
title: 想起了多年前玩过的 flash小游戏 Into Space 2
tags:
 - game
 - swf
 - bypass
---

{::nomarkdown}
<div id="intospace2"></div>
<script>
    window.RufflePlayer = window.RufflePlayer || {};
    window.addEventListener("load", (event) => {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        const container = document.getElementById("intospace2");
        container.appendChild(player);
        // player.style.width = "720px";
        // player.style.height = "540px";
        player.ruffle().load("/media/into-space2.swf");
    });
</script>
<script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
{:/nomarkdown}


以前就保存过这个flash游戏的swf文件，以为很简单的，就像以前的[自动机编程游戏 Manufactoria](/2015-05-03-Manufactoria/)一样，放在网页上就玩了。

结果载入游戏却提示`The game is site-locked`，这该死的 [armorgames](https://armorgames.com/play/14107/into-space-2)，只准在你们的页面上才能玩是吧。

搜索了下网络发现可以使用[ffDec](https://github.com/jindrapetrik/jpexs-decompiler)（此工具需要 java runtime）这个工具来逆向，找到关键点就可以 bypass 了。

左侧的资源栏里导航到`scripts/upg_ach_game/BaseBranding`，找到`domainAllowed`这个变量，点击下方的`Edit ActionScript`，然后将其改成`True`。既可。不同的游戏文件有不同的处理方式，甚至相同的游戏文件也有不同的 bypass 方式。我所知道的是这种根据加载的站点来封锁的机制和`loaderInfo.loaderURL`方法有关，在资源文件`scripts`部分鼠标右键`Text search`搜索`loaderInfo`或者`loaderURL`等关键词找对位置，具体问题具体分析代码可知。

![ffdec](https://f.xavierskip.com/i/6e792344e7b192bd5aceefdf9272e0542083276a365fa7f9257b2b3d6e064457.png)

还有人发现了程序里用来开发调试用的控制台，修改程序后可以通过键盘 "`" key来开启。

秘籍如下

```
# 在游戏暂停时呼出控制台，或者商店页面，火箭发射阶段控制台无法输入。
# 部分操作如不生效，可以退到 menu 然后再继续进入到游戏生效。
clear - Clears the console history.
fps - Toggle an FPS/Memory usage indicator.
fuel - cheat - gives player infinite fuel
help - [prefix] - List known commands, optionally filtering by prefix.
intoSpace - cheat - takes player to space
listDisplayObjects - Outputs the display list.
mars - cheat - takes player to the Mars landing scene
notdoppler - cheat - gives player $999999
powerMode - cheat - unlocks the PowerMode item.
tree - List all the PBObjects in the game.
unlock - cheat - unlocks all rocket parts
unlockAll - cheat - unlocks all items
verbose - Set verbosity level of console output.
version - Echo PushButton Engine version information.
```


相关：
- [My tutorial on cracking sitelocks of Flash games](https://www.reddit.com/r/flash/comments/1f68z1s/my_tutorial_on_cracking_sitelocks_of_flash_games/)
- [Did you know that Into Space 2 contains a hidden command console?](https://www.reddit.com/r/flash/comments/1ih7yis/did_you_know_that_into_space_2_contains_a_hidden/)
- [How to hack Flash Games - Removing a Site lock](https://www.youtube.com/watch?v=ezl_-ZqB-Ac)
- [internet archive Into Space - Flash Game Series.](https://archive.org/details/into-space-flash-game-series/)


