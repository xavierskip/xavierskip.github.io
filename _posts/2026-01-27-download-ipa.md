---
layout: post
title: 如何下载 iOS 应用的 ipa 文件
tags:
 - tool
 - note
 - ios
---

我被[麦当劳应用](https://apps.apple.com/cn/app/id1054598922)的通知铃声吸引到了。于是想这段音频下载下来。

首先想到的是把应用下载下来，解包应用，然后找到其中相应的音频资源就好了。可是 iOS 的应用显然没有 Android 应用那么好下载。

尝试了几个网站发现都有各种限制，最后发现了一个本地运行的工具很顺利的将应用下载下来了。

这个工具就是 [ipatool](https://github.com/majd/ipatool)，直接在release里下载下来执行即可。

```
# 需要先登录账号
ipatool auth login -e [your apple id email]
# 找到你的需要应用的 id (其实这个id可以在应用商店的网页中找到)
ipatool search 麦当劳
# 下载
ipatool download -i 1054598922
```

得到 ipa 文件后，将其后缀名更改为 `zip`，解压后即可完成解包。

根据 gemini 的提示，很快就找到了名为`jingle.caf`的目标音频文件。

>
>第三步：查找音频文件
>
>1. 打开 `Payload` 文件夹。  
>
>2. 你会看到一个文件（通常叫 `McDonalds.app` 或类似名称）。 
>    - **Windows用户:** 直接双击进入该文件夹。
>    - **Mac用户:** 右键点击该文件，选择 **“显示包内容” (Show Package Contents)**。
>
>3. **搜索音频:** 在这个文件夹内，按类型排序或搜索音频后缀。iOS 通知的音频文件通常是以下几种格式：  
>    - `.caf` (最常见)
>    - `.aiff`
>    - `.wav`
>    - `.mp3`
>
>4. 你可以试听这些文件。麦当劳那个标志性的“巴拉巴拔罢”声音通常文件很小（几KB到几百KB）。
>


铃声在此：
<audio controls="" src="https://f.xavierskip.com/i/f9ea6786fc0c10bc3747f766ebf21737d95dc76478f417b2d946951d02b9d4ef.mp3"></audio>