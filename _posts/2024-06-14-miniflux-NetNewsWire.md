---
layout: post
title: 如何使用NetNewsWire作为RSS订阅工具Miniflux的客户端
tags:
 - rss
---

一直都在使用 RSS 作为获取信息的手段，从未间断，从[谷歌关闭 Google Reader](https://blog.xavierskip.com/2013-04-15-RSS-not-die/)，改用 Feedly，再到 _Inoreader_。_Inoreader_ 普通账号有订阅数目上限150个，且不论这个数目够不够用，_Inoreader_ 里的未读条目在2个月后会自动被设置成已读，这个特性就很让人很难接受。

在了解到 Miniflux 这个自部署的 RSS 阅读工具后，就决定部署自己的 RSS 阅读工具。（而且是使用GO 语言的 *绿色* 单可执行文件）唯一会让人犹豫的是此款工具的后端使用的是 Postgresql 数据库。会不会有点大材小用，有些自用的小工具采用 SQLite 作为数据库支持可能更加 *环保绿色*。

根据[文档](https://miniflux.app/docs/database.html)部署也很顺利，观察下来 Postgresql 对系统内存的占用也不大，至少比 MySQL 要少。

虽然 Miniflux 有提供 web 网页直接访问，但是我还是想找一个本地 RSS 阅读器在 ipad 上使用，于是找到了 [NetNewsWire](https://netnewswire.com/)。

但是当我安装好后，我却发现不知道如何添加账户的方式在 NetNewsWire 使用 Miniflux，哪怕我在官方的[第三方支持软件](https://miniflux.app/docs/apps.html)里看到了此款软件。但是却没有告诉我使用的方法。

![Third-Party Applications](https://f.skip2.top/i/4bf46cdc88f99272b28eb18c9ce99d722eb4f38c087bfb5998530d2ffcfa7d3b.jpg)

而且我是在搜索的过程中得知 NetNewsWire 是兼容 Miniflux 的，但是就是没有找到具体操作的方法，两边的帮助文档我也看了，只能确定是兼容的。还好最后在[相关 issue](https://github.com/Ranchero-Software/NetNewsWire/issues/2859#issuecomment-1019066748) 中找到了方法。

归根到底，Miniflux 是[支持 Google Reader API 的](https://miniflux.app/docs/google_reader.html)，NetNewsWire 添加账户的选项中没有明确的指出支持或者兼容 Google Reader API 的是哪个，其实 self-hosted 中的选项 FreshRSS 就可以。

![Google Reader API](https://f.skip2.top/i/e055c1f6a4540c2248fe4960fb30a660e40eb1482d8e8c6cd763774f980b59c6.jpg)

在 NetNewsWire 添加账户中选择 FreshRSS 并填入上面你设定好的信息。用户名密码就是你上面Google Reader API的设定，api url 就是你阅读器的 web 访问地址例如： example.miniflux.app 。

![self-hosted](https://f.skip2.top/i/3655e20a4ba75a9d0723b1d7b974c839c9331a2514f771c8268d32d0ccefb126.jpg)

相关 issue: [Add Miniflux to available account types #3593](https://github.com/Ranchero-Software/NetNewsWire/issues/3593)