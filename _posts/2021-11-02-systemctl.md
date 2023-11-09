---
layout: post
title: linux 系统下添加开机启动服务
tags:
- linux
- note
---

因为好多年前写过一篇文章介绍这个内容，文章的内容已经过时了，最近在linux下实践添加了几个自动启动的程序，做个总结，也顺便更新下[以前的内容](https://blog.xavierskip.com/2015-02-02-shadowsocks-init/)。

我们先创建服务文件，放到`/etc/systemd/system/`目录下面

`sudo vim ssserver.service`

写入以下内容

```
[Unit]
Description= shadowsocks-rust Service
After=network.target network-online.target
Requires=network-online.target

[Service]
User=nobody
Group=nogroup
RemainAfterExit=yes
ExecStart=/....../ssserver -c /..../config.json # 自行修改为你的运行程序
ExecReload=/bin/kill -HUP $MAINPID  # 注意留意kill的路径是否符合你的环境，用`which kill`查看
ExecStop=/bin/kill -s STOP $MAINPID # 注意留意kill的路径是否符合你的环境，用`which kill`查看
RestartSec=1min
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

添加或修改配置文件后，需要重新加载

`sudo systemctl daemon-reload`

设置开机启动

`sudo systemctl enable ssserver.service`

启动

`sudo systemctl start ssserver.service `  

查看运行状态

`sudo systemctl status ssserver.service`

查看其他的单元配置文件

`sudo systemctl cat xxxxxx.service`

推荐阅读：

1. [Systemd 入门教程：实战篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html)
2. [Systemd 入门教程：命令篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
3. [systemd (简体中文)](https://wiki.archlinux.org/title/systemd_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

