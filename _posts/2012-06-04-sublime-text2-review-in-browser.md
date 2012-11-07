---
comments: true
date: 2012-06-04 07:19:57
layout: post
title: Sublime Text2 中快捷键直接在浏览器中预览
wordpress_id: 539
categories:
- Geek
tags:
- Sublime Text2
- hotkey
---

在 Sublime Text2 中编辑HTML文件时需要在浏览器中看下效果，当然直接就在浏览器中打开文件，编辑后再刷新看效果也是可以的。不过，

直接在 Sublime Text2 下按快捷键，然后直接在浏览器中打开文件查看效果，不是更好么？

而 Sublime Text2 居然自身没有带这个功能，虽然对于 py脚本可以直接 Ctrl+B 来执行，可是对于html文件直接在浏览器中浏览确实没有直接提供这个功能的，不过可以通过自定义插件很方便的实现这个功能。editplus 这个文本编辑器在这方面就做得非常完善，可以自定义各种编译环境，可以做简易的JAVA IDE 使用。

言归正传



我需要自定义 Sublime Text2 的插件 ，点击菜单Tools -> New Plugin...，在创建好的py文件输入下列内容：

    
    
    import sublime, sublime_plugin
    import webbrowser
    
    class OpenBrowser(sublime_plugin.TextCommand):
        def run(self, edit):
            url = self.view.file_name()
            webbrowser.open(url)
    


创建的时候会给你一个模板，一目了然，改改就可以了。需要用到python的webbrowser模块，可以先试一下这个模块能否正常运行， Sublime Text2 本身的运行就是需要python环境的，没有安装python的，Sublime Text2 应该自带的python环境也是应该可以的！？？

接下来保存，就是默认弹出来的 Packages/User目录就可以，文件名可以保存为 open_browser 或者什么，反正你记住可以了。

最后设置快捷键
点菜单Tools -> Command Palette...，或者shift+Ctrl+p，打开命令集，选择“key Bindings - User”打开个人快捷键配置，输入下列内容：

    
    [{ "keys": ["f5"], "command": "open_browser" }]
     #我自己设置的快捷键是F5，后面的命令就是那个文件名了


保存就可以使用了。

用 Sublime Text2 打开一个html文件，然后快捷键就可以看到效果了。

注：本人默认浏览器是 chrome ，以上是在 win 下配置的。win 下的python 为2.7.2 。

引用 __ 进阶：
[ http://www.imququ.com/post/view_sublime-text-2_file_in_browser.html](http://www.imququ.com/post/view_sublime-text-2_file_in_browser.html)
[ http://www.sublimetext.com/forum/viewtopic.php?f=2&t=3851](http://www.sublimetext.com/forum/viewtopic.php?f=2&t=3851)

可以设置快捷键用 IE opera firefox chrome 分别打开，可是暂时自己用不到，先这样吧。
