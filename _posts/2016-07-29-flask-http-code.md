---
layout: post
title: 如何自定义Flask的HTTP状态码，例如451
tags:
- web
- flask
---
（以下的环境 Flask==0.11.1 Werkzeug==0.11.10）

在 stackoverflow 上看到一个问题，是问如何在 Flask 中用 abort函数触发自定义的错误。abort函数可以触发的错误可以通过字典 default_exceptions 来查看`from werkzeug.exceptions import default_exceptions`.

首先我们需要自定义一个错误，这个错误类继承于`werkzeug.exceptions.HTTPException`.我以 [451 Unavailable For Legal Reasons](https://en.wikipedia.org/wiki/HTTP_451) 这个状态码为例子。[RFC](https://tools.ietf.org/html/rfc7725)

abort其实是类`werkzeug.exceptions.Aborter`的实例,abort初始化的时候就需要 default_exceptions 这个变量，但是我不知道为什么在 Aborter.__init__ 中更新 default_exceptions 后，在 Flask._get_exc_class_and_code 中的 default_exceptions 依旧没变。所以我不使用 flask 提供的 abort ，而是先更新 default_exceptions 然后再调用`werkzeug.exceptions.Aborter`创建一个 abort。

(2016年7月30日更正：  
我重新看了一下 Aborter.__init__ 中的代码，之前太不仔细了，self.mapping 并不是直接引用的 default_exceptions, 而是利用 dict函数生成新的字典。

```python
class Aborter(object):
    def __init__(self, mapping=None, extra=None):
        if mapping is None:
            mapping = default_exceptions
        self.mapping = dict(mapping)
        if extra is not None:
            self.mapping.update(extra)

In [1]: d = {'a':123}
In [2]: c = dict(d)
In [3]: c
Out[3]: {'a': 123}
In [4]: c == d
Out[4]: True
In [5]: id(c) == id(d)
Out[5]: False
```
）

```python
from werkzeug.exceptions import HTTPException, default_exceptions,  Aborter
class UnavailableForLegalReasons(HTTPException):
    code = 451
    description = 'BIG BROTHER IS WATCHING YOU'

default_exceptions[451] = UnavailableForLegalReasons
abort = Aborter()  # don't from flask import abort

@app.errorhandler(451)
def uflr(e):
    return e, 451

@app.route('/debug')
def debug():
    abort(451)
```
然后你可以在浏览器中访问此路径，会得到 HTTP 状态码为 451 的响应了，可是你会发现响应头中的 reason phrase 是 UNKNOWN，你可以自行修改

![](http://i.stack.imgur.com/ipiYv.png)

```python
from werkzeug.http import HTTP_STATUS_CODES
HTTP_STATUS_CODES[451] = 'Unavailable For Legal Reasons'  # or even empty
```

效果如下

![](http://i.stack.imgur.com/zQdky.png)

在整个过程中 pycharm 提供了很大的方便，使用 Quick Definition  功能（快捷键为 command+Y）可以很方便的在各种函数变量及对象中转跳，寻找来源，对阅读源码来说非常方便。

我在 stackoverflow 上的回答
[Flask - How to create custom abort() code?](http://stackoverflow.com/a/38648607/1265727)

参考：

- [flask.Flask.errorhandler](http://flask.pocoo.org/docs/0.11/api/#flask.Flask.errorhandler)
- [Custom Error Pages](http://flask.pocoo.org/docs/0.11/patterns/errorpages/)


