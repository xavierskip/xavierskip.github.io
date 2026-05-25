---
layout: post
title: 第二届北京大学信息安全综合能力竞赛
tags:
- CTF
- geekgame
---

是的又有一个CTF比赛可以参加了。([上一个比赛在此](/2022-11-06-hackgame/))。

[北京大学信息安全综合能力竞赛（PKU GeekGame）是以信息安全相关知识能力为主的入门向竞赛，比赛目的是普及网络与信息安全相关知识，并选拔部分优秀同学加入到北京大学 CTF 战队。 本届竞赛将继续追求题目新颖有趣、难度具有梯度，让没有相关经验的新生和具有一定专业基础的学生都能享受比赛，在学习的过程中有所收获。](https://geekgame.pku.edu.cn/)

是第一次参加 PKU 的 GeekGame。结果上来第一道签到题就给了我一个下马威，因为一般的CTF比赛的签到题都是个web题，有手就可过，没有什么弯弯绕，其实是起到统计真正参加比赛人数的作用。这次的签到题到最后只有600人通过了，与中科大的比赛签到题完成人数有近2700人比较，是参与人少了还是难度提高了呢？

一个星期的比赛结束了，我获得了总分545、总排名141的成绩。看的出来相比较中科大的比赛，参赛人数少多了，相应的难度也有所提高。

![成绩](https://f.xavierskip.com/i/eaf243e6da121f70c41e63a2d05168af597a37ec965798922a4eb499b525816e.png)

开始我看到每道题的完成情况，对自己有了深深的怀疑，没有信心呀，这些题我估计是一个都做不出来了。结果，还是凭借自己的努力还是做出来了几题，第二阶段给了更多的提示后，也搞定了一题。整个过程还是有一定的成就感的。

下面就记录一下我的解题过程：

# 签到

下载下来一个PDF文件，这是要干啥，我还煞有其事的把文件丢进[HxD](https://mh-nexus.de/en/hxd/)里观察一番，没有。一个签到题而已，还要怎么复杂呢？我观察到用edge浏览器打开pdf文件会显示“此文件具有受限权限。您可能无法访问某些功能。”是无法复制吗？在edge浏览器中确实无法复制（后来我发现只有edge浏览器实现了这样的限制，在chrome和Firefox中都没有限制复制），我找了一个可以解锁的网站给这个pdf解锁试试看，这时候发现文件下面那个高度怀疑是flag的那段文字无法单独复制出来，因为背景有其他文字干扰复制（其实可以不用鼠标选择访问，直接ctrl+a全选复制），我换到firefox中，可以正常的选择到那段异常的文字而不会受到背景下其他字符的干扰。结果复制出来的文字并不是，这只是签到题呀！要不要什么弯弯绕呀！这里我是把复制出来的粘贴到了浏览器地址栏中，格式中换行被吞了。

看起来是这样:`fa{iet_etUGeGmV! lgNc_oMe_@ekae2}`

其实复制到文本编辑器中应该是这样的：
```
fa{iet_etUGeGmV!
lgNc_oMe_@ekae2}
```

这下就很清楚的了，我是看到了提示：“第一届 PKU GeekGame [签到题的题解](https://github.com/PKU-GeekGame/geekgame-1st/tree/master/writeups/xmcp#%E7%AD%BE%E5%88%B0-signin)对解出本题可能有帮助”，我总算是搞明白了。

# 小北问答 · 极速版

这道题很有意思，是我有信心搞定的一道题。总共有八个问题，每次抽取其中7个问题，答对后每题14分，在一定时间内完成再加2分，也就是说7题全部答对，并且必须是用脚本才能在一定的时间内完成的即可拿到满分即第二个flag。这八道题是：

```
- 我刚刚在脑海中想了一个介于 9779562090 到 9779562360 之间的质数。猜猜它是多少？
# 其中的数字是在一个范围内宣传，就是说每次的答案是不一样的

- 支持 WebP 图片格式的最早 Firefox 版本是多少？
> 65
# https://hacks.mozilla.org/2019/01/firefox-65-webp-flexbox-inspector-new-tooling/

- 我有一个朋友在美国，他无线路由器的 MAC 地址是 d2:94:35:21:42:43。请问他所在地的邮编是多少？
# 这个？？？找不到呀！

- 访问网址 “http://ctf.世界一流大学.com” 时，向该主机发送的 HTTP 请求中 Host 请求头的值是什么？
> ctf.xn--4gqwbu44czhc7w9a66k.com
# 很简单，打开浏览器访问一下看看就知道了

- 视频 bilibili.com/video/BV1EV411s7vu 也可以通过 bilibili.com/video/av_____ 访问。下划线内应填什么数字？
> 418645518
# 网络上有工具 http://www.atoolbox.net/Tool.php?Id=910

- 每个 Android 软件都有唯一的包名。北京大学课外锻炼使用的最新版 PKU Runner 软件的包名是什么？
> cn.edu.pku.pkurunner
# 下载引用，解压，查看AndroidManifest.xml文件喽。

- 北京大学某实验室曾开发了一个叫 gStore 的数据库软件。最早描述该软件的论文的 DOI 编号是多少？
> 10.14778/2002974.2002976
# https://repository.hkust.edu.hk/ir/Record/1783.1-71588

- 在第一届 PKU GeekGame 比赛的题目《电子游戏概论》中，通过第 10 级关卡需要多少金钱？
# https://github.com/PKU-GeekGame/geekgame-1st/blob/master/src/pygame/game/server/libtreasure.py#L19
# 每次给出的等级是不一样的，但是找到了上届比赛的源码，很清楚，根据公式计算即可
# 300+int(level**1.5)*100

```

这八道题，其中有一道我做不出来，剩下的7道题中有一道询问质数的题有 1/8 的几率回答正确，所以你有一道题不会，仍然有 1/72 的几率解出题目。🤣😂😅

先看一下我怎么解决找到质数的题目吧，出题人给出的范围每次都不一样，这样每次都要重新找答案，不想其他的题目得到答案后每次都提交一样的。

我找到了一个可以下载质数的网站，[http://www.primos.mat.br/indexen.html](http://www.primos.mat.br/indexen.html) 将需要的质数下载下来，接下来只要在范围内找到即可。

``` python
def read_nums(filename):
    ''' 读取文件中讲所有的数字形成列表
    素数是按照大小顺序已经排序好的。
    '''
    l = []
    with open(filename,'r',encoding='utf-8') as f:
        for line in f:
            l.extend([int(x) for x in line.split()])
    return l

def binary_search(nums, n):
    ''' 二分查找
    https://www.zhihu.com/question/36132386/answer/530313852
    '''
    first = 0
    last = len(nums)
    while first < last:
        mid = first + (last - first) // 2
        if nums[mid] < n:
            first = mid + 1
        else:
            last = mid
    return first

def get_range(nums, index, end_n):
    '''
    找到符合范围条件的素数
    '''
    l = [nums[index]]
    while 1:
        index += 1
        n = nums[index]
        if n > end_n:
            break
        else:
            l.append(n)
    return l

def search_nums(nums, start, end):
    """
    返回符合条件的8个质数
    """
    start_index = binary_search(nums, start)
    return get_range(nums, start_index, end)

def main(start,end):
    nums = read_nums('p.txt')
    return search_nums(nums, start,end)

if __name__ == '__main__':
    print(main(9165693650, 9165693700))
```
接下来需要用程序来自动提交答案，题目提示说可以用 netcat 或者 pwntools 等带 socket 通信功能的库来连接，我试了一下发现不太会用 pwntools 工具，看着也不是很复杂就是直接用 socket 库来连接吧，期间还是遇到了一点困难，脚本也也得非常直接，达到目的就行。

``` python
import socket
import time
import re
import random
from prime import read_nums, search_nums

# 根据题目的前是个字符来选择答案
ans = {
    "支持 WebP 图片": '65',
    "访问网址 “http": 'ctf.xn--4gqwbu44czhc7w9a66k.com',
    "视频 bilibil": '418645518',
    "每个 Android": 'cn.edu.pku.pkurunner',
    "北京大学某实验室曾开": '10.14778/2002974.2002976',
    "在第一届 PKU G": '0',
    "我有一个朋友在美国，": lambda:random.choice([20103,20104,20146,20147,20149,20166]),  # 这个题不会呀！
    "在第一届 PKU G": lambda level: 300+int(level**1.5)*100
}

# 先把后面的要用素数都读取提起准备好，这样只用读一遍。
primes = read_nums('p.txt')
print("read nums ready!")

def range_nums(content):
    """ 得到素数题的范围
    """
    start,end =  list(map(int, re.findall(r'\d{10}', content)))
    return start,end

def wait_until(conn, size=1024):
    """ recv 直到问题内容结束
    """
    r = conn.recv(size).decode()
    while r[-2] != '>':
        r += conn.recv(size).decode()
    return r

def main():
    conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    conn.settimeout(5)
    conn.connect(('prob01.geekgame.pku.edu.cn',10001))

    # send token
    r = conn.recv(4096).decode()
    print(r)
    s = b'<your token is here!>\n'
    print(s)
    conn.send(s)

    # 开始答题
    r = conn.recv(4096).decode()
    print(r,end='')
    s = '急急急\n'
    print(s)
    conn.send(s.encode())

    i=0
    while i<7: # 每次7道题目
        r = wait_until(conn)
        print(r, end="")
        # print('repr:',repr(r[-5:]))

        if r.find("质数") == -1:
            index = r.index('题：')
            k = r[index+2:index+12]
            s = ans.get(k,'unknow!')
            if type(s) is not str:
                if k.startswith('在'):
                    # 关于电子游戏概论的题目
                    level = int(re.findall(r'\d+',r)[-1])
                    print('level', level)
                    s = s(level)
                else:
                    # 从MAC地址到邮编的题
                    s = s()
        else:
            # 是找素数的题
            nums = search_nums(primes, *range_nums(r))
            print(nums)
            s =  random.choice(nums)

        conn.send("{}\n".format(s).encode())
        print(s)
        time.sleep(0.1) # 重要！否则会影响整个流程正常的发送和接收。

        i+=1

    # 返回最后的得分结果
    r = conn.recv(1024).decode()
    while r.find('！') == -1:
        r += conn.recv(1024).decode()
    print(r)
    return r


if __name__ == '__main__':
    # 只有不停的试才能成功呀！
    while 1:
        result = main()
        # if input('y/n: ') != 'y':
        #     print("End.")
        #     break
        if result.find('你共获得了 100 分') != -1:
            print('GOAL!'*10)
            break
        time.sleep(8)  # 有连接频率限制

```
题库共有 8 道题，每次会选择其中的 7 道。其中询问质数的题有 1/8 的几率回答正确，被抽走的几率是 2/9；其余题目均有确定的正确答案，被抽走的几率是 1/9。因此，如果你有一道题不会，仍然有 1/72 的几率解出题目。

当看到结果的时候，泪流满面！！

![兴奋](https://f.xavierskip.com/i/f47957840d6685618b07d67dd5b7129769992ff18d2bf7cec6602449bf88a26c.jpg)


# 编原译理习题课

这题有三个flag，最终有210人部分通过，其实不难，前两个通过搜索就能完成，感觉是个送分题，结果只有210人部分通过，看来参加PKU的比赛确实没有USTC的多呀！

## 编译出的程序超过 8MB
[increase binary executable size](https://stackoverflow.com/questions/43520681/increase-binary-executable-size)

``` c
#include <stdio.h>
#define SIZE 100000000

char dummy[SIZE] = {'a'};

int main(void){
    dummy[SIZE-1] = '\n';
    if(dummy[0] == 'a')printf("Hello world");
    return 0;
}
```

## 输出的报错信息超过 2MB
[只用 30 行以内代码，C++ 最多可以产生多少行的编译错误信息？](https://www.zhihu.com/question/61427323)
`struct x struct z<x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(y,x(y><y*,x(y*w>v<y*,w,x{}`

其实我也不懂为啥，面对搜索引擎答题呗！

# Flag Checker

一个逆向java的题目，我居然解出来了。还好不是逆向C之类的，估计我就不行了。

题目提醒：JRE 版本高于 15 时可能无法运行此程序。建议使用 JRE 8 运行。解完题后来看来完全可以不运行这个程序，毕竟这个环境也有点老了。

我试了几个java逆向的工具 [JD-GUI](http://java-decompiler.github.io/)、[JADX](https://github.com/skylot/jadx)、[CFR](http://www.benf.org/other/cfr/)

发现CFR这个工具好用。直接的生成源代码文件里面的字符串不会错乱。

`java -jar cfr-0.152.jar prob15.jar > GeekGame.java`

很明显，第一个flag就在这里，先对flag进行base64编码再进行rot13替换，这两个都能很方便的逆向操作的。

``` java
    byte[] byArray = this.textField1.getText().getBytes("UTF-8");
    String string = GeekGame.rot13(Base64.getEncoder().encodeToString(byArray));
    if ("MzkuM8gmZJ6jZJHgnaMuqy4lMKM4".equals(string)) {
        JOptionPane.showMessageDialog(null, "Correct");
    } else {
        JOptionPane.showMessageDialog(null, "Wrong");
    }
```
要注意的是这里使用的rot13不是标准的rot13要稍微处理一下。不熟悉java可以用别的语言代替。

```python
import base64

def rot13(content):
    r = []
    for c in content:
        n = ord(c)
        if n >= ord('a') and n <= ord('m'):
            n += 13
        elif n >= ord('A') and n <= ord('M'):
            n += 13
        elif n >= ord('n') and n <= ord('z'):
            n -= 13
        elif n >= ord('N') and n <= ord('Z'):
            n -= 13
        elif n >= ord('5') and n <= ord('9'):
            n -= 5
        elif n >= ord('0') and n <= ord('4'):
            n += 5
        r.append(chr(n))
    return ''.join(r)
        
if __name__ == '__main__':
    result = base64.b64decode(rot13('MzkuM8gmZJ6jZJHgnaMuqy4lMKM4'))
    print(result)
```

第二个flag，直接把相关部分挖出来跑一下。

```java
class flag{  
    public static void main(String args[]){
        String string = "\u0089\u009a\u0081...太长就隐去了....\u00b2\u00c6\u0092";
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < string.length(); ++i) {
            stringBuilder.append((char)(string.charAt(i) ^ 0xEF));
        }
        System.out.println(stringBuilder.toString());
    }  
}
```
其实就是利用Java里的js引擎跑一段js

``` javascript
function checkflag2(_0xa83ex2){var _0x724b=['charCodeAt','map','','split','stringify','Correct','Wrong','j-'];return (JSON[_0x724b[4]](_0xa83ex2[_0x724b[3]](_0x724b[2])[_0x724b[1]](function(_0xa83ex3){return _0xa83ex3[_0x724b[0]](0)}))== JSON[_0x724b[4]]([0,15,16,17,30,105,16,31,16,67,3,33,5,60,4,106,6,41,0,1,67,3,16,4,6,33,232][_0x724b[1]](function(_0xa83ex3){return (checkflag2+ _0x724b[2])[_0x724b[0]](_0xa83ex3)}))?_0x724b[5]:_0x724b[6])}
```

稍加分析，flag2就是那个由那个列表表示的数据构成的，列表中记录的是组成flag的字符在上面这个函数中的位置。先将上面的代码在浏览器开发工具中运行，然后再运行下面的代码

```javascript
[0,15,16,17,30,105,16,31,16,67,3,33,5,60,4,106,6,41,0,1,67,3,16,4,6,33,232]['map'](function(e){return (checkflag2+ '')['charAt'](e)}).join('')
```


# 企鹅文档

有点意思，又不太难的题目，是在第二阶段提示下做出来的。这道题是利用腾讯文档来的，肯定不是利用腾讯文档的漏洞了，提示是一道流量分析题，应该是就是用浏览器的工具分析http请求。

首先打开文档页面，打开开发者工具记录网络请求，然后可以搜索单元格里的内容，比如"通过以下链接访问题目机密flag"可以看到相应的请求，是一个 opendoc 的api请求，响应里就能发现一些端倪，这些明白了，链接的整个url是一个字符一个单元格放在整个工作表里面的，因为某种原因被隐藏了，但是在请求中相应的内容被返回了，只是没有显示在界面上。需要注意的是整个工作表的内容不是一个请求就包括了的，你可以通过分别搜索A1和A73单元格的内容获取完整的内容，直接看相应内容就可以得到那个机密的flag链接了。

打开那个链接你能够下载到一个后缀名为har的请求记录文件，可以将这个文件直接拖到浏览器开发者工具网络页面来打开。根据提示flag就藏在这个页面里面，但是你想通过找到这个页面，发现此路不通的，这个页面已经被删除了。那么找到这个flag就只能把这个页面还原出来。

这个flag是在表单里用点阵的形式画出来的，我完全可以利用这些json信息把flag重新画出来，简单观察了一下表示腾讯文档单元格的数据格式，建了一个空白表格在里面试了一下数据是如何表示的，发现画出来不是个复杂的事情，写了个脚本就把flag画出来了！

```python
import json

def read_json_file(filename):
    with open(filename,'r') as f:
        json_flag = json.loads(f.read())
    return json_flag

def main():
    json_flag = read_json_file('flag.json')
    # print(json_flag)
    i = 0
    while i<2640:
        # 观察到那个表列项是A到K是11个。
        if (i+1) % 11 == 0:
            endchar = '\n'
        else:
            endchar = ''
        c = json_flag.get(str(i), ' ')
        if c == ' ':
            w = ' '
        else:
            w = '▉'
        print(w, end=endchar)
        i += 1

if __name__ == '__main__':
    main()

```
感觉有点酷
![flag](https://f.xavierskip.com/i/1b33d5b56578cac62f3a5538e937da293262353bdce7e3ed994379d451984363.jpg)


其他的题目可以去看官方[writeup](https://github.com/PKU-GeekGame/geekgame-2nd/tree/master/problemset)。