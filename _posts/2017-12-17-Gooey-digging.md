---
layout: post
title: 在使用Gooey库以及使用PyInstaller对其进行打包过程中踩的若干个坑
tags:
- programe
---

用Python3写了个小工具，想起来之前看过一个非常酷的GUI库，一直没有实践过，想着应用到这个非常简单的工具上应该不会有什么阻碍的，但是依旧踩了些坑，而且看起来更像是自己给自己挖的坑。

*以下的Python版本都是Python3*

首先我使用的GUI库是[**Gooey**](https://github.com/chriskiehl/Gooey)。它是一个能够非常方便的将你的命令行程序转换成图形界面的程序库。

但是当你的程序在**中文Windows系统**中运行时，你会发现输出中文字符并不会如你所愿出现在程序的输出界面中。报错是我们非常熟悉的字符编码错误`UnicodeDecodeError: 'utf-8' codec can't decode byte 0xc4 in position 6: invalid continuation byte`，经常有初学者遇到编码问题手足无措然后上论坛提问，有些人便会直接回答道：换掉2直接用Python3吧。我想他们是不是误会了些什么，如果你对基本的字符编码概念一无所知以及不规范操作字符串不管你用Python2还是Python3一样都会遇到字符编码的问题。Python3在处理字符的方式与Python2截然不同，但是这不意味这些改动会保障你不出字符编码的问题。

好在MacOS上运行一切正常，可能和中文Windows下终端的默认编码有关系，我在`cmd`下执行`chcp`得到的是`活动代码页: 936`，不仅输出中文会引发错误，而且我也试过日文等其他语言，我认为是**因为字符编码的原因在中文Windows系统下输出任何Non-ASCII字符都会引发编码错误**，具体的原因我还没有深入的debug，我在github上提出了[Issue](https://github.com/chriskiehl/Gooey/issues/230)但是到目前为止没有得到回复。

暂时试出来两个解决方法。



1、直接在源码出错的位置修改，正确的转换字符串

```python
# gooey\gui\windows\runtime_display_panel.py line 53
self.cmd_textbox.AppendText(txt.decode('GBk'))
```



2、直接在我们程序中修改，对标准输出的编码方式进行修改 [via](https://stackoverflow.com/a/3597849/1265727) 

```Python
utf8_stdout = os.fdopen(sys.stdout.fileno(), mode='w', encoding='utf-8', closefd=False)
sys.stdout = utf8_stdout
```



好在这个错误是和平台相关的，不用*一次编写，到处修改*。那为什么不用第二个方法呢？因为，如果你想要使用PyInstaller来打包你的程序的话，会遇上麻烦。下面就是使用PyInstaller的坑。

[Windows and Mac OS X: do not provide a console window for standard i/o. ](http://pythonhosted.org/PyInstaller/usage.html#windows-and-mac-os-x-specific-options)如果你想打包一个不会出现终端黑框点击即运行的程序，那就不要在你的程序中使用`print`至少不要直接使用，你可以用hello world级别的代码来试一下，也可以试一下对以下代码进行打包操作。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os,sys
import time
text = "你好"
t = "hello!\n{}".format(text)
utf8_stdout = os.fdopen(sys.stdout.fileno(), mode='w', encoding='utf-8', closefd=False)
sys.stdout = utf8_stdout
sys.stdout.write(t)
time.sleep(1)
```

`pyinstaller hello.py -F -w`打包后生成的可执行文件会弹出下图的错误。所以我们还是直接用第一种方法吧。

![屏幕快照 2017-12-18 下午9.12.03](https://h.xavierskip.com:42049/i/b9f8020d9a17bcb653f01937bd6c17c1a2bce4ab6100338c0c6cece3c0ebbd4f.jpg)

好了，解决了Gooey配合PyInstaller打包的问题，那么接下来就是PyInstaller自身的毛病了，和UPX配合也有毛病。



我安装的PyInstller版本是3.3。哪知道这个版本不兼容xp，不兼容不是不能在xp系统上运行，而是打包的可执行文件不能在xp上运行，但是可以在Windows7及以上的系统运行，也就是说3.3版本的打包可执行文件不能在xp上运行。我知道xp已经很老，安装Python3也只能安装Python3.5版本以下的，但是既然我们都到Windows上打包程序了，而且一个小工具而已，在系统上也不应该是兼容性的问题，这个问题大多数出在PyInstaller自身上。

网上搜索了一下发现确实是版本的问题，有人反映在[3.2.1版本还可以在xp下工作](https://github.com/pyinstaller/pyinstaller/issues/2931)，于是我重新安装了3.2.1版本来试一下。注意，这里有一个坑，**重新安装后不要马上执行打包操作，请先清除之前打包过程中生成的build文件夹**，否则会引发错误。然后3.2.1版本在给可执行程序添加version信息的功能上并不兼容Python3，具体解决方法可以参考我的[项目说明书][1]。

好了解决了上面的问题，总算可以正常的在Windows XP下打包程序了。然后我看到PyInstaller更新了，[v3.3.1][2]更新的内容有

> (Windows) Pre-build bootloaders (and custom-build ones using MSVC) can be used on Windows XP again. Set minimum target OS to XP ([#2974](https://github.com/pyinstaller/pyinstaller/pull/2974)).

……

这还没完，在Windows7以及Windows10上如果你用[UPX](3)配合PyInstaller进行打包，生成的可执行文件将会无法运行。

如果你用hello world级别程序是进行UPX压缩打包不会有问题，但是引入Gooey库后再用UPX压缩打包后报错，取消UPX压缩后错误消失。在Windows7上报错如下：

> PyInstaller\loader\pyimod03_importers.py", line 715, in load_module
>
> ​    module = loader.load_module(fullname)ImportError: DLL load failed: 内存位置访问无效。
>
> [928] Failed to execute script arg

Windows10下也是差不多的情况，具体报错信息不同，不想研究了……失去耐心了。

![崩溃](https://h.xavierskip.com:42049/i/25e8e64ddb4dd4d54cdf1b65f0c1fbbaec073f2bfd4188c8315a982be5cbe41e.gif)



妈蛋，XP下打包好的可执行文件拿去滚。到最后还是得靠XP。

最后我为了解决在Windows中文系统中无法正确显示输出中包含中文等各种其他字符的问题提出了[Pull request](https://github.com/chriskiehl/Gooey/pull/237)

[1]:https://coding.net/u/skipto/p/CSVFilter/git
[2]:https://github.com/pyinstaller/pyinstaller/releases
[3]:https://upx.github.io/