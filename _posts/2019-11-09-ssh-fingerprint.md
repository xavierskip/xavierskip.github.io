---
layout: post
title: ssh远程登陆中的钥匙指纹是什么以及如何比对
tags:
- ssh
---

有时候我们在 ssh 登陆时会出现下面的警告信息

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:sYNNR1L6T5cSAG4BndqtdDhJEI0eB9LamBTkuIue3+0.
Please contact your system administrator.
Add correct host key in /Users/xx/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /Users/xx/.ssh/known_hosts:40
ECDSA host key for [xx.com] has changed and you have requested strict checking.
Host key verification failed.
```

这是提示有中间人攻击可能正在发生。

因为远程主机的公钥和我们之前连接此主机的公钥发生了变化。

而且当我们第一次连接某个远程主机的时候会提示下面的内容

```
The authenticity of host [xx.com] can't be established.
ECDSA key fingerprint is SHA256:/FtMoqIv9WakAZklbpVU9pmlsgVt5pEQCAMrJLj8Zp8.
Are you sure you want to continue connecting (yes/no)?
```

我想很多人会像安装软件点击下一步和已阅读用户条款一样输入 yes 继续进行下去。

上面的信息中都出现了`key fingerprint`那么这个指纹是什么呢，怎么得到，需不需要验证呢？怎么验证呢？

通过查找资料我知道如何获取以及验证指纹信息了

```shell
> cd /etc/ssh/
> ssh-keygen -lf ssh_host_rsa_key.pub
2048 SHA256:mDeLabzTVsvlIZp4aYjE1z4kPU2N9l0fpnKGVX3Xlko root@com (RSA)
> ssh-keygen -E md5 -lf ssh_host_ecdsa_key.pub
256 MD5:b9:9c:c6:c1:53:8e:7b:81:75:9d:96:6c:a4:3a:8c:62 root@com (ECDSA)
> ssh-keygen -E sha1 -lf ssh_host_ecdsa_key.pub
256 SHA1:NgfUNvbRcuL2rIpFnrlrti5fvuc root@com (ECDSA)
```

这个指纹信息就是根据公钥生成的，如输出内容显示，现有版本默认是经过 `SHA256` hash 过的，你也可以指定其他的 hash 算法，如果需要的话。

然后我还发现对密钥也使用这个命令的话也能生成指纹，而且是一样。不知道为什么？不过不影响我们继续。

你可以通过安全（物理）接触方式登陆到主机中获取钥匙指纹，也可以通过以下方式远程获取公钥然后生成指纹信息。

```shell
> ssh-keyscan example.com
# example.com:22 SSH-2.0-OpenSSH_7.4 ubuntu
example.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDylWmnhUyY+erBnhZmALWQVyz0+h2StMiOJ2+WtyIxrz2H6ZaTEPDSmjIZv76Bp7bMaYDnW6gMoVrZo0ioBXPBKa51lou5pjMJgFC6pCUU/3IDBtddbJIQqWw9vM/1xM7t9IkYLOVvbHgAw+/zzZD2CASAyr6a59uNx2Y5nCLSKPVb6azSWSTPnPuexnGznKDkS3DX/l54mpPpTzQJuAw1vbYd6asULMtWqnzheY+NJ/9RZJMRIpEVkXAfCglBQVKNPAeHda1B9UfNoRo+BqjLX6ODxMsdff+47edL09DSBdavu0Ik3bMnlND0ZizfbDxgBAFXHwx3pyrBn1HEM2k5
# example.com:22 SSH-2.0-OpenSSH_7.4 ubuntu
example.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoIUDtbmlzdHAyNTYAAAAIbmlzdHAyNTYAAACEp340W8Wlfc+Q9iG26J3POdnhrBLPWOOWcwZLW21FCwKVjCzTpLRd82dk4awzk/qB92otJ0ha75CXoX6CDrWoSSs=
# example.com:22 SSH-2.0-OpenSSH_7.4 ubuntu
example.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5999IEvv2Nu2aVhwnno+DNCnKwJbWWP+olRXHK710ai5lvF8

> ssh-keyscan -t ecdsa example.org
# example.com:22 SSH-2.0-OpenSSH_7.4 ubuntu
example.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoIUDtbmlzdHAyNTYAAAAIbmlzdHAyNTYAAACEp340W8Wlfc+Q9iG26J3POdnhrBLPWOOWcwZLW21FCwKVjCzTpLRd82dk4awzk/qB92otJ0ha75CXoX6CDrWoSSs=
```

你会发现这些钥匙都是经过`base64`处理过的，这样以便与以文本的形式存储。

```shell
> ssh-keyscan -t ecdsa example.org|ssh-keygen -lf -
# example.com:22 SSH-2.0-OpenSSH_7.4 ubuntu
256 SHA256:fMVRWYO/+73I9ZoFGhPkE1HO9IoPyexzLBabxUx2EhE example.com (ECDSA)
```

这样得到的信息就用来和上面的警告以及提示信息进行比对了。就像下载软件后比对 md5、sha1值一样。

其实在生成钥匙对的时候就会显示指纹信息

```shell
> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/user/.ssh/id_rsa): testkey
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in testkey.
Your public key has been saved in testkey.pub.
The key fingerprint is:
SHA256:Bw1NuIXaa7h6tzABTDOq0/esnqQiNJe4FeNThfYffHY root@local
The key's randomart image is:
+---[RSA 2048]----+
|        .=.+     |
|      . ooo      |
|     o +.o.      |
|    .o+ +S       |
|  .o+. oS+.o E   |
| o..+=..+.+ .    |
|o.o+. *o .       |
|*.ooo+oo.o=      |
|==.o==o...=      |
+----[SHA256]-----+
```

下面的命令更直观的显示指纹是怎么生成的

```shell
# 直接本地读取公钥
> awk '{print $2}' ssh_host_ecdsa_key.pub | base64 -d | shasum -a 256 -b | awk '{print $1}' | xxd -r -p | base64
fMVRWYO/+73I9ZoFGhPKelH67IoPyexzLBtbxUx2EhE=

# 远程获取公钥
> ssh-keyscan -t ecdsa 192.168.10.1 | awk '{print $3}' |base64 -d|openssl sha256 -binary |base64
# 192.168.10.1:22 SSH-2.0-OpenSSH_7.4p1 Raspbian
fMVRWYO/+73I9ZoFGhPKelH67IoPyexzLBtbxUx2EhE=

```



推荐阅读：

-  [ssh 登录服务器的指纹如何获取、验证，以及除了中间人攻击外什么操作会改变服务器指纹？](https://segmentfault.com/q/1010000009057659)
- [Checking ssh public key fingerprints](https://www.phcomp.co.uk/Tutorials/Unix-And-Linux/ssh-check-server-fingerprint.html)
- [openssh cookbook](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Public_Key_Authentication#Downloading_keys)
- [SHA256 ssh fingerprint given by the client but only md5 fingerprint known for server](https://superuser.com/questions/929566/sha256-ssh-fingerprint-given-by-the-client-but-only-md5-fingerprint-known-for-se/929567#929567)

 

