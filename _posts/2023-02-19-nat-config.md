---
layout: post
title: 华为路由器NAT端口映射配置
tags:
- network
- NAT
---

将内网服务通过端口映射使得能够被公网设备所访问，这是个常用功能，可以很方便的用设备自带的web管理界面就能配置成功。

但是内网设备想像外网设备一样通过公网IP或者域名来访问这些服务并不可行，还需要额外配置，某些消费级路由器可能在系统设置上就考虑过这个问题，不用额外配置。但是我现在用这台设备不可以，

搜索网络上的信息，很多人都遇到了这样的问题，比如：[NAT 环回可以端口转发吗](https://www.v2ex.com/t/640554)、[小白对OpenWrt防火墙IPv4 NAT环回 (NAT Loopback) 的一点学习理解](https://www.right.com.cn/forum/thread-8203412-1-1.html)，学习到了一些名称：SNAT、DNAT、NAT环回等等。但是不同的网络设备有不同的配置方法，甚至技术名称都不同，别人的解决方案并不能知道我解决问题。还是好好去官网文档中查查看，但是上面搜集信息的过程中也找到了解决这个问题有两个方向：

1. 在内网中设置DNS服务器，在内网访问服务的时候返回内网IP，公网访问服务的时候返回公网IP。优点：简单清晰容易理解，缺点：需要另外在内网部署DNS服务。

2. 设置NAT策略。缺点：需要了解相应的网络工作机制和网络设备的配置方法。优点：可以不依赖于域名。

然后找了很多信息，并没有找到如何设置NAT的方法，毕竟不用网络设备里的命令不一样，而且我的内网里已经有了DNS服务器，只需要配置一下 Local DNS Records 就可以很好的解决“内网设备同外网设备使用相同的方式访问服务”的问题了。

我又找到了第三个解决方案（但是不推荐）：

3. 配置[DNS Mapping](https://support.huawei.com/enterprise/zh/doc/EDOC1100033729/6325cc27)。需要开启[ALG](https://support.huawei.com/enterprise/zh/doc/EDOC1100033729/9130981d) 来修改DNS应答中的相应地址信息。

配置复杂，而且很明显要占用一些设备性能。有专门的FAQ来说明这个问题：[配置DNS Mapping后，CPU占用率高应如何解决](https://support.huawei.com/enterprise/zh/doc/EDOC1100112409/7e88872)

上面的文档中指出了这个问题，而且告诉了你该如何配置NAT来解决这个问题。坑爹的配置过程中掉了一点，这点在另一个FAQ中出现了（文档不严谨呀！）[私网用户和私网服务器在同一个VLAN下，在VLANIF接口下配置nat server映射服务器公网地址，用户以公网地址访问服务器失败](https://support.huawei.com/enterprise/zh/doc/EDOC1100112409/d1a04f0f)

下面是配置过程
```
<Huawei>system-view              # 进入系统视图
[Huawei]interface Dialer 1       # 进入公网接口
[Huawei-Dialer1]display this     # 显示公网接口的信息
#
interface Dialer1
 link-protocol ppp
 ....
 nat server protocol tcp global current-interface 22 inside 192.168.10.2 22
 nat outbound 2999
#
return
[Huawei-Dialer1]q               
[Huawei]interface Vlanif 1       # 进入内网接口
[Huawei-Vlanif1]display this     # 显示内网接口的信息
#
interface Vlanif1
 ip address 192.168.10.1 255.255.255.0
#
return
[Huawei-Vlanif1]nat server protocol tcp global interface Dialer 1 22 inside 192.168.10.2 22 # 接口是公网接口
[Huawei-Vlanif1]nat outbound 2999     # 和公网接口下的 acl 一样是 permit 
```
最后不忘了save一下。

还没完，NAT转换类型一般有4种：

NAT1：Full Cone NAT（完全圆锥型，一对一）

NAT2：Restricted Cone NAT（地址限制圆锥型）

NAT3：Port Restricted Cone NAT（端口限制圆锥型）

NAT4：Symmetric NAT（对称型）

1-4是越来越严格，越宽松意味着公网中点对点通讯能够更轻松的建立，对于个人用户的网络体验是有帮助的，例如点对点连接及内网穿透等。但是对于企业应用来说安全是第一位的，所以这个路由器默认的是 NAT4 Symmetric NAT。

你的NAT网络属于哪个等级可以通过[pystun3](https://pypi.org/project/pystun3/)这个工具来检测。

```
$ pip install pystun3  # 安装
$ pystun3              # 看到结果
NAT Type: Symmetric NAT
External IP: <your-ip-here>
External Port: 54320
```

要想调整华为路由器的nat策略也是可以的，通过这个[FAQ：AR110-S是否支持完全圆锥型NAT](https://support.huawei.com/enterprise/zh/knowledge/KB1001421792)可知：

```
nat mapping-mode endpoint-independent
nat filter-mode endpoint-independent
```

配置这两个命令即可。注意，配置策略后并不会立即生效，重启吧。

关于NAT等级、NAT的原理、如何穿透NAT这就是不是几句话能够说明白的，想了解的可以看下面的一些资料：

 - [NAT 原理以及 UDP 穿透](https://paper.seebug.org/1561/)
 - [[译] NAT 穿透是如何工作的：技术原理及企业级实践（Tailscale, 2020）](https://arthurchiao.art/blog/how-nat-traversal-works-zh)
 - [[译] NAT - 网络地址转换（2016）](http://arthurchiao.art/blog/nat-zh/)
 - [穿越防火牆技術](http://www.cs.nccu.edu.tw/~lien/Writing/NGN/firewall.htm)
 - [Peer-to-Peer Communication Across Network Address Translators](https://bford.info/pub/net/p2pnat/)

其他：

[命令行的快捷键](https://support.huawei.com/enterprise/zh/doc/EDOC1100041711/36ae01a3)

|  功能键 |  功能   |
|--------|------------------------|
|<Ctrl+A>|将光标移动到当前行的开头。|
|<Ctrl+B>|将光标向左移动一个字符。|
|<Ctrl+C>|停止当前正在执行的功能。|
|<Ctrl+D>|删除当前光标所在位置的字符。|
|<Ctrl+E>|将光标移动到最后一行的末尾。|
|<Ctrl+F>|将光标向右移动一个字符。|
|<Ctrl+H>|删除光标左侧的一个字符。|
|<Ctrl+K>|在连接建立阶段终止呼出的连接。|
|<Ctrl+N>|显示历史命令缓冲区中的后一条命令。|
|<Ctrl+P>|显示历史命令缓冲区中的前一条命令。|
|<Ctrl+T>|输入问号（？）。|
|<Ctrl+W>|删除光标左侧的一个字符串（字）。|
|<Ctrl+X>|删除光标左侧所有的字符。|
|<Ctrl+Y>|删除光标所在位置及其右侧所有的字符。|
|<Ctrl+Z>|返回到用户视图。|
|<Ctrl+]>|终止呼入的连接或重定向连接。|
|<Esc+B> |将光标向左移动一个字符串（字）。|
|<Esc+D> |删除光标右侧的一个字符串（字）。|
|<Esc+F> |将光标向右移动一个字符串（字）。|

[Bash Shortcuts](https://gist.github.com/tuxfight3r/60051ac67c5f0445efee)


<img class="flip" src="https://raw.githubusercontent.com/fliptheweb/bash-shortcuts-cheat-sheet/master/moving_cli.png" alt="https://github.com/fliptheweb/bash-shortcuts-cheat-sheet">