---
layout: post
title: 在 Django admin site 之外使用其日历控件
tags:
- django
- javascript
---

Django admin 是个非常方便的后台搭建工具，方便填写各类表单数据的控件都有，于是想在站点其他页面上也可以使用这些控件而不仅仅是 admin site 上。比如想在一个站点搜索页面的上使用日期选择控件，其实在html5 标准下 Chrome 浏览器会根据 input 标签 type 值准备好各种控件，但是对于很多其他浏览器来说并不自带各种方便的控件。所以为了浏览器的兼容性，我们需要引入第三方的控件。日历控件非常常见及常用，但是如果你已经在你的站点中启用了 Django admin，为什么不用一下 admin site 中的控件呢？

#### 版本环境：django 1.8.10

admin site 中的日历控件使用方法很简单

```html
<input type="text" class="vDateField">
<input type="text" class="vTimeField">
```
只要页面中的 input 的 class 属性为 vDateField 或者 vTimeField 即可，会自动在输入框后边添加上日历控件开关，这两个 class 属性一个选择是日期控件一个是选择时间控件（注意这里设置的 input type 为 text 和标准的 date 值不同）

接下来是载入控件所需要的资源

#### css 资源

```html{% raw %}
<link rel="stylesheet" type="text/css" href="{% static 'admin/css/base.css' %}" />
<link rel="stylesheet" type="text/css" href="{% static 'admin/css/forms.css' %}" />{% endraw %}
```

注意这些 css 资源包含了太多其它 admin site 中使用的 css 样式，请确保在你页面其它css资源前载入，否则会覆盖掉你页面中原先的样式。

#### js 资源

```html{% raw %}
<script src="/admin/jsi18n/"></script>
<script src="{% static 'admin/js/core.js' %}"></script>
<script src="{% static 'admin/js/jquery.init.both.js' %}"></script>
<script src="{% static 'admin/js/calendar.js' %}"></script>
<script src="{% static 'admin/js/admin/DateTimeShortcuts.js' %}"></script>
<script type="text/javascript">window.__admin_media_prefix__ = "{% filter escapejs %}{% static 'admin/' %}{% endfilter %}";</script>{% endraw %}
```
这个 jsi18n 是需要专门在 urls.py 设定的，如果不设置那么访问不了admin site 的用户就无法正常加载其资源了。

在你的 urls.py 中添加以下内容,确保 url 在你的 admin site 之前

```python
def i18n_javascript(request):
    return admin.site.i18n_javascript(request)
patterns = [
    ...
    url(r'^admin/jsi18n', i18n_javascript),
    url(r'^admin/', include(admin.site.urls))
]
```

django admin site 专门使用一套 jQuery 为了不会和其它 jQuery 干扰，使用方式与一般`$`开头不同，是`django.jQuery`。如果页面本身就已经引入了 jQuery，那么只需要在 jquery.init.js 上修改一下即可，否则请直接引入 admin site 的 jQuery 库。
	
``` html{% raw %}
<script src="{% static 'admin/js/jquery.js' %}"></script>
<script src="{% static 'admin/js/jquery.init.js' %}"></script>{% endraw %}
```

jquery.init.both.js

```javascript
var django = {
    "jQuery": jQuery.noConflict(true)
};
var jQuery = django.jQuery;
var $=jQuery;
```
	
最后一项`window.__admin_media_prefix__`如果不能正确设定，控件的图标将无法显示。设置是在`admin/base.html`中找到的，在`DateTimeShortcuts.js`中有描述

>Get admin_media_prefix by grabbing it off the window object. It's set in the admin/base.html template, so if it's not there, someone's overridden the template. In that case, we'll set a clearly-invalid value in the hopes that someone will examine HTTP requests and see it.


最后，使用时需要注意的是，这个控件使用的是字符型输入框，最后上传的日期格式为`2016/10/26`，而后端处理时的标准日期格式为`2016-10-26`，所以最后后端接收到数据后还需转换一下。

参考：[巧将Django Admin应用至前端部分
](https://imtx.me/archives/1454.html)

