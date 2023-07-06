---
layout: post
title: 一种通过设置 DNS 记录解决家庭宽带提供https服务省去端口号的方法
tags:
- network
- dns
---

众所周知，家庭宽带是不被允许对外提供 web 服务的，所以运营商会主动封禁80和443端口，这两个端口一个是 http 服务另一个是 https 服务的默认端口。

如果家庭宽带利用 DDNS 技术绑定了域名，例如`f.example.home`域名，我们访问家里 https 服务的链接会是如下的形式：`https://f.example.home:6789/share`。

我最近在逛博客时发现了一种方法可以省去链接中的端口号，这样我们访问的链接变成了：`https://f.example.home/share`。是不是简洁美观多了，而且在技术上也灵活了。

方法来源：[涛叔：解决家庭宽带443端口封禁问题](https://taoshu.in/http3-port.html)

首先要声明的是，虽然对于服务提供者来说**只需要添加一条 DNS 记录**，但是目前这种方法对于访问者来说并不适用于大多数场景及用户，就是说对于绝大数访问者想要以不带端口号的形式访问服务需要手动设置及浏览器相关支持。原因在于 DoH 技术还未普及到成为 DNS 的默认设置，以及浏览器对其相关功能的实现。

具体点说，就是访问者想要通过省去端口号的链接来访问服务，**需要设置浏览器的 DNS 为[ DoH ](https://support.mozilla.org/zh-TW/kb/firefox-dns-over-httpsdoh)**
。

就目前的测试情况来看，在 Windows 系统下，Chrome 和 Edge 在 DNS 已经设置为 DoH 的情况下依旧不可以❌，只有 Firefox 在设置 DNS 为 DoH 的情况下可以 ✅。在 iPad 上 Safari 在无任何特别配置的情况下直接可以✅。

| 系统 | 浏览器 | DNS设置 | 结果|
| - | - | - | - |
| Windows 10| Chrome | DoH |❌|
| Windows 10| Edge | DoH |❌|
| Windows 10| Firefox | DoH |✅|
| iOS 16 | Safari | 默认 |✅|


#### 添加 DNS HTTPS 记录

我以 DNSPod 为例：

	主机记录：f
	记录类型：HTTPS，
	记录值：f.example.home. alpn="h2" port="6789"

添加好记录，然后等待生效，就可以测试是否可以通过不带端口号的链接访问服务了。

我在 Firfox 中添加的是 DNSPod 的 DoH 。[参考](https://docs.dnspod.cn/public-dns/dot-doh/)

家庭网络服务简介：家里的宽带通过 DDNS 绑定 IP ，家里的服务通过 Caddy web server 来获取证书并提供 https 服务，然后路由上做好端口映射。

推荐阅读：
- [DNS SVCB/HTTPS 记录介绍](https://taoshu.in/dns/dns-svcb-https.html)