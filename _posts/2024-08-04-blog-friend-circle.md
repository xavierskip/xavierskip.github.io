---
layout: post
title: 博友圈从何而来
tags:
 - blog
 - css
---

相信眼尖的观众已经发现此博客多了个[博友圈](https://blog.xavierskip.com/blog-friend-circle/)的玩意。

缘起，前段时间看到了有个博客使用的这样的一个东西：[重构博客友链页面 & 友链朋友圈开源](https://prin.pw/building-blog-friend-circle/)。

传统上，博主之间会相互交换各自博客的链接，因为独立博客就像一个个信息孤岛，很难拥有流量，所以通过 URL 链接作为博客之间的纽带，给访客看也是给各大搜索引擎的 bot 看。这种原始的做法在如今是否还有用，有多少效果，其实我也不知道，所以称之为“传统”。

但是在这个时间节点还坚持写博客、装修博客的人谁还在乎这个呢？看起来 cool 😎 就好了。

所以我也部署了一个。

不同于以往，干巴巴的 URL 链接加上少量的文字介绍就组成了友链，这个工具还以列表的形式展示友博的文章，就像一个聚合的信息流一样，也像社交网络中那样展示各个博客的最新文章。

对的，这并不是一个新东西，这就是一个 RSS 阅读器实现的功能。

所以实现这个博友圈的工具就来自于 RSS 阅读器。

部署上述工具需要两个要求：

1. 你需要 [Miniflux](https://miniflux.app/) 这个 RSS 阅读器来提供 api 服务
2. 你需要 [Cloudflare Workers](https://www.cloudflare.com/) 来部署程序

抓取博客文章写一个小爬虫不是难事，但是有了现成的 RSS 阅读器，为什么不使用呢。

作为一个静态博客是没有任何程序功能的，动态内容的提供必然是交给第三方，所以 Cloudflare Workers 无疑是个省心的选择。

如果你有使用 Miniflux 这款 RSS 阅读器，并且会使用 Cloudflare Workers，那么就可以开始部署了。

```bash
# 很简单，先 clone 到本地
git clone https://github.com/prinsss/blog-friend-circle.git
# 安装依赖（推荐使用 Node.js 20+），如果有错误发生，使用`npm doctor`检查一下。
npm install
# 修改配置文件，填入你的 Miniflux API Endpoint、API Token
cp wrangler.example.toml wrangler.toml
# 创建一个 KV namespace 并填入 ID 至 wrangler.toml
# 在这一步你可能会遇到关于`"id" field`的错误，你先随便给配置文件里的"id"设置一个值，等生成了正确的值再将其填入
npx wrangler kv:namespace create API_CACHE_KV
# 部署到 Cloudflare Workers
npm run deploy
```

最后将得到的访问地址，以如下脚本的形式增加到博客页面中。

```html
<!-- Category ID 填写你在 Miniflux 中创建的分类 ID（点进分类页面后，地址栏中的数字即为 ID） -->
<script data-category-id="11" async src="https://circle.example.workers.dev/app.js"></script>
```

会在你的博客页面插入一个`<iframe>`并加载其内容，大功告成。

但是这其中也遇到了几点问题。

1、在创建 kv 之前，模板配置文件中的 id 不能为空，先随便设置为任何值，才能成功执行`npx wrangler kv:namespace create API_CACHE_KV`[^1]

2、由于友圈在设计上会根据系统主题来调整配色，但是我的博客页面未根据系统深浅主题色来做任何适配，导致在系统深色配色的情况下，我的博客页面和友圈文字同为浅色，导致难以阅读[^2]，我尝试通过添加`color-scheme`[^3]来固定颜色方案，却发现只有 Firefox 浏览器支持从父级继承的颜色方案[^4]。

一开始我也被 css 属性`color-scheme` 和 `prefers-color-scheme` 媒体查询搞的晕头转向。

`color-scheme`用来设定元素采用的配色，元素样式由浏览器深、浅色模式提供的的默认样式决定。

`prefers-color-scheme`根据系统采用的深浅模式来决定采用的css样式。

也就是说你给整个 html 页面通过 `color-scheme` 设定为暗色模式，并不会让`@media (prefers-color-scheme: dark)` 生效，想要让`@media (prefers-color-scheme: dark)`生效需要将系统设定成暗色模式，而不是某个html元素的`color-scheme`。

有疑问的可以自己亲手尝试一下：[https://codepen.io/sulkmascot/pen/abgwpOP](https://codepen.io/sulkmascot/pen/abgwpOP)

>切换整个操作系统的配色方案可能会让人厌烦，但是 chrome 开发者工具允许你以仅影响当前显示的标签页的方式模拟用户的首选配色方案。F12 打开开发者工具，ctrl + shift + p 运行命令，输入“渲染”，选择“显示渲染工具”。你就可以在其中更改`模拟CSS媒体功能 prefers-color-scheme`。

推荐阅读：

- [Improved dark mode default styling with the color-scheme CSS property and the corresponding meta tag](https://web.dev/articles/color-scheme)
- [prefers-color-scheme: Hello darkness, my old friend](https://web.dev/articles/prefers-color-scheme)

[^1]: [/prinsss/blog-friend-circle/issues/3](https://github.com/prinsss/blog-friend-circle/issues/3)
[^2]: [/prinsss/blog-friend-circle/issues/4](https://github.com/prinsss/blog-friend-circle/issues/4)
[^3]: [color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color-scheme)
[^4]: [Respects `color-scheme` inherited from parent](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)
