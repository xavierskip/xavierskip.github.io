---
layout: post
title: 访问不了openai不用慌
tags:
- GFW
- nginx
---
![https://www.reddit.com/r/OpenAI/comments/zhmv9u/map_of_openai_unsupported_countries/](https://f.skip2.top/i/22b23828411d02e868dd89e50549c00f1099f9b6c5d1df485cca4cda5bb014b0.jpg)

目前，我处在的地区要访问 chat.openai.com 不仅被openai[限制](https://platform.openai.com/docs/supported-countries)，还被GFW给dns污染了。

真的是哎！

我还写了一个小工具专门用来观察dns被污染的情况，当然这个工具还不是很完善，也就将将能用。

当然这个轮子[dns-observe](https://github.com/xavierskip/dns-observe)是在chatGPT给我搭建的框架下完善的。

好了，我看总有人为怎么有访问不了chatGPT发愁。确实网页版的 chatGPT 被限制的确实很严重，再加上我不是付费用户，基本上提一次问再提一次就网络错误了，要刷新页面才能继续，太麻烦了，我就只使用api了，还好api对访问的IP限制不是那么严重。因为有地区限制直接是用不了的，再加上GFW的DNS污染，我决定给api做个反向代理就好了，简单容易理解，因为我实在是不能理解很多人讨论的利用 cloudflare worker 或者套 cloudflare WARP 之类的方案，搞不懂。

直接用nginx做个反向代理就好了

``` nginx.conf
server {
    server_name xxx.com;
    listen 443 ssl http2;
    ...
    other config 
    ...
    location /v1/ {
        proxy_pass https://api.openai.com/v1/;
        proxy_ssl_server_name on;
    }

```
就这么简单访问 https://xxx.com/v1/chat/completions 这个api好了。

其实在折腾这个的过程中还因为我服务器里的nginx常年不更新，那个把版本在http2协议的时候有个大[BUG](https://v2ex.com/t/300566)让我琢磨不着头脑了好长时间。


下面是两例因为代理的chatGPT服务被GFW dns污染的例子：
- [喜提被墙。防火墙是咋工作的？为啥把我的域名解析到 facebook 去了](https://v2ex.com/t/933552)
- [DNS 解析的 ip 地址乱变，是什么原因？](https://www.v2ex.com/t/933835)
