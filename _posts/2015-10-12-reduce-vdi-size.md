---
layout: post
title: 减小VirtualBox虚拟机动态扩展硬盘文件尺寸
tags:
- 解决
---
在使用VirtualBox虚拟机的时候发现，虚拟机硬盘文件的大小增长的很快而实际虚拟机系统并没有存储那么多的文件。

这是因为使用的是VirtualBox动态分配存储的虚拟机硬盘文件，格式后缀名为`vdi`,硬盘文件会随着虚拟机的使用逐渐变大而不会缩减。举个例子，虚拟机本身含有20G的文件内容，此时虚拟机硬盘文件大小也为20G，然后我们在虚拟机中安装一个10G大小的软件（或者下载一个10G大小的文件），此时虚拟机含有30G的文件，外部的虚拟机硬盘文件也会增大到30G。而当我们删除这个10G的文件，虚拟机的文件内容减少了，可是宿主机中的虚拟机硬盘文件尺寸并不会缩小。

也就是说，你在虚拟机中存储**过**多少文件，宿主机中的虚拟机硬盘就会有多大，即使你在虚拟机中删除了文件，虚拟机硬盘文件依旧会在宿主机中占有这些空间。随着虚拟机的运行，虚拟机硬盘文件不可避免的会占有越来越多的宿主机空间。

所以我们需要给虚拟机的硬盘文件瘦身。

瘦身的原理是：利用工具将虚拟机硬盘中的空闲空间全部标零，以便让VBoxManage.exe 对虚拟硬盘vdi文件进行压缩。

**我的环境是，宿主机 windows 系统，虚拟机 linux ubuntu。**

####步骤：

首先对虚拟机中的空闲磁盘空间进行标记，未用空间全部标零。

windows 利用 [sdelete](https://technet.microsoft.com/en-us/sysinternals/bb897443.aspx) 工具

linux 利用 zerofree，`sudo apt-get install zerofree`

注意，在标记的过程中不能对硬盘进行写操作，windows下不清楚，linux下 zerofree 工具执行的时候需要硬盘处于只读模式。

![Drop to root shell prompt](https://f.xavierskip.com:42049/i/74d3cde3c7b381d0a12478300a452fe9d553add89a3c831918d3dab7bb91a43f.jpg)

进入ubuntu的 Recocery Mode,选择`Drop to root shell prompt`进入shell,执行`df`找到你挂载到根目录的分区，比如我的是`/dev/mapper/seafile—vg-root`（因为使用了[LVM](http://askubuntu.com/questions/3596/what-is-lvm-and-what-is-it-used-for/3833#3833ac)）,执行`zerofree -v /dev/mapper/seafile—vg-root`,等待需要比较长的一段时间。完成后关闭虚拟机，接下来在宿主机中进行。

在VirtualBox的安装目录下找到VBoxManage.exe，cmd中执行`VBoxManage.exe modifyhd "path\to\vm.vdi" -compact`，等待，完成后你会发现虚拟机的硬盘文件缩小了很多。反正我的是从100G缩小到23G，和我的虚拟机系统真正的文件内容22G相差无几。

####参考：
[How To Shrink Your Virtualbox VM And Free Up Space For Your Hard Disk](https://www.maketecheasier.com/shrink-your-virtualbox-vm/)

####备注：


在我查资料的时候，大多都说执行命令`sudo mount -n -o remount,ro  /dev/sda`重新挂载分区为只读模式，如果你是正常启动的server然后再重新挂载，必定是不行的，server运行的时候太多文件被读写了，所以还是直接进入Recocery Mode比较方便。

要不去直接去修改`/etc/fstab`然后再改回来？如果修改为只读，那怎么再修改文件改回来呢？不懂，不敢试！

以上是我的Ubuntu server的情况。



