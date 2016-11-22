---
layout: post
title: 设置 shadowsocks server 开机启动
tags:
- 技术
---

虽然我知道服务器一般是不重启的，但是万一重启了，还得重新运行shadowsocks server还是很麻烦的，就想将 shadowsocks 添加到开机运行中去。

参考以下两篇文章，依葫芦画瓢，还算是成功了。
平台 Ubuntu 14.04

* [开机启动 Seafile](http://manual-cn.seafile.com/deploy/start_seafile_at_system_bootup.html)*主要参考这篇*
* [ 编写linux service并设置开机启动(Ubuntu)](http://blog.csdn.net/mlnotes/article/details/9676187)

谁知道关于添加开机启动服务的官方文档在哪里找？（更新：[UbuntuBootupHowto](https://help.ubuntu.com/community/UbuntuBootupHowto)）然后发现关于启动的内容这么多！[Upstart Intro, Cookbook and Best Practises](http://upstart.ubuntu.com/cookbook/)


###创建脚本 /etc/init.d/shadowsocks

`sudo vim /etc/init.d/shadowsocks`

添加以下内容

```bash
#!/bin/sh
### BEGIN INIT INFO
# Provides:          shadowsocks
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: start shadowsocks 
# Description:       start shadowsocks
### END INIT INFO

start(){
    ssserver -c /etc/shadowsocks.json -d start
}

stop(){
    ssserver -c /etc/shadowsocks.json -d stop
}

case "$1" in
start)
    start
    ;;
stop)
    stop
    ;;
reload)
     stop
     start
     ;;
*)
    echo "Usage: $0 {start|reload|stop}"
    exit 1
    ;;
esac
```

懂bash，或者其他程序语言语法的应该都看得懂是什么意思吧！

注意：这里命令是以root权限运行，如果不想以root权限运行可以用将命令改为`sudo -u {user} {command}`

###增加这个文件的可执行权限

`sudo chmod +x /etc/init.d/shadowsocks`


###在 rc.d 中新增

`sudo update-rc.d shadowsocks defaults`

添加到开机启动中

好了，搞定，可以在shell中直接运行`sudo service shadowsocks {start|reload|stop}`来控制了！



