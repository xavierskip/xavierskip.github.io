---
layout: post
title: 如何使用 keepass 密码管理器作为你的两步验证器
tags:
 - software
 - password
---

> 🚨⚠警告：把密码和 OTP secret key 保存在一起有悖「二次验证」的目的！

# 什么是两步验证 2FA

一般的账户登录是根据**用户名**和**密码**来登录，两步验证是指在**用户名、密码**的验证后另外再加的一道验证口令，这种口令通常是一次性的，常见的2FA方式就是通过手机接收验证码来验证（也有通过验证码直接登录）。

不过本文里提到两步验证是指 **基于时间的一次性密码** TOTP。TOTP 是一种根据预共享的密钥与当前时间计算一次性密码的算法，名称很清晰的告诉我们了，这是一种根据根据时间不断变化的密码。

如果需要设置 2FA，会给你提供一个二维码，如果没有二维码会给你提供一个口令，验证器识别后，就会生成相应的密码，用于两步验证。

这里的二维码，你解码后会发现就是一串字符、一个 URI，类似如下[^1]：

```
otpauth://totp/ietfuser?secret=NBSWY3DP
```

<img class="flip png" src="https://f.skip2.top/i/f52e3e6455434ef477217050123e3039d1431aa946a38c7172fc626a47d34ca9.png" alt="otpauth">

# 为什么使用 keepass 密码管理器

市面上有那么多种密码管理器，为什么要选择 keepass。主要是可以离线使用，安全感拉满。同时密码文件是重要数据，绝不能丢失的文件，所以数据备份非常重要，你可不想你的密码文件只有一份，而你没有备份或者你的备份手段失效后密码文件损坏后的悲惨结局吧。密码管理器不一定能做好备份的事情，所以我们需要一个读取本地文件作为密码文件的密码管理器，这样我们有几个设备安装了密码管理器就有几份密码文件被保存在本地，这样在形式上不就是分布式存储吗，在使用的过程中顺便就已经完成了备份文件到不同地方的操作。

> 但在实际上我还是使用 WebDAV 来保证密码文件的同步。

# 如何使用

一般来说，平台会告诉你一个二维码，你使用验证器软件（一般是移动设备软件）扫描二维码即可，然后将生成的验证码提交即可完成 2FA 的设置。

要将 Windows 平台上的 keepass 客户端[^2] 当作验证器一样使用，需要将平台给定二维码解码成文本。在 **编辑记录** > **工具** > **导入‘otpauth://’网址** 中添加即可。

![编辑记录 > 工具 > 导入‘otpauth://’网址](https://f.skip2.top/i/433d4da829e3c87cb28d5557a5c7d3051650849158eca4ecca64f8e12e840974.jpg)

这会在此记录的 **高级** > **自定义字段** 添加一个名称为 TimeOtp-Secret-Base32 的字段。

要获取验证码只需要右键点击记录，在 **其他数据** 中 选择 **复制基于时间戳的OTP** 即可。（快捷键`ctrl+T`）

![复制基于时间戳的OTP](https://f.skip2.top/i/6fa5b11e5b29279c216ac8f170ae91c705aa465463abdb6d90ee8d19a665c0ce.jpg "复制基于时间戳的OTP")

如果在移动端你使用 Keepass2Android[^3] 这款客户端，通过此方式设置的两步验证，你也能很方便的看到 TOTP 验证码。鉴于此软件的安全策略，无法做到在手机上截图（如果你知道请告诉我），所以没有图片展示。

上面提到了 Windows 和 Android 上的客户端，如果你知道在其他系统平台上好用的客户端也请告诉我！🙌👀🔎


[^1]:[Usage specification of the otpauth URI format for TOTP and HOTP token generators](https://www.ietf.org/archive/id/draft-linuxgemini-otpauth-uri-00.html)
[^2]:[KeePass 2.58](https://keepass.info/download.html)
[^3]:[Keepass2Android](https://github.com/PhilippC/keepass2android)
