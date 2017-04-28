---
layout: post
title: 云梯 VPN IKEv2 连接方式在 Android 系统上的配置 
tags:
- vpn
---

从13年以来一直购买了云梯的 VPN 服务，但是用的不多。毕竟 VPN 用起来没有其他跨墙手段比如 http 代理或者 socket 代理等等使用起来灵活，哪怕不考虑速度因素，VPN 的连接、断开、切换路由表都还挺麻烦的，而且不跨墙的访问流量还是占大多数的，所以 vpn 一直以来都是作为备用梯子来使用的。

换成电信的网络后，vps 上自建的 shadowsocks 因为线路的变动导致速度巨慢，于是 VPN 成了跨墙首选。刚好年初，云梯 VPN 提供了 MAC 、iOS 平台上的客户端，使用 IKEv2 连接方式，连接香港2节点（香港唯独这个节点快速稳定）出人意料的稳定以及快速，客户端提供国内外线路自动区分功能，用起来体验不错。目前使用来看唯一的缺陷是不能使用网页版网易云音乐(web 页面可以正常访问但是不能播放音乐，域名解析直接返回了127.0.0.1，我的解决方案是直接修改 hosts 文件)。

但是在其他平台，比如 Windows 和 Android 下都没有相应的客户端，云梯官方也没有提供相应的 IKEv2 配置范例，我在客服中多次反映，得到回复如下
![](http://ww2.sinaimg.cn/large/006tKfTcgy1ff1i84hk1nj30rg03iab9.jpg)
看来就只能等待了
![](http://ww4.sinaimg.cn/large/006tKfTcgy1ff1i9hfj32j30ix01pjry.jpg)
但是不知道为什么相同的节点使用 PPTP 和 L2TP/IPsec 协议连接并不稳定，速度也不快，而 IKEv2 就很好，很是疑惑？

更疑惑的是为什么官方不提供 IKEv2 连接方式的在各个系统平台配置案例，VPN 连接不应该受困于客户端呀！

下面是 Android 上使用 IKEv2 连接 VPN 的配置范例。

1. 首先你需要安装[strongSwan VPN Client](https://play.google.com/store/apps/details?id=org.strongswan.android)

然后你需要取得云梯提供的根证书，如果你已经安装过云梯的客户端并成功使用过，那么你一定安装好了这个证书，你可以直接在 MAC OS 的"钥匙串访问"中获取这个名为"VPNCloud Class 3 Root CA 1"的证书，证书部分信息如下。

![](http://ww4.sinaimg.cn/large/006tKfTcgy1ff1ipn6m9hj30mm0ctdho.jpg)

证书指纹如下：
	
	sha: D0 F7 BE 76 4C 41 5E 60 CF 58 B7 F2 B4 11 0C 69 67 27 90 76
	md4: 7B FE F5 62 B1 9F F3 27 CB C8 37 C8 67 6D 9D 21

本人对证书类安全机制并不了解，考虑到随意安装根证书的风险，我就不提供这个证书文件的下载了。因为这个证书是通过客户端安装到系统里的，如果你没有相应系统平台来安装、使用这个客户端，要么再等一个月云梯官方发布了其他平台的客户端，要么给我发送邮件，我再提供给你这个证书。

2. 将这个证书安装到你的手机里

你可以直接安装到你的 Android 系统中，但是我推荐你导入到 strongSwan APP 中就可以了。
![](http://ww4.sinaimg.cn/large/006tKfTcgy1ff1jp6wai8j30k00zkwh5.jpg)
在 strongSwan 中你可以在 CA证书>已导入 中看到你导入的云梯证书。
 
3. 最后，添加 vpn 配置如下

![](http://ww4.sinaimg.cn/large/006tKfTcgy1ff1jrzjr45j30k01jaq61.jpg)

然后就可以连接了！

我依葫芦画瓢，在 Windows 系统上却没有成功，安装证书到系统中，然后创建 IKEv2 连接，试了很多选项，依旧不成功。没辙了。



