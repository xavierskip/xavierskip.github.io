---
layout: post
title: 安装 OpenWrt笔记
excerpt: 无线路由是TP-link WR703n
tags: 折腾 OpenWRT TPLINK
---

移动设备越来越多，移动网络的发展。对于无线网络的要求也越来越强烈。而在天朝上网总是绕不过那道“墙”。

于是入手了一个 TP-link WR703n 无线3G路由器。刷机 openwrt后可立刻变身性价比极高的神器。你懂的。
（wireless fredom）!

## 准备工作

wr703n是在 openwrt支持的 [设备列表](http://wiki.openwrt.org/toh/start)中的，直接在wr703n的[页面](http://wiki.openwrt.org/toh/tp-link/tl-wr703n)中下载固件刷机即可。固件[squashfs-factory.bin](http://downloads.openwrt.org/attitude_adjustment/12.09-beta/ar71xx/generic/openwrt-ar71xx-generic-tl-wr703n-v1-squashfs-factory.bin)。

刷机直接在路由器管理页面的“软件升级”中上传升级即可。接下来的配置才是关键。（建议以下操作在linux下进行，否则会有点麻烦，openwrt就是个小linux系统。）

刷机后，openwrt是初始设置，要正确设置后才能使用其功能。因为初始openwrt的无线功能是关闭的，所以我们先用网线将路由器和电脑链接。（如果网络链接没有成功，可以将本机的ip设置成 192.168.1.* 网段的，因为 openwrt的初始ip是192.168.1.1）

开始只能通过telnet连接路由器，所以先用telnet登录路由器，没有密码
	 telnet 192.168.1.1

登录进去后先设置密码，是root账户的密码
	passwd

设置完成后，可以退出 telnet连接，用ssh登录路由器，并进行一系列的配置了。
	exit
	ssh root@192.168.1.1

## 网络配置
openwrt的网络配置文件集中在在 /etc/config 文件夹下，cd 进去
	cd  /etc/config/

我们先修改目录下的 network这个文件，配置路由器的基本端口.`vim network`
	

	config interface 'loopback'
	#loopback是本地回环，不用管他
		option ifname 'lo'
		option proto 'static'
		option ipaddr '127.0.0.1'
		option netmask '255.0.0.0' 

	config interface 'lan'
	#lan口是对内的，给你接入设备连接的，修改以后登录的路由的ip就是你配置的ip
		option proto 'static'
		option ipaddr '192.168.7.1'
		option netmask '255.255.255.0'

	config interface 'wan' 
	#wan口是对外的，连接外部网络的。由于我只是用来做无线AP，将已有的网络转换为无线接入，所以配置的是dhcp，没有拨号的配置。并指定了dns服务器
		option ifname 'eth0'
		option proto 'dhcp'
		option peerdns '0'
		option dns '114.114.114.114 8.8.8.8'

接下来对无线功能进行设置,修改 wireless文件.`vim wireless`

	config wifi-device  radio0
		option type     mac80211
		option channel  11
		option macaddr	6c:e8:73:d2:b3:80
		option hwmode	11ng
		option htmode	HT20
		list ht_capab	SHORT-GI-20
		list ht_capab	SHORT-GI-40
		list ht_capab	RX-STBC1
		list ht_capab	DSSS_CCK-40
		# REMOVE THIS LINE TO ENABLE WIFI:注释下面的一条来开启wifi
		# option disabled 1

	config wifi-iface
		option device   radio0
		option network  lan
		option mode     ap            #我设置的是ap模式         
		option ssid     OpenWrt     #无线网络名
		option encryption psk2    #加密方式
		option key      'p@ssw0rd' #你的密码


dncp文件中对dhcp服务进行修改，自行修改吧。firewall用来配置防火墙，我都不太了解，就先不配了，先用着。

重启路由器，将路由器连接网络，就可以使用啦！
`reboot`

你会觉得设置好复杂呀，我对网络不了解呀，有没有GUI图形设置界面呀，那种网页设置页面。有！

luci，提供http服务以网页的形式进行设置，我看网上的教程配置中刷机后要手动安装luci，可是我刷机后就有了，看来是官方固件把这个已经加进去了，可以设置好root密码后，成功用ssh可以连接路由器时，其实就可以在浏览器中登录来配置了。

但是没有那种傻瓜式的，还是直接对文件进行修改配置更加直观。



## 你有可能遇到的问题

有可能在配置的时候出现了失误，无法连接到路由器了，怎么办？我想重新配置。

拔掉电源，接通电源后，戳 reset口，直到led灯快速闪烁，就可以以默认设置重新登录，`telnet 192.168.1.1` 登录后，执行`firstboot`来恢复默认设置，来重新配置。

冒失，接通电源后，猛戳 reset口，也会进入安全模式，重新设置。反正len灯快速闪动是机器进入安全模式，可以以默认设置登录，并重新配置。



以上只是简单的配置使用，更高阶的配置和使用。以后继续。路由器先用着。


更多参考：

* [Install OpenWRT on TPlink WR703N](http://wiki.xinchejian.com/wiki/Install_OpenWRT_on_TPlink_WR703N)
* [利用 OpenWrt 配置 WR703n 自动*河蟹*](http://blog.pinepara.info/tech/flash-openwrt-on-wr703n/)
* [在TP-Link上安装OpenWrt并配置OpenVPN](http://blog.zhen9ao.me/blog/2012/04/10/how-to-config-openwrt-with-openvpn-on-tp-link-wr703n/)







