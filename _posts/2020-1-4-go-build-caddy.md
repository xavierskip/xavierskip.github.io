---
layout: post
title: 自行编译caddy
tags:
- golang
---

### 为什么要自己编译caddy?

不是可以自行[下载](https://caddyserver.com/v1/download)，包括各种平台各种插件，一有尽有，很方便呀?

何必自己编译，哪怕大家都知道go编译或是交叉编译都超级方便，可以但是没必要。

这是因为我需要使用的 dnspod 插件出了点[问题](https://github.com/caddyserver/dnsproviders/issues/87)

```
acme: error presenting token: API call failed: json: cannot unmarshal number into Go struct field DomainInfo.info.share_total of type string
```

还没来得及修复，只有自己动手编译了，还好这个问题很好[修复](https://github.com/decker502/dnspod-go/commit/385e0366b9b2e7aa429c517e9d07c70eb7612f70)

主要是 [dnspod api](http://dnspod.github.io/dnspod-api-doc/domains.html#domain-list) 返回的 json 中某个字段的类型发生了变化，改过来就好了。

### 开始编译caddy

不复杂，参照 [build](https://github.com/caddyserver/caddy#build) 步骤即可。

但是我们的问题是，需要先修改一点点源代码的内容再来build。

这里使用了`go mod`，我对go的这个包管理方式是一无所知，无从下手。

先是`go get`遇上了麻烦，被墙了。还好有本地的http代理，添加环境变量搞定。

```shell
export http_proxy=http://127.0.0.1:8080
export https_proxy=https://127.0.0.1:880 
```

可是关键在于我们需要**修改**某个 package 的内容再 install，我并不知道这其中的机制到底是什么，但是我知道 get 下来的内容保存在了`$GOPATH/pkg/mod`的文件夹下。于是我就直接进入这个文件夹下找到我需要修改的 package，完成我的修改然后再`go install`。

然后 copy 到我的树莓派上运行！

OK！It'works!!

撒花🎉结束！



*注意，交叉编译给我的树莓派使用需要添加以下的环境变量*

`GOOS=linux GOARCH=arm GOARM=7 go install`

[https://golang.org/doc/install/source#environment](https://golang.org/doc/install/source#environment)

`uname -a` 参看设备信息来选择GOARM

[https://github.com/golang/go/wiki/GoArm#supported-architectures](https://github.com/golang/go/wiki/GoArm#supported-architectures)











