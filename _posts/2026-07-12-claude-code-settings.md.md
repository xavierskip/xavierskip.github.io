---
layout: post
title: 使用 Claude code 的必配项目
tags:
 - claude
 - ai
 - software
---

你可能会说你怎么还在用 Anthropic 公司的产品呢？A\ 不是搞“XXX与狗不得入内”那一套的吗？好把，如果是你遵守用户协议在先，然后被封了号，我支持你。如果不是，你应该问的是人家有没有逼你用？

行，你也可以来反问我，人家也不欢迎你，你不也违反用户协议去用的吗？你说的没错。但是出门在外，身份都是自己给的，更何况上网冲浪呢？如果你真的爱惜自己的身份，你都不该出现在这里。如果我的号被封了，我不会抱怨。举一个不一定恰当但是更容易明白的例子，网上铺天盖地的曝光理想车主的乱停车乱开车的行为，被网友一致嘲讽，假如你是理想车主，并且你平时都是守规矩地开车，你会觉得自己被嘲讽了吗？不会吧。如果你自己觉得被嘲讽到了，那我只能觉得你也是乱停车乱开车的一份子。

我看不起的是那些这几天到处宣扬 Anthropic 是恶魔，过几天 Claude 新模型发布了又开始宣传使用感受、教程之类的，看不起的是这种人。

从很早就开始用 Claude 了，那个时候 openAI 的 ChatGPT 发布没多久，引起轰动服务也不稳定，常常免费配额不够或者服务故障无法使用，寻找替代品就转头用上了 Claude，遵循着哪个能用用哪个。就一直用到了现在，**没被封号过，但是也没有充过值**。其实我可以尝试买苹果商店充值卡来充值订阅使用的，主要是因为贵，其次是被大量的封号案例所吓到了。**以前搞独立开发只是赚不到钱而已，现在搞开发去充值AI工具成了倒贴、亏钱了**。

所以我选择充值那些便宜的 AI API，作为第三方 API 在 Claude code 里使用。你说，Claude Code 软件里有木马后门，有严重的安全隐患，不是，你都用上 AI agent了，都有工具调用和执行的功能，哪个 AI agent 不这样吧（我有安装 codex，其会向我的 chrome 浏览器用户目录下读写文件，可能是用来和 chrome 交互的工具，但是我不确定）。如果你说的是这个 ”[Anthropic embedded spyware in Claude Code — and attempted to hide it from you](https://www.reddit.com/r/ClaudeAI/comments/1ujila1/anthropic_embedded_spyware_in_claude_code_and/)“，这可不是什么后门只不过是一种隐形遥测，其实就是判断你的时区和你使用中转站信息”隐写“到系统提示词日期的部分中，相当一种于数字水印吧，如果你的第三方API是 claude 中转站，那么就会传到 claude 的服务器上，这样可能作为 Claude 封锁你账号的依据吧!?

不知道为什么[工业和信息化部网络安全威胁和漏洞信息共享平台上的公告](https://nvdb.org.cn/publicAnnouncement/2074681830578630657)又没了？以前的公示公告还在，目前来看最近的一条是[苹果公司紧急提醒iPhone用户立即更新以防范网页攻击](https://nvdb.org.cn/publicAnnouncement/2044354178378743809)

跑题了，回到正题。使用 Claude code 最应该配置的一项功能是什么？我认为是等待 AI 思考回答完毕或者工作结束的通知，也就是说你需要一个外挂？窗口？控件？状态栏？能够了解 AI agent 工具实时状态的东西，确实有很多工具是来实现这个需求的，但我想最简单的就是实现一个弹窗通知就可以了，其实[配置一下 Claude code 配置文件里的 hooks ](https://code.claude.com/docs/en/hooks-guide#get-notified-when-claude-needs-input)就好了。

你的 settings.json 配置文件

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "pwsh -NoProfile -File ~/.claude/notify.ps1 -Title  'claude code 已回应!'",
            "async": true
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "pwsh -NoProfile -File ~/.claude/notify.ps1 -Title  'claude code 需要你!'",
            "async": true
          }
        ]
      }
    ]
  }
}
```


参考 [hooks 文档](https://code.claude.com/docs/en/hooks#hook-lifecycle)，需要 hooks 的是 [Notification](https://code.claude.com/docs/zh-CN/hooks#notification) 和 [Stop](https://code.claude.com/docs/zh-CN/hooks#stop) 这两个 Event，简单点说，Notification 在需要您批准工具使用的时候触发，以及，Stop 在完成完成响应时触发。

通过下面的 powershell 脚本给 windows10 发送弹窗通知。

```powershell
# notify-toast.ps1
# 使用 Windows 10 原生 Toast 通知中心
# 首次使用前需要安装模块（只需装一次）：
#   Install-Module -Name BurntToast -Scope CurrentUser
#
# 从 stdin 读取 Claude Code 传入的事件 JSON，自动提取有用信息作为通知正文。
# 如果解析失败或字段缺失，退回到 -Title / -Message 参数或默认文案。

param(
    [string]$Title = "Claude Code",
    [string]$Message = ""
)

if (-not (Get-Module -ListAvailable -Name BurntToast)) {
    Write-Warning "BurntToast 模块未安装，请先执行: Install-Module -Name BurntToast -Scope CurrentUser"
    exit 1
}
Import-Module BurntToast

# 读取 Claude Code 通过 stdin 传入的 JSON（如果有的话）
# 注意：不能用 [Console]::In.ReadToEnd()，它会按系统代码页(如中文 Windows 的 GBK)
# 解码字节流，而 Claude Code 传入的是 UTF-8 JSON，中文内容会被解码成乱码。
# 这里显式用 UTF8 StreamReader 读取原始输入流，绕开系统代码页设置。
$stdinRaw = $null
if ([Console]::IsInputRedirected) {
    try {
        $stdinStream = [Console]::OpenStandardInput()
        $reader = New-Object System.IO.StreamReader($stdinStream, [System.Text.Encoding]::UTF8)
        $stdinRaw = $reader.ReadToEnd()
    } catch {}
}

$body = $Message

if ($stdinRaw) {
    try {
        $json = $stdinRaw | ConvertFrom-Json -ErrorAction Stop
        switch ($json.hook_event_name) {
            "Notification" {
                if ($json.message) { $body = $json.message }
            }
            "Stop" {
                if ($json.last_assistant_message) {
                    # 只取前 120 字符，避免 Toast 正文过长
                    $text = $json.last_assistant_message -replace "`n", " "
                    if ($text.Length -gt 120) { $text = $text.Substring(0, 120) + "..." }
                    $body = $text
                }
            }
        }
    } catch {
        # JSON 解析失败就静默忽略，使用默认/参数文案
    }
}

if (-not $body) { $body = "Attention is all your need!" }

New-BurntToastNotification -Text $Title, $body
# -AppLogo '~\.claude\claude.png'
# 或者你可以替换默认通知logo图片
# https://github.com/Windos/BurntToast/blob/main/Help/New-BurntToastNotification.md
```


如果你想自定义你的状态栏，可以直接照抄[官方文档里的例子](https://code.claude.com/docs/zh-CN/statusline#display-multiple-lines)，选择 node.js 的那个脚本就行。
