---
layout: post
title: 一份2024年给树莓派3B重新部署的指北
tags:
 - 树莓派
 - linux
 - raspberry
---
![neofetch](https://f.xavierskip.com:42049/i/56039e04fd6a3335d6d567f25d58686eb5102d67308e9f45f5e276c60694d621.png)

不幸的事情发生了，我发现我给树莓派安装的小风扇出问题了，应该是轴承出了问题毕竟风扇是不停工作的，不仅不能正常转动而且发出了不可忽略的噪声，于是我想把风扇给卸掉，在夏天最高温来之前再换上新风扇也不迟。就在我想给风扇拔掉电源线的时候，没办法直接拔掉因为给树莓派套了个壳子还得先把壳给脱掉，然后再从树莓派的GPIO口上拔掉风扇的电源插针，就在把壳装回去的时候，因为树莓派是放在入户弱电箱里，那地方即空间狭小照明情况也不好，还得蹲着操作，别扭，一着急，发现树莓派怎么都和壳子不合身，粗心大意以为是哪里位置没有卡对，咔嗒一声我还没明白发生了什么，安好之后发现机器怎么都不能启动了，这下，哦豁！tf 卡给我折断了，完蛋！！❤️🕳️🩸

还好，我有几个重要的配置文件在配置好后给保存在 gist 上了，虽然要从头开始部署我的树莓派3B，但是有些配置文件还是可以“抄作业”的，至于数据，我树莓派外挂有一个移动硬盘，数据会保存在那个上面。


# 烧录系统 💽

## 下载 Raspberry Pi OS 🍓

[Raspberry Pi OS](https://www.raspberrypi.com/software/operating-systems/)目前的版本是基于 Debian 12 Bookworm。

可以选择 [Raspberry Pi OS](https://www.raspberrypi.com/software/operating-systems/#raspberry-pi-os-32-bit) 或者 [Raspberry Pi OS (64-bit)](https://www.raspberrypi.com/software/operating-systems/#raspberry-pi-os-64-bit)，我并没有选择64位的系统，因为我之前用的也是32位的我不确定我之前用的软件一定会提供有64位的版本。

如果你选择了64位的系统那么你在选择软件的时候要选择 arm64 ，否则应该选择 armhf。

## 烧录系统到tf卡 💾

你可以选择官方的工具[Raspberry Pi Imager](https://www.raspberrypi.com/software/)，但是我选择的是[etcher](https://github.com/balena-io/etcher)，因为我在这个设备上之前就是用的 etcher，Windows系统上也可以用[Rufus](https://rufus.ie/)。讲道理这一步用什么工具都可以，直接用`dd`命令也不是不行，但是关于数据格式化的操作我还是建议采用 GUI 这种直观的形式，不是命令行不行，而是你眼花手滑了后悔都来不及，血泪的教训！！😭😭😭 我多次误删数据都是在命令行下面。

⚠️ 注意：下面的操作都是命令行操作，因为我并不使用树莓派系统桌面版（不带GUI）！

# 第一次开机前的准备 ⌨️

烧录系统完成后，将tf卡插入机器，插电！开机！

如果你像我一样，手边并没有 usb 键盘，也没有 hdmi 的显示器，那么你怎么登录进系统呢？能用的就是手边的笔记本，能用 ssh 远程登录进系统吗？

在早先系统版本中只要在tf卡 boot 文件夹下创建一个名为 ssh 空文件即可打开 ssh 功能，然后你就可以用默认的 pi 用户和默认的密码 raspberry 远程登录了。

可是，大人，时代变了。

现在你已经可以去连接 ssh ，但是你看到的是 

```
> ssh 192.168.1.102
Please note that SSH may not work until a valid user has been set up.

See http://rptl.io/newuser for details.

```

是的，处于某些安全方面的考虑，现在的 Raspberry Pi OS 已经不再提供默认的账户和密码，首次登录需要你自己设定账户和密码就像你安装的过的任何其他操作系统一样。

那么对于直接操作树莓派系统的远程登录用户怎么办呢？上面的链接里[http://rptl.io/newuser](https://www.raspberrypi.com/news/raspberry-pi-bullseye-update-april-2022/)告诉了我们方法。

![Headless setup](https://f.xavierskip.com:42049/i/8d49164289c498f1843ff4bf87f76ce6d82b58db5a1af651fdd32c82cb7932b7.png)

你如果是使用官方的工具烧录的系统你一定可以在 Raspberry Pi Imager 工具里找到相应设置的位置，如果你像我一样使用的第三方工具那么你也有办法实现。

那就是在你 tf 卡的 boot 分区下创建一个名称为`userconf`或者`userconf.txt`的文件，

其中文件的内容包括你的用户名和密码，示例内容如下。

```
# 用户名：pi
# 密码：mypassword
pi:$6$KgLgFlKAs4Vb3X92$1BMPc1y7omB1OI71vg800t4Iu2rIfBHwWWPGwZB93BaNS9pH0Z.Ts.2XseWap1gJrf6cnDyaXXlHyK8WZkQbk.
```

其中密码的生成方式为`echo 'mypassword' | openssl passwd -6 -stdin`

就这样给初始化用户的设定好了，我们可以直接连接上去了吧。稍等，还需要确定你树莓派的ip地址，如果你像我一样使用网线连接，你可以在树莓派接入的路由器中找到树莓派所获取的IP，默认设置是DHCP获取的IP地址，你可以等会登录进去再设定固定的IP地址。

如果你使用的无线WIFI连接，可能就要麻烦点了。

> Previous versions of Raspberry Pi OS made use of a wpa_supplicant.conf file which could be placed into the boot folder to configure wireless network settings. This functionality is not available from Raspberry Pi OS Bookworm onwards.

Raspberry Pi OS Bookworm 不再支持使用 wpa_supplicant.conf 方式来设定wifi了，除了使用官方的 Raspberry Pi Imager 工具，我也不知道如何初始设定 wifi 了。如果关注这个问题可以去这个 issue 看看。

[wpa_supplicant autoconfigure removed in bookworm but not replaced with other mechanism](https://github.com/raspberrypi/bookworm-feedback/issues/72)

# 系统设定 ⚙️

万事开头难，经历了千辛万苦，我们终于登陆系统开始设定了！

## 网络设定 🔧

在一切开始之前，你可控制你的路由器给你的树莓派分配一个固定的 IP，也可以像我一样手动给树莓派设定固定的 IP 地址。

如果你像我一样**不使用** wifi 和 蓝牙，可以通过`sudo nmcli radio wifi off`来关闭。

用来设置网络我们不使用`nmcli`而是使用`nmtui`这个工具，图形化显示，设置起来简单更直观。

![nmtui](https://f.xavierskip.com:42049/i/e53808bc66276aa727d18dc0438e1360d495123b4221a52abf5dc296f490c8bc.png)

具体设置过程就不赘述啦。

## 更换软件源 🚀

因为众所周知的原因，凡是涉及到需要下载软件包工具的都需要更换成国内的源下载才会有速度🤣

我们需要更新 `/etc/apt/sources.list` 和 `/etc/apt/sources.list.d/raspi.list` 这两个文件的内容。可以复制原文件做好备份，但是不要复制 /etc/apt/sources.list.d/raspi.list 文件，因为

```
N: Ignoring file 'raspi.list.backup' in directory '/etc/apt/sources.list.d/' as it has an invalid filename extension
```

我们选择清华源来作为我们的软件源，参照 [Raspbian 软件仓库](https://mirrors.tuna.tsinghua.edu.cn/help/raspbian/) 和 [Raspberrypi 软件仓库](https://mirrors.tuna.tsinghua.edu.cn/help/raspberrypi/) 来调整我们的软件源。如果你像我一样安装的是64位系统，那么需要参考[Debian 软件源](https://mirrors.tuna.tsinghua.edu.cn/help/debian/)的内容，如果你是32位系统也就是 armv7l 架构并且没有看到对应的 Debian 版本 Debian 12 Bookworm，手动把前一版的 bullseye 换成 bookworm 即可。

```
> cat /etc/apt/sources.list

# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware

deb https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
# deb-src https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware

> cat /etc/apt/sources.list.d/raspi.list

deb https://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ bookworm main
# deb http://archive.raspberrypi.com/debian/ bookworm main
# Uncomment line below then 'apt-get update' to enable 'apt-get source'
#deb-src http://archive.raspberrypi.com/debian/ bookworm main
```

⚠️ 不要照抄，调整完成后，就可以畅快 apt update apt upgrade apt install 了！


## The raspi-config Tool 🛠

一个比较友好的[TUI](https://en.wikipedia.org/wiki/Text-based_user_interface)设置界面

![sudo raspi-config](https://f.xavierskip.com:42049/i/7c1f0c7d5fc7ccd3a9e3028bd7b1fa706702078d0d2f9ed667b5f4269e137530.png)

其实也就在 localisation options 中设置字符集和时区了。


## SSH 安全登陆 🔭

### 基于密钥的身份验证 🔐

根据[个人数据安全不完全指南](https://thiscute.world/posts/an-incomplete-guide-to-data-security/#%e4%b8%89ssh-%e5%af%86%e9%92%a5%e7%ae%a1%e7%90%86)的建议，我们生成 SSH key 的方式是:

```
ssh-keygen -t ed25519 -a 256 -C "xxx@xxx"
```

这样生成的 ED25519 密钥比老式的 rsa 密钥既短小安全性上又有加强。（好像新版本的 OpenSSH 也开始默认使用 ED25519 了）

在 home 目录下创建一个只有我们用户可以访问的`.ssh`文件夹，创建`authorized_keys`文件，并写入你的公钥匙

```
> mkdir ~/.ssh
> chmod 700 ~/.ssh
> sudo vim ~/.ssh/authorized_keys
> chmod 600 ~/.ssh/authorized_keys
```

在你的终端设备上配置好 config 文件， 就可以用简短的名称来一键登陆了！

```
> vim ~/.ssh/config

Host [yourhostname]
  HostName [ip]
  Port     [port]
  User     [username]
  IdentityFile [~/.ssh/id_ed25519]

> ssh [yourhostname]
Linux labpi 6.1.0-rpi8-rpi-v8 #1 SMP PREEMPT Debian 1:6.1.73-1+rpt1 (2024-01-25) aarch64
...
...
```

### SSH 登陆的安全措施 🤫

给 ssh 登陆设置安全措施是必要的.

- 不允许密码登陆
- 只允许密钥登陆及限制登陆用户
- 停止使用不安全的登陆方式

因为sshd主配置文件`/etc/ssh/sshd_config`里有`Include /etc/ssh/sshd_config.d/*.conf`一行，所以我们可以在`/etc/ssh/sshd_config.d`里创建自己的配置文件

```
> sudo vim /etc/ssh/sshd_config.d/my.conf

ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
```
参考：[Using key-based authentication.](https://www.raspberrypi.com/documentation/computers/configuration.html#using-key-based-authentication)


# 安装配置应用 📟

受限与树莓派孱弱的性能，以及网卡只有百兆的带宽，我也就使用树莓派跑点网络应用，自用的小网站，下载器，以及临时的文件存储中转点。

## 自制的 ddns 工具 🌍
首先是[自制的 ddns 工具](/2018-05-20-ddns/)，好让我找到我家宽带的公网IP，有了这个地址我才能连回家里使用此树莓派上搭建的服务。

## [File Browser](https://filebrowser.org/features) 🗃️

File Browser 是一款给本地文件夹里的文件内容提供网络访问的工具，go 语言编写，单个可可执行文件，下载安装使用方便，能够对文件夹内的文件提供查看、上传、下载以及分享的功能，简单够用。

## [aria2 下载工具](https://github.com/aria2/aria2) 📥

通过 `sudo apt-get install aria2` 直接安装。网页前端管理面板可以使用[AriaNg
](https://github.com/mayswind/AriaNg)

配置文件可以参考：
 - [用树莓派 Raspberry Pi 远程下载 (aria2)](https://li-aaron.github.io/2019/01/aira2-on-raspberry/)
 - [Aria2 完美配置](https://github.com/P3TERX/aria2.conf)

## caddy web 服务器 🌐

能够自动为你提供 https 服务的 web 服务器，同样是 go 语言编写，安装使用方便。

可以参考官方的[手动安装教程](https://caddyserver.com/docs/running#manual-installation)。

配置文件可以参考这里：[Caddy2 简明教程](https://mritd.com/2021/01/07/lets-start-using-caddy2/#%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE-Caddy2)

有了这个 web 服务器，就能很好的将上面的 web 服务用统一或者不同的的 host name 来访问了，可以不再使用端口号来区分不同服务了，配合[Pi-hole](https://github.com/pi-hole/pi-hole/#one-step-automated-install) 这个本地自建 DNS 服务就可以用自己容易的记忆的 URL 地址来访问各种服务了，当然配合 cloudflare Tunnels 你还可以使用自己的域名在互联网上随意访问这些服务了。

## 挂载移动硬盘 🏔️

上面的下载工具也需要存储空间来保存文件，我们需要挂载外置硬盘到设备上，其实重点是设定开机自动挂载的方式。

我参考[浅析 fstab 与移动硬盘挂载方法](https://steinslab.io/archives/1503)设定的 fstab 文件如下

```
UUID=[drive uuid] /home/nas/toshiba ext4 defaults,nofail,x-systemd.device-timeout=1,noatime 0 2
```

根据[fstab](https://wiki.archlinuxcn.org/wiki/Fstab#%E9%80%9A%E8%BF%87_systemd_%E8%87%AA%E5%8A%A8%E6%8C%82%E8%BD%BD)文档，虽然说 nofail 建议和 x-systemd.device-timeout 一起使用，但是我的老硬盘好像反应比较慢，我就把这条给去掉了，所以最后我的 fstab 设置是：

```
UUID=[drive uuid] /home/nas/toshiba ext4 defaults,nofail,noatime 0 2
```

目前看起来一切正常。

## 自制图床项目 🖼️

上面的搭建的 web 服务和外置硬盘存储空间以及 ddns 工具都给这个项目提供了支持，我自己写了个[自用图床](/2022-01-14-img-host/)，就是跑在这个设备上。

系统自带的 python 版本是 3.11，貌似这个版本的 pip 不再支持通过`pip install httpie`来安装系统级软件包了，要安装系统级别的软件包还是得考系统的软件包管理工具比如`apt install httpie `。

看来需要先添加虚拟环境，然后再安装。

```
> python -m venv djangoenv
> source djangoenv/bin/activate
> pip install django
> deactivate
```

## vscode 远程开发 👨‍💻

哦对了，如果你喜欢通过 vs code 远程登录到设备上来开发，树莓派3B 1G 的内存及默认 100M 的 SWAP 交换空间[有点小](https://github.com/raspberrypi/linux/issues/2810#issuecomment-1137620403)，我建议修改`/etc/dphys-swapfile`文件中的`CONF_SWAPSIZE`值来增加 Swp 空间，个人建议至少到 256M，可酌情添加。

![htop](https://f.xavierskip.com:42049/i/10ae4d2d1642be03ad7137dcbb1dc4f182fed186c42861c45dbd5e57e44f3138.png)


# 总结 🏁

这次突发意外事件，虽然损失惨重，但是再次证明了对数据进行备份的重要性及对重要操作记笔记及事后复盘的重要性，

首先找到了多年前重新部署时的笔记，虽然时间过去了很长，软件和系统都发生了升级，不太能照搬操作，但还是能告诉我基本步骤和避免遗忘的点。

🚨 重要数据一定要备份 💾


1. 存储多份
2. 存放在不同的物理介质（空间）

只要做好上面的两点，不能说是高枕无忧（RAID Is Not Backup），起码遇到事故不再是手足无措。
