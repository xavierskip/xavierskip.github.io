---
layout: post
title: blog搬迁
excerpt: 將wordpress上的文章迁移到jekyll上来
tags: wordpress jekyll 
---

不再使用 wordpress blog了，可是以前写过的文字怎么办？虽然文章都很二，但是毕竟是一个字一个字打出来的呀。（除转载的）   
那就备份一下文章，然后转换格式不就可以了   

好首先要将wp上的内容备份下来，wp自带这个功能吧，备份下来的是个 xml 文件。   
我们需要將这个 xml 文件切割成一个一个的文章，并转换生成 jekyll 的 markdown 格式。   
我通过搜索就找到了[exitwp](https://github.com/thomasf/exitwp)这个工具。   
可以將wp的备份文件转换成 jekyll blog 文章支持的格式。我用了下，很有效很方便。   
具体用法看README就可以了，我只介绍一下。   
工具需要的环境:

- Python
- html2text
- PyYAML
- Beautiful soup

以上库或则环境缺少的话，可以通过这个命令安装
`sudo apt-get install python-yaml python-beautifulsoup python-html2text`   
工具下下来以后，將wp的备份文件放到**wordpress-xml**文件夹下，然后运行'python exitwp.py'就会生成一个**build**文件夹，生成的jekyll 文章就放在这个文件夹里，就可以直接发布了。   
修改`config.yaml`文件用来修改脚本的配置。   

当然生成的文件作为模板很有可能在 jekyll 中有问题，不能生成好文章页面。我就碰到了，由于某些问题，文章页并不能生成？我就需要 jekyll 的 debug 信息来找到那里有问题。   
搜索～～～   
命令：`jekyll --no-auto`可以看到详细的启动过程，有助于分析。可以看到 jekyll 运行那里出错了，这样我就找到了问题。   
是我转换的一片文章中一个url链接内容是一段js，转换过来后，作为网页的生成模板，就在 jekyll 的转换引擎中就出错了，修改后。就说有的页面都生成成功了。（运行 jekyll 中出一个错误，整个生成都会失败，比如你有100个文件，其中一个文件有问题，那么所有的内容都转换都不能生成，而不是转换到问题文件失败后，之前的转换能生成出页面）。

