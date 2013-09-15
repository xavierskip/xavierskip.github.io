---
layout: post
excerpt: python pythongame
title: 「翻译」介绍 pygame的 camera模块
tags:
- python
- pythongame
---
<h4>Pygame Tutorials</h6>
<h2>Camera Module Introduction</h3>
<h3>by Nirav Patel</h4>
<h4>nrp@eclecti.cc</h6>
<h4>Revision 1.0, May 25th, 2009</h5>
原文:[http://www.pygame.org/docs/tut/camera/CameraIntro.html](http://www.pygame.org/docs/tut/camera/CameraIntro.html)

感谢这个翻译插件[A+ Dictionary](https://chrome.google.com/webstore/detail/a%20-dictionary/nbdnlnijofenjgknplpelkpmhikpangb) 从此妈妈再也不用担心我的英语学习了！！

tips：看本文之前一定要安装pygame哟！`sudo apt-get install python-pygame`


Pygame 1.9开始已经提供了对摄像头的支持，允许你抓取静止的图片，观看实时的画面，和一些简(chou)单(lou)的电脑特效。这个教程将会包含以上功能的用法，并提供简单的代码供做参考。你也可以参考[pygame.camera](http://www.pygame.org/docs/ref/camera.html)的文档查看详细的API。

提示：作为Pygame1.9，camera模块支持linux上使用[v4l2](https://www.google.com.hk/search?&q=v4l2+)的摄像头。其他平台可以使用 Videocapture（win） 或者 Opencv（Opencv麻烦是麻烦，可是实在很强大！），本教程的重点在本地模块。大部分的代码可以在其他平台是使用，不过某些类似控制的操作也许不能正常工作。本模块依旧是实验性的，意味着在后续的版本中API可能会发生变动。

#引入和初始化

    import pygame
    import pygame.camera
    from pygame.locals import *

    pygame.init()
    pygame.camera.init()

摄像头模块是可选的。需要被引入和手动初始化。如上

#抓取一张图片

现在，我们来在最简单的情况下打开摄像头并且从中抓取一帧图片。在接下来的例子中，我们假设在你的电脑中摄像头叫做'/dev/video0',我们将摄像头视频的大小设置为宽640高480.我们用 get_image()来抓取图像。

    cam = pygame.camera.Camera("/dev/video0",(640,480))
    cam.start()
    image = cam.get_image()

#列出连接的摄像头
如果我们不能确定摄像头的真实路径？我们就可以使用 list_cameras()列出摄像头的列表，选取其中我们需要使用的那个（如果你有多个摄像头的话）

    camlist = pygame.camera.list_cameras()
    if camlist:
        cam = pygame.caemra.Camera(camlist[0],(640,480))

#控制摄像头
大多数摄像头提供像翻转图像和调整亮度的功能。set_controls() 和 get_controls() 要在 start() 后使用。

    cam.set_controls(hflip = True, vflip = False)
    # set_controls(hflip = bool, vflip = bool, brightness)
    print camera.get_controls()

#实时画面
本教程接下就开始可以看到实时画面了。
过程很简单，就是不停的从摄像头中获取视频帧然后绘制在屏幕上，有效的显示实时画面。基本上你期望也是这样吧。不停的 get_image(),然后显示，刷新，循环。因为性能的原因，我们使用每次都使用同样的显示画面。

{% highlight python %}
class Capture(object):
    def __init__(self):
        self.size = (640,480)
        # 创造一个显示画面，标准的 pygame 显示画面
        self.display = pygame.display.set_mode(self.size, 0)
        
        # 就像我们上面做过的一样
        self.clist = pygame.camera.list_cameras()
        if not self.clist:
            raise ValueError("Sorry, no cameras detected.")
        self.cam = pygame.camera.Camera(self.clist[0], self.size)
        self.cam.start()

        # create a surface to capture to.  for performance purposes
        # 因为性能的原因，我们创造一个表面，和之前生成的显示画面是一样的位深度。
        self.snapshot = pygame.surface.Surface(self.size, 0, self.display)

    def get_and_flip(self):
        # 如果你不需要和摄像头的频率保持一致，可以不用检查。 
        if self.cam.query_image(): #大多数摄像头永远也不返回True
            # 如果摄像头的画面准备好了，捕捉
            self.snapshot = self.cam.get_image(self.snapshot)
        # 刷新显示的画面
        self.display.blit(self.snapshot, (0,0))
        pygame.display.flip()

    def main(self):
        going = True
        while going:
            events = pygame.event.get()
            for e in events:
                if e.type == QUIT or (e.type == KEYDOWN and e.key == K_ESCAPE):
                    # 安全的退出摄像头
                    self.cam.stop()
                    going = False

            self.get_and_flip()
{% endhighlight %}

因为get_image()是一个阻塞的动作，也许会在差摄像头上花费跟多的时间，所以我们用 query_image()来确定摄像头是否准备好。同时可以让显示画面的帧率和摄像头的帧率分开来，并能够保障在一个单独的线程中抓取摄像头中的图像.当然如果你的摄像头支持 query_image()操作的话，这样可以有更好的性能保障。

#基本的显示效果
Pygame 可以做一些基本的视觉效果（滤镜），变形，遮罩……

#色彩空间
当你初始化摄像头的时候，有一个色彩空间的可选常数，有 'RGB', 'YUV', 和 'HSV'。在计算机视觉中 YUV 和 HSV 通常来说比 RGB 更有用。降低了颜色的阀值。
`self.cam = pygame.camera.Camera(self.clist[0], self.size, "RGB")`
![](http://www.pygame.org/docs/tut/camera/rgb.jpg)
`self.cam = pygame.camera.Camera(self.clist[0], self.size, "YUV")`
![](http://www.pygame.org/docs/tut/camera/yuv.jpg)
`self.cam = pygame.camera.Camera(self.clist[0], self.size, "HSV")`
![](http://www.pygame.org/docs/tut/camera/hsv.jpg)


#阈值
在变换模块中使用threshold()我们可做出来像下面的绿屏效果，在特定的场景中分离出特定的颜色。在接下来的例子中，我们分离出绿色的树，剩下的全部变黑。详细的使用方法看[threshold function])(http://www.pygame.org/docs/ref/transform.html#pygame.transform.threshold)

    self.thresholded = pygame.surface.Surface(self.size, 0, self.display)
    self.snapshot = self.cam.get_image(self.snapshot)
    pygame.transform.threshold(self.thresholded,self.snapshot,(0,255,0),(90,170,170),(0,0,0),2)
![](http://www.pygame.org/docs/tut/camera/thresholded.jpg)

不过这只能用来寻找你知道准确颜色的对象。为了能够在现实的环境下方便的使用，我们增加一个校验机制来对对象的颜色进行辨认，并以此作为阀值。对此我们需要使用 average_color()这个方法。

下面的例子就是在方框中取得颜色，然后将此颜色作为其中的常数在 threshold()方法中使用。Note:<b>这一部分我们都使用的是 HSV 色彩空间。</b>

    def calibrate(self):
        # capture the image
        self.snapshot = self.cam.get_image(self.snapshot)
        # blit it to the display surface
        self.display.blit(self.snapshot, (0,0))
        # make a rect in the middle of the screen
        crect = pygame.draw.rect(self.display, (255,0,0), (145,105,30,30), 4)
        # get the average color of the area inside the rect
        self.ccolor = pygame.transform.average_color(self.snapshot, crect)
        # fill the upper left corner with that color
        self.display.fill(self.ccolor, (0,0,50,50))
        pygame.display.flip()

![](http://www.pygame.org/docs/tut/camera/average.jpg)
`pygame.transform.threshold(self.thresholded,self.snapshot,self.ccolor,(30,30,30),(0,0,0),2)`
![](http://www.pygame.org/docs/tut/camera/thresh.jpg)

我们可以同样的来做一个绿/蓝色屏幕，首先我们得到背景颜色，然后将背景色替换为绿色，其他不是背景的为黑色。
![](http://www.pygame.org/docs/tut/camera/background.jpg)
这是相机对准空白的墙壁。

    def calibrate(self):
        # capture a bunch of background images
        bg = []
        for i in range(0,5):
          bg.append(self.cam.get_image(self.background))
        # average them down to one to get rid of some noise
        pygame.transform.average_surfaces(bg,self.background)
        # blit it to the display surface
        self.display.blit(self.background, (0,0))
        pygame.display.flip()

![](http://www.pygame.org/docs/tut/camera/green.jpg)
`pygame.transform.threshold(self.thresholded,self.snapshot,(0,255,0),(30,30,30),(0,0,0),1,self.background)`

#使用遮罩模块
这个玩意你可以用来显示图像，使用这个模块你也可以使用摄像头作为游戏的输入。上个例子，我们使用阈值分离出了特定的对象，现在，我们来找到这个对象的位置，然后使用它来控制屏幕上的小球。

    def get_and_flip(self):
        self.snapshot = self.cam.get_image(self.snapshot)
        # threshold against the color we got before
        mask = pygame.mask.from_threshold(self.snapshot, self.ccolor, (30, 30, 30))
        self.display.blit(self.snapshot,(0,0))
        # keep only the largest blob of that color
        connected = mask.connected_component()
        # make sure the blob is big enough that it isn't just noise
        if mask.count() > 100:
            # find the center of the blob
            coord = mask.centroid()
            # draw a circle with size variable on the size of the blob
            pygame.draw.circle(self.display, (0,255,0), coord, max(min(50,mask.count()/400),5))
        pygame.display.flip()

![](http://www.pygame.org/docs/tut/camera/mask.jpg)

这只是些基本的例子。你还可以跟踪不同颜色的斑点，描绘物体的轮廓，现实世界和游戏世界中的物体碰撞检测。得到一个物体的角度，然后精确的控制它。

more and have fun!

<script src="https://gist.github.com/xavierskip/6568747.js"></script>
