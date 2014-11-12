---
layout: post
title: 网络租房小记
tags:
- 小记
- Server
---


好吧，开门见山，所谓的网络租房，其实就是租用VPS了，你说这是不是在网络空间的租房呢?

混迹在网络上何尝不想在网络上有个自己的小窝呢？对于我们这些Geek来说，那些已有的网络服务哪能满足我们呢？那些能够折腾操作系统、摆弄自己或者别人程序的 VPS 才是我们的目标呢！

但是在摸摸自己的口袋以及根据不随意浪费网络资源的原则下（不能买来服务器而自己没能力折腾就放在那里，不是浪费了吗？（我想的真多！）），以前都是拿几个免费的云平台小打小闹、练练手。

回忆下：

最开始的是新浪的云平台SAE: 我最开始的 wordpress Blog 是放在上面跑的。其实也是花过钱充过云豆的。

后来转到了 github 上的 jekyll 静态 blog 平台上来了。同时购买了域名。也就是你现在看到的样子。

同时知道了 openshift 的云平台，相对来说很开放、折腾性很高，开放后台、提供ssh登录。但是当时能力有限，不会折腾，一直放着也就没有怎么动过。不过一直在提供我的静态主页[xavierskip.com](http://xavierskip.com)的访问。

慢慢的，开始学习了 python的网络框架 Flask，也会写点 web服务了，此时百度开放平台 BAE 出来了，在以前用过的 SAE和 之前没有接触过的 BAE哪个用来搭建我的网络服务中，我选择了 BAE，因为 BAE提供 GIT来发布管理版本。我的[虎扑相册图片抓取器](http://hualbum.duapp.com/)就搭建在BAE上。

这些云平台方便是方便，但是距离真正的VPS还是有很大的差距。VPS那是真正的一台服务器摆在你面前任你折腾，限制你的条件是很少的。

其实真正推动我觉买台 VPS是，最近几个月来 Google是真的上不了，goagent也时灵时不灵的，购买的 VPN速度也不是很快，而且等待连接的时间长同时容易掉线。至于没有自己的服务器大名鼎鼎的 shadowsocks一直没尝试过。

便觉一定要买个VPS来搭建这个服务。其实之前一直没有行动的原因是：
首先，VPS得是国外的，要不怎么用来翻墙呀。而国外VPS购买的付款方式也是一道坎，其次VPS的价格也是不便宜的。大名鼎鼎的 lindeo，只能用信用卡付款，而且价格不菲。另外选择VPS提供商也是个头疼的事。

最后还是直接买了个 [digitalocean](https://www.digitalocean.com/?refcode=038b34398d87)，虽然在我在网上看了下口碑并不是很好，速度慢不稳定，但是网上提供这种服务没有不被骂的的，先用用试试看，就 paypal付款购买开通了。

下面是开始折腾服务器的资料：


* 新建用户，使用 sudo，取消root用户登录  
[Initial Server Setup with Ubuntu 12.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-12-04)

* 设置 ssh 公匙登录，不再输入密码  
[How To Set Up SSH Keys](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2)

* 速度测试  
[NYC3 Speedtest](http://speedtest-nyc3.digitalocean.com/)

先装了个 shadowsocks ，跑了下，翻墙速度也不是很快。先用着再说。

[用 Supervisor 运行 Shadowsocks](https://github.com/clowwindy/shadowsocks/wiki/%E7%94%A8-Supervisor-%E8%BF%90%E8%A1%8C-Shadowsocks)





