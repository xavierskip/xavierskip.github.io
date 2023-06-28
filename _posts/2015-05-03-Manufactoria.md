---
layout: post
title: 自动机编程游戏 Manufactoria
tags:
- game
---

2023/06/28 更新：[Ruffle ](https://ruffle.rs/)已经能够让这个游戏运行了！你可以去[这里玩这款游戏](https://www.kongregate.com/games/PleasingFungus/manufactoria)。并且还有了新版的游戏[Manufactoria 2022](http://pleasingfungus.com/)。

也可以参考这里的攻略：
 - [Manufactoria solutions](https://www.nayuki.io/page/manufactoria-solutions)
 - [Manufactoria 一个好玩的自动机编程游戏](https://jcf94.com/2015/08/28/2015-08-28-manufactoria/)

2022/01/03 更新：期待有一天。[Ruffle ](https://ruffle.rs/)这个项目能够让 Flash 复活。

{::nomarkdown}
<!-- <embed src="http://pleasingfungus.com/Manufactoria/Manufactoria.swf" width="640" height="480" class="manufactoria"> -->
<div id="container"></div>
<script>
    window.RufflePlayer = window.RufflePlayer || {};
    window.addEventListener("load", (event) => {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        const container = document.getElementById("container");
        container.appendChild(player);
        player.load("https://xavierskip.com/downIoad/Manufactoria.swf");
        player.style.width = "600px";
        player.style.height = "400px";
    });
</script>
<script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
{:/nomarkdown}