---
layout: page
title: 博友圈
comments: false
---

下面将加载我订阅的部分博客及其最近文章。

<script>
(function() {
  const hash = window.location.hash.slice(1);
  const page = ['blogs', 'posts'].includes(hash) ? hash : null;
  
  if (page) {
    const bfcScript = document.getElementById('bfc-app');
    if (bfcScript) {
      bfcScript.dataset.page = page;
    }
  }
})();
</script>
<script id="bfc-app" data-category-id="27" data-page="posts" data-style="width:100%;border:none;color-scheme:light;min-height:150px" async src="https://bfc.xavierskip.com/app.js"></script>
