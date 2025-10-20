---
layout: post
title: 如何设置让公网和内网用户通过同样的方式访问端口映射出去的服务
tags:
 - network
 - NAT
 - RouterOS
---

如果你有一项服务通过端口映射到公网，因为不是固定IP那么一般都是通过域名访问，那么如何设置让公网和内网使用同样的域名加端口的方式来访问服务？

直接说结论吧。不要尝试通过配置路由器来实现，而是应该在内网搭建一个dns服务，内网用户进行域名解析时直接返回内部服务器IP，外网访问正常使用不受任何影响。

为什么？网上各种解决方案一大堆，有的配置很简单，有的很复杂，由于不懂设备的具体工作流程其实也看不太懂各种配置的工作原理，一个个实践配置下来，发现很多配置并不能工作，那些满足需求的配置却会导致另外一个问题，一个关于安全方面的问题！那就是对于内网服务器来说，所有的访问都会是显示来自于你的公网IP，应用服务的访问日志里没有正确的访问者IP，所有访问都显示来自你的公网IP。

这一点其实我在上个路由器就发现了，在我更换了新路由器再配置相同的功能时，这个问题依旧还在。所以我决定不在路由器上配置此功能了，而且我本身在本地就已有DNS服务，遂设置访问指定域名直接用本地DNS解析到内网服务器即可。

* * *

原有的路由器每隔一段时间就发生网络故障，但我又找不到导致故障的原因更无法解决，只能靠重启大法解决。最终选择了 [Mikrotik RB750Gr3](https://mikrotik.com/product/RB750Gr3) 这款5口有线路由器，也就用上了 RouterOS。（当然你嫌此款路由器的价格也有便宜的方法[^1][^2]）

接下来就要把[之前路由器的配置](https://blog.xavierskip.com/2023-02-19-nat-config/)在此款路由器上也配置一遍。

同样，配置前一款路由器遇到的问题，在此款路由器也遇到了。

问题就是，端口映射到公网的端口，如何配置让内网用户和外网用户用户通过同样的IP地址来访问？

形象的说明的就是，你的公网IP是 5.5.5.5，通过 ddns 绑定的域名是 home.net，你需要将内网服务器 192.168.1.10  7777 端口上的服务映射到公网上，在公网上可以通过 home.net:7777 地址来访问，同时你也想让内网用户通过同样的域名地址来访问这个服务。

为什么？因为一般这种对公网提供服务我们都是通过域名的形式来访问的，毕竟宽带不是固定IP。 

你会发现仅仅通过设置`目的地址转换 dst-nat`只能满足外网用户的访问，内网用户是不能通过外网地址及映射的端口来访问内部服务的。当然网络上有各种方法来教你如何配置[^3]，但是最后我放弃了这样的尝试。

为什么内网用户不能用公网地址访问映射到公网的服务呢？

```
# https://asciiflow.com/

              [request]                                                    
             src-ip:192.168.1.100                                          
             src-port:5656                                                 
┌─────────┐  dst-ip:5.5.5.5                ┌─────────┐                   
│         │  dst-port:7777                 │         │                   
│         ├──────────────────────────────►─┤         │                   
│  user   │                                │  route  │                   
│         │                                │         │                   
│         │                                │         │                   
└────┬────┘                                └────┬────┘                   
     ▲                                          │      [request]         
     │   [response]                             │ src-ip:192.168.1.100   
     │ src-ip:192.168.1.2                       │ src-port:5656          
     │ src-port:7777                            │ dst-ip:192.168.1.2     
     │ dst-ip:192.168.1.100                     │ dst-port:7777          
     │ dst-port:5656                            │                        
     │              ┌──────────┐                │                        
     │              │          │                │                        
     └──────────────┤  server  ├◄───────────────┘                        
                    │          │                                           
                    └──────────┘                                           
```

当你的pc发出的数据包：`192.168.1.100:5656 -> 5.5.5.5:7777`，那么你的 pc 对于接受到的数据包不符合 `5.5.5.5:7777 -> 192.168.1.100:5656`的将会丢弃[^4][^5]。

如果想接收到数据包，那需要做源地址转换，服务器不再将数据直接返回给内网访问者，而是交给路由器，经过路由器转换后再交给内网访问者。这样的话，经过源地址转换的数据包在服务端看来都来自同一IP，也也引起上面提到的安全问题，不能通过源地址IP来辨别访问者。

如果你没有这方面的需求和担心，那么确实有相应的解决方案，在 RouterOS 中名词叫做 [Hairpin NAT](https://help.mikrotik.com/docs/spaces/ROS/pages/3211299/NAT#NAT-HairpinNAT)[^6] [^7]

```
;;; 目的地址转换
/ip firewall nat add chain=dstnat action=dst-nat to-addresses=192.168.1.2 to-ports=7777 protocol=tcp dst-port=7777,7788 

;;; 源地址转换
/ip firewall nat add chain=srcnat action=masquerade protocol=tcp src-address=192.168.1.0/24 dst-address=192.168.1.2 out-interface-list=LAN
```

上面两条规则配合才能生效，对于外部访问，源地址ip得以保留，对于内部访问，所有的源地址ip都为路由器地址`192.168.1.1`。

对于 iptables 防火墙的工作流程，什么四表五链看着就头大，完全没有实际的认知，[Packet Flow in RouterOS](https://help.mikrotik.com/docs/spaces/ROS/pages/328227/Packet+Flow+in+RouterOS) 😵😵😵


[^1]:[不到50元上手RouterOS千兆RB750Gr3路由器](https://huwencai.com/2023/03/bu-dao-yuan-shang-shou-routeros-qian-zhao-rbgr-lu-you-qi/)
[^2]:[友华wr330直接刷成mikrotik rb750gr3](https://www.right.com.cn/forum/thread-5303754-1-1.html)
[^3]:[公网 IP 的服务，只能从「非本机地址」访问，求解](https://v2ex.com/t/936873)
[^4]:[小白对OpenWrt防火墙IPv4 NAT环回 (NAT Loopback) 的一点研究理解](https://www.right.com.cn/forum/thread-8203412-1-1.html)
[^5]:[用RouterOS做端口映射时遇到的回流问题](https://huwencai.com/2023/04/yong-routeros-zuo-duan-kou-ying-she-shi-yu-dao-de-hui-liu/)
[^6]:[MikroTik RouterOS 7 回流問題解決方案](https://kingtam.win/archives/hairpin.html)
[^7]:[RouterOS 的Hairpin 配置](https://archive.ph/caogy)


