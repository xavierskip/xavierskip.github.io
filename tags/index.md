---
title: tags
layout: page
---

<div id='tag_cloud'>
{% for tag in site.tags %}
<a href="#{{ tag[0] }}" title="{{ tag[0] }}" rel="{{ tag[1].size }}">{{ tag[0] }}</a>
{% endfor %}
</div>

<ul class="listing">
{% for tag in site.tags %}
  <li class="listing-seperator" id="{{ tag[0] }}">{{ tag[0] }}</li>
{% for post in tag[1] %}
  <li class="listing-item">
  <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
{% endfor %}
</ul>

<script defer src="/media/js/jquery.tagcloud.js"></script>
<script>
const dark = window.matchMedia('(prefers-color-scheme: dark)');
if(dark.matches){
  const start = '#f8e0e6';
  const end   = '#ff3333';
}else{
  const start = '#9cffa1';
  const end   = '#00ff0c';
}
// config and run
$.fn.tagcloud.defaults = {
    size: {start: 10, end: 24, unit: "pt"},
      color: {start: start, end: end}
};
$('#tag_cloud a').tagcloud();
</script>