---
layout: post
title: 发现一种绕过SNI阻断的方法
tags:
 - network
 - GFW
 - SNI
---

发现一种方法可以通过配置浏览器启动参数来绕过SNI阻断。下面的配置内容对于 chrome 内核浏览器生效。

对于部分访问受到屏蔽和干扰以及访问不稳定的网站有效，可以在一些临时的环境查资料时派上用场。

下面我以访问[V站](https://v2ex.com/)来举例。

# 未被污染的 IP

首先找到该站点未被污染的 IP。那么如何寻找未被污染的 IP 呢?

当然是使用我自制的观察 DNS 污染情况的工具了：[dns-observe](https://github.com/xavierskip/dns-observe)

```powershell
# 安装工具
> pip install dns-observe
# 运行工具，观察 dns 结果，找到能用的IP
> dns-observe v2ex.com
- Time: 2024-11-25 18:34:13.965648, Name: v2ex.com, TTL: 77, A: 157.240.17.41
- Time: 2024-11-25 18:34:13.969059, Name: v2ex.com, TTL: 250, A: 108.160.167.148
┌ Time: 2024-11-25 18:34:14.097316, Name: v2ex.com, TTL: 300, A: 104.20.47.180
│ Time: 2024-11-25 18:34:14.097316, Name: v2ex.com, TTL: 300, A: 104.20.48.180
└ Time: 2024-11-25 18:34:14.097316, Name: v2ex.com, TTL: 300, A: 172.67.35.211
```

# 浏览器启动参数

我以 edge 浏览器举例。这里需要用到`--host-rules`、`--host-resolver-rules`这两个参数。

```powershell
$ C:\Program Files (x86)\Microsoft\Edge\Application\131.0.2903.51 > .\msedge.exe --host-rules="MAP v2ex.com V,MAP cdn.v2ex.com V" --host-resolver-rules="MAP V 172.67.35.211" --ignore-certificate-errors
```

你可以进入浏览器可执行文件根目录执行命令行来运行浏览器（上面命令参数里的`V`就是伪造的SNI，你可以修改成其他），也可以在快捷方式中添加参数。

如果参数生效会有提示`你使用的是不受支持的命令行标准:--host-resolver-rules=xxxxxx。这会带来稳定性和安全风险。`，或者在`edge://version/`页面查看命令行是否正确启动。

```bash
# 访问Google的参数
chromium --host-rules="MAP www.google.com g.cn" --host-resolver-rules="MAP g.cn 109.185.236.240"
```

相信聪明的你一定会举一反三。。。

相关链接：

- [通过配置浏览器启动参数绕过SNI阻断](https://appscross.com/blog/bypass-sni-blocking-by-configuring-browser-startup-parameters.html)
- [无视网络污染，直连访问github、google、fb等站点......](https://www.bilibili.com/video/BV1fvBeYhELZ/)
- [Sheas-Cealer (可用于无代理合法抵御网络监听和开展网络研究)](https://github.com/SpaceTimee/Sheas-Cealer)
- [Chrome 指定域名解析，绕过 hosts](https://blog.est.im/2021/stdout-016)
- [使用 chromium 浏览器的 host-rules 命令行（目前）免翻墙上 pkuanvil.com 以及部分 SNI 阻断的网站](https://www.pkuanvil.com/topic/224/%E4%BD%BF%E7%94%A8-chromium-%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84-host-rules-%E5%91%BD%E4%BB%A4%E8%A1%8C-%E7%9B%AE%E5%89%8D-%E5%85%8D%E7%BF%BB%E5%A2%99%E4%B8%8A-pkuanvil-com-%E4%BB%A5%E5%8F%8A%E9%83%A8%E5%88%86-sni-%E9%98%BB%E6%96%AD%E7%9A%84%E7%BD%91%E7%AB%99)