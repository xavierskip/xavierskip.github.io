---
comments: true
date: 2011-11-15 09:18:41
layout: post
title: Cracking Siri 当然不是我了
wordpress_id: 170
categories:
- Geek
tags: note
---

原文 ：[http://applidium.com/en/news/cracking_siri/](http://applidium.com/en/news/cracking_siri/)

硬着头皮看完了，各种翻译工具呀！换了很多翻译插件，还是这个翻译扩展我觉得最不错

谈不上翻译，来说说这篇文章说的是什么吧？？
什么，你不知道Siri是什么？好吧？那科普的工作就交给你的好奇心，以及Google或者百度了～～否则ctrl+w吧！
首先，我们得弄清Siri怎么工作的吧？不要紧，apple已经告诉我们了，[sending data to a remote server](http://www.apple.com/iphone/features/siri-faq.html)(that’s probably why Siri only works over 3G or WiFi)，


> Siri uses the processing power of the dual-core A5 chip in iPhone 4S, and it uses 3G and Wi-Fi networks to communicate rapidly with Apple’s data centers. So it can quickly understand what you say and what you’re asking for, then quickly return a response.


**发送数据到远程服务器**

数据都是交给服务器处理的。就好象你输入一个关键词，Google马上可以给你那么多搜索结果，那是你的机器和网络厉害么？那是人家服务器厉害！这是个云时代呀！
说简单点就好比，你上网浏览网页，玩游戏，看视频，是基于网络的，数据是需要经过和服务器交流和处理的，主要的处理不再你自己的手机上，你的手机只负责接收信息，发送信息，负责与服务器进行通信交流，可是既然是这样，又有什么用咧？这就意味着为什么其他设备不行呢？不仅仅是苹果的产品，哪怕现在苹果的产品除了4s都没Siri，这就是他们Cracking Siri 的原因了。怎么才能与处理Siri的服务器通信呢？这就需要protocol （协议）了。Cracking the protocol ，当然这是后话

好晓得了这些，要是搞懂了这个protocol，要是明白了这个协议是怎么规定的，怎么执行的，那，就可以理论任何设备都可以与Siri服务器通信了，也就可以使用Siri了。搞了这么半天就是～～～**android也可以用Siri**

然后他们搞了个dome，不懂，汗... (大概就是发送数据包的格式？？)

好，下面他们来讲怎么获得这个协议（protocol）的，我们上网浏览网页使用的是http协议，不用管太多，是这个玩意就对了～
我们要了解协议是怎么样的?我们最好知道客户端都和服务器他们都说了些什么？于是他们搞了一个代理服务器，客户端与服务器之间的通信都要经过我们建立好的代理服务器，这样我们就很容易知道他们之间通信是是什么内容了。可是惊奇的发现，用Siri的时候似乎搜集不到任何信息？？


> Surprisingly, when we did, we wouldn’t gather any traffic when using Siri


于是去网关上查看，Siri的连接是TCP的方式，端口是443，服务器IP是：17.174.4.4
然后用台式机去登录[Https://17.174.4.4 ](Https://17.174.4.4  )（一下都https了，对https协议还不了解呀，只知道是加密的，那样代理服务器就无法知道你与谁谁谁通信，当然内容是更怕不可能知道了吧！？？）
我就知道你会点上面那个链接，哈哈，会告诉你证书不正确不受信任的，可是会告诉你证书是属于guzzoni.apple.com的，所以知道了是与叫guzzoni.apple.com的服务器通信用https的方式

正所谓https，这个“s”就是 “secure”的意思 。客户端与https服务器端之间的所有的通信都是以加密的方式，所以不同通过 sniffer 来嗅探到！这样，还可以造一个假的https服务器，然后DNS欺骗，把Siri与服务器通信引向假的https服务器，这样就可以搞到通信的内容了。弄到通信的内容一直都是到目前为止的目的。。
可是这也是行不通的，因为Siri会检查guzzoni也就是那个服务器的证书，我们伪造不了。


> Unfortunately, the people behind Siri did things right : they check that guzzoni’s certificate is valid, so you cannot fake it. Well… they did check that it was valid, but thing is, you can add your own “root certificate”, which lets you mark any certificate you want as valid.


fake这个单词是我玩2k12的时候认识，是假传的意思，那个键真鸡肋，我也就传空接的时候用用，扯远了

办法还是有的，我们可以搞一个根证书，可以使任何证书有效。这样就可以了。（说到证书，还真亲切，当年的symbion S60 破解也就搞一个证书，有了这个证书，搞什么都方便了～～ ）
通过自定义ssl 认证，然后添加到iPhone 4s中，然后让他签下我们自己的证书去欺骗“guzzoni.apple.com”,这就起到效果了，Siri 就可以发送命令到我们自己的HTTPS服务器来了。

然后意识到了Siri's 协议不是透明的。Siri 的 HTTP 请求的主体是二进制的。


> That’s when we realised how Siri’s protocol is opaque. Let’s have a look at a Siri HTTP request. The request’s body is binary (we’ll get into that later), and here are the headers :
ACE /ace HTTP/1.0
Host: guzzoni.apple.com
User-Agent: Assistant(iPhone/iPhone4,1; iPhone OS/5.0/9A334) Ace/1.0
Content-Length: 2000000000
X-Ace-Host: 4620a9aa-88f4-4ac1-a49d-e2012910921

A few interesting things :

> 
> 
	
>   * The request is using a custom “ACE” method, instead of a more usual GET.
> 
	
>   * The url requested is “/ace”
> 
	
>   * The Content-Length is nearly 2GB. Which is obviously not conforming to the HTTP standard.
> 
	
>   * X-Ace-host is some form of GUID. After trying with several iPhone 4Ses, it seems to be tied to the actual device (pretty much like an UDID).
> 




懂的自己看吧，反正我只看看过程
后面就有点技术细节了，crack开始了，光说意义不大，也看不太懂，胡乱说一通，错了莫要怪我。
不知道上面的headers部分注意没？ Content-Length: 2000000000，这显然不符合http协议，通信的主体都是2进制。
这个时候，他们思考，移动应用特别注重数据的压缩，于是他们决定从压缩入手，然后他们使用了一个很普遍的压缩库 zlib:“[http://zlib.net/](http://zlib.net/)“
然后他们通过zlib的管道解压，没用，少一个zlib header？什么三个字节不是头部的长度，4个字节的时候成功了。管他的～～
然后成功的解压的内容～然后他们就逐渐弄懂了协议的内容～～晕～～～

最后总结了几点：



	
  * Siri 工作的时候发送的是原始的音频数据到服务器

	
  *  他们不会公开他们的crack的成果，但是所有的我不都告诉你了么？自己私人用用是没问题的。

	
  * [collection of tools ](https://github.com/applidium/Cracking-Siri)这是那些帮助他们完成这些工作的工具，有用ruby写的，也有c，还有object-c。




最后：
Siri还在测试阶段，我想Siri成熟后，要是公开的话，那影响力对Google的搜索有很大影响，谷歌这么下发的推动android，android上面的搜索服务可以绑定Google搜索呀，Google现在就把Siri视为眼中钉肉中刺，更多是是不屑一顾。但是我认为以苹果的一贯作风，应该是只会给使用苹果设备的用户使用他们的服务。和其他的不一样，是由他们的服务后，吸引用户使用他们的设备。

其实我觉得Kniect才是王道。
