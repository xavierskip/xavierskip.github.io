---
layout: post
title: 安装的chrome浏览器扩展被停用了吗？
tags:
 - chrome
 - google
---

### 139 版本已失效办法 🧨

虽然之前就知道基于 Manifest V2 的浏览器扩展程序要被停用，但是可以手动启用，可是升级到版本`138.0.7204.158`后手动也无法启用了。

![chrome://extensions-internals/](https://f.xavierskip.com/i/c8b1b3bb3d5aeb67757a0510619cdea865d552f418bcf135ee48a108a0abf675.jpg)

可是你Google自己的扩展也没达到要求呀。

Windows系统下可通过操作注册表调整政策来继续使用 Manifest V2 的浏览器扩展。

1. 开始菜单中输入`regedit`打开 注册表编辑器
2. 在注册表编辑器中打开：`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\`路径
3. 右键单击`Policies`
    - 新建项
    - 命名为`Google`
4. 右键单击`Google`
    - 新建项
    - 命名为`Chrome`
5. 右键单击`Chrome`
    - 新建`DWORD32 位值`
    - 命名为`ExtensionManifestV2Availability`
6. 右键单击`ExtensionManifestV2Availability`
	- 将键值修改为`2`
    - 左键单击`确定`按钮
    ![注册表](https://f.xavierskip.com/i/442bbca7fe22f3d232ff770dd3f72d4b18f3a91ad6854078341d25ddd8024181.jpg)   
7. 在 Chrome 中打开`chrome://policy/`
    - 点击 【重新加载政策】按钮
    - 看到 Chrome Policies 项目出现[ExtensionManifestV2Availability](https://chromeenterprise.google/policies/?policy=ExtensionManifestV2Availability "详细了解“ExtensionManifestV2Availability”政策")政策即可。

_Major_ props to all of the people who figured this out - I hope you're as lucky as I am and that this works for you. If it doesn't, I have no real knowledge about any of this, and my canned response to any questions is "Google it".Good luck![^1]

[^1]:[(GUIDE) how to keep using ublock origin even after removal from Chrome web store](https://www.reddit.com/r/chrome/comments/1ix04u4/comment/mfu1hk4/)

### 139 版本可用办法 🎯

打开 `chrome://flags/`

找到并修改
```
chrome://flags/#temporary-unexpire-flags-m137
chrome://flags/#temporary-unexpire-flags-m138
```
为 `Enable`。

重启浏览器。

找到并修改
```
chrome://flags/#extension-manifest-v2-deprecation-warning
chrome://flags/#extension-manifest-v2-deprecation-disabled
chrome://flags/#extension-manifest-v2-deprecation-unsupported
```
为 `Enable`。

将`chrome://flags/#allow-legacy-mv2-extensions`设置为`Enabled`。

重启浏览器即可。

### 未来失效怎么办🔮 

如果实在解决不了，换浏览器吧。[Edge](https://www.microsoft.com/zh-cn/edge/download) 或者 [Firefox](https://www.firefox.com/) 都可以

#### 扩展失效后设置未导出怎么办？

在 chrome 的启动项里加入下面的参数，启动 chrome 就可以启动失效的扩展了。[via](https://github.com/violentmonkey/violentmonkey/issues/1934#issuecomment-3263239554)

`--disable-features=ExtensionManifestV2Unsupported,ExtensionManifestV2Disabled`

相关内容：
- [[方法分享]Chrome 138 继续使用Manifest V2 扩展](https://meta.appinn.net/t/topic/73073/)
- [Chrome 138.0.7204.101 的解决方案](https://github.com/Kenshin/simpread/discussions/6633#discussioncomment-13741609)
- [Tutorial on how to Enable Manifest V2 extensions for another year (until June 2025) such as Ublock Origin on Windows using the registry editor (regedit)](https://www.reddit.com/r/chrome/comments/1d799pa/tutorial_on_how_to_enable_manifest_v2_extensions/)
- [Chrome 138启用manifest V2](https://linux.do/t/topic/804079)

