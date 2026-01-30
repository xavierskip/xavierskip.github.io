---
layout: page
title: 博友圈
comments: false
---

下面将加载我订阅的部分博客及其最近文章。

<script>
(function() {
  const hash = window.location.hash.slice(1);
  const page = ['blogs', 'posts'].includes(hash) ? hash : 'posts';
  
  const script = document.createElement('script');
  script.id = 'bfc-app';
  script.dataset.categoryId = '27';
  script.dataset.page = page;  // 在创建时就设置正确的值
  script.dataset.style = 'width:100%;border:none;color-scheme:light;min-height:150px';
  script.async = true;
  script.src = 'https://bfc.xavierskip.com/app.js';
  
  // 插入到当前脚本后面
  document.currentScript.parentNode.insertBefore(script, document.currentScript.nextSibling);
})();
</script>