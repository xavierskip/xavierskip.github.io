---
layout: post
title: 设置 shadowsocks server 开机启动
tags:
- 技术
---
<style type="text/css">@import url(/media/css/pygments.css)</style>



虽然我知道服务器一般是不重启的，但是万一重启了，还得重新运行shadowsocks server还是很麻烦的，就想将 shadowsocks 添加到开机运行中去。

参考以下两篇文章，依葫芦画瓢，还算是成功了。
平台 Ubuntu 14.04

* [开机启动 Seafile](http://manual-cn.seafile.com/deploy/start_Seafile_at_system_bootup.html)
* [ 编写linux service并设置开机启动(Ubuntu)](http://blog.csdn.net/mlnotes/article/details/9676187)

谁知道关于添加开机启动服务的官方文档在哪里找？（更新：[UbuntuBootupHowto](https://help.ubuntu.com/community/UbuntuBootupHowto)）然后发现关于启动的内容这么多！[Upstart Intro, Cookbook and Best Practises](http://upstart.ubuntu.com/cookbook/)



创建脚本 /etc/init.d/shadowsocks
-----------

`sudo vim /etc/init.d/shadowsocks`

添加以下内容

{% highlight bash %}
#!/bin/sh

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
{% endhighlight %}

懂bash，或者其他程序语言语法的应该都看得懂是什么意思吧！

然后增加这个文件的可执行权限

`sudo chmod +x /etc/init.d/shadowsocks`

注意：这里命令的权限,我想以root权限运行，如果不想以root权限运行可以用`sudo -u {user} {command}`。如果不给此脚本文件加上其他用户也可执行权限，在运行`service shadowsocks`不加参数时会提示`unrecognized service`.

创建文件 /etc/init/shadowsocks.conf
--------

`sudo vim /etc/init/shadowsocks.conf`

{% highlight bash %}
start on (runlevel [2345])
stop on (runlevel [016])

pre-start script
/etc/init.d/shadowsocks start
end script

post-stop script
/etc/init.d/shadowsocks stop
end script
{% endhighlight %}

Debian系不需要创建 /etc/init/shadowsocks.conf 文件，执行

`sudo update-rc.d shadowsocks defaults`

添加到开机启动中

好了，搞定，可以在shell中直接运行`sudo service shadowsocks {start|reload|stop}`来控制了！



