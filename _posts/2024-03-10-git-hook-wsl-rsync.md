---
layout: post
title: 使用 git hook 在 WSL 中执行 rsync 的小技巧
tags:
 - git
 - windows
 - wsl
 - rsync
---

接上文提到了数据备份的必要性，我想到了一个点子，既然我的博客是通过分布式版本控制系统 git 来存储博客数据的，那么我为什么不能每次 git 提交的时候自动执行备份博客图床系统的数据呢？

显然是很容易做到的，只需要在 `.git/hooks` 文件夹下添加相应的脚本文件即可。

我想在每次 push 提交的时候讲远程设备上文件同步到本地保存，这样我的图床数据也和我的 blog 数据一样在本地保存一份，目前来看图床的数据也仅仅跟 blog 更新有关，这个操作👍

在我的 MAC 上很快就设置好了 `.git/hooks/pre-push`

```bash
rsync -azP raspi:/home/pi/www/  ~/xavierskip.github.io/_db
```

我依葫芦画瓢在 Windows 上的 git 仓库里设置同样的 hook 时，运行会报错！

```bash
> cat pre-push

#!/bin/bash
wsl rsync -azhP  raspi:/home/pi/www/    /mnt/z/backup/www

> git push
The source and destination cannot both be remote.
rsync error: syntax or usage error (code 1) at main.c(1428) [Receiver=3.2.7]
```

这是个什么奇怪的错误，仔细检查命令的路径出了什么错呢？单条命令拿出来都可以正常执行，不懂？

不过最终还是搜索到了相关信息：[rsync (cwrsync) in Gitbash - The source and destination cannot both be remote. [windows 7]](https://stackoverflow.com/a/67658259/1265727)

这位老哥告诉了我们一个叫做`MSYS_NO_PATHCONV`的环境变量，最终解决了在 Windows git 上的某种路径错误。

```bash
#!/bin/bash
# https://stackoverflow.com/a/67658259/1265727
# solve：The source and destination cannot both be remote.
# rsync error: syntax or usage error (code 1) at main.c(1428) [Receiver=3.2.7]
export MSYS_NO_PATHCONV=1
wsl rsync -azhP  raspi:/home/pi/www/    /mnt/z/backup/www
```