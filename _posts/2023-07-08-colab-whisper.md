---
layout: post
title: 通过colab来使用whisper将语音转换为文字
tags:
- AI
- whisper
- colab
---

最近学习了下如何使用 [whisper](https://github.com/openai/whisper), 这个玩意有点意思！能在本地电脑上就可以很好的对语音进行识别了，软件里的 large 模型需要10G左右的显存，可是我的显卡只有 8G，也就只能用用 medium 模型，但是我发现 Google 的 [Colab](https://colab.research.google.com) 可以免费使用，而且带有 15G 显存的 [NVIDIA T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/)，这还不白嫖一下啊！学着用了用 google Colab。

可以直接用我写好的 [colab 文件](https://colab.research.google.com/drive/1v0TYNrDETMgeGsRaLq-zp5QOyWEr_9bS?usp=sharing)。

我给使用过程分了几个部分。

#### 1、🏗️安装 Whisper 及其依赖

colab 上很多依赖项已经安装好了，你只需要安装 whisper 就可以了，torch 也可以直接用。如果你想要安装最新的 whisper 你需要 `pip install git+https://github.com/openai/whisper.git` 。

#### 2、🧠Whisper 模型载入

单独作为一个部分是，模型在载入过程中只能载入一次，否则会重复载入导致爆显存导致错误。我不知道该如何解决，这里有讨论[https://github.com/openai/whisper/discussions/1306](https://github.com/openai/whisper/discussions/1306)，但是我不知道如何解决？

#### 3、🎶(可选)从网络上下载音频文件

你可以选择从网络上下载音频文件，有可以手动上传文件到机器上。

#### 4、🎶上传音频文件及参数设置

手动上传文件到机器上，选择文件名、音译还翻译、语言等参数，要想识别出来的是简体文字可以指定`prompt`，[指定 Whisper 输出为简体中文](https://wulu.zone/posts/whisper-cn)。

#### 5、🚀运行

just run it!

等待！

#### 6、💾 写入文件

将结果写入到文件，可以是txt、json等文件，也可以是srt这种字幕格式文件。


**最后**

如果你觉得 openai-whisper 速度还是有点慢，你还可以看看下面的内容。

- [Port of OpenAI's Whisper model in C/C++](https://github.com/ggerganov/whisper.cpp)
- [Making OpenAI Whisper faster](https://nikolas.blog/making-openai-whisper-faster/)
- [Faster Whisper transcription with CTranslate2](https://github.com/guillaumekln/faster-whisper)