---
layout: post
excerpt: python pythongame
title: 「翻译」介绍 pygame的 camera模块
tags:
- python
- pythongame
---
##### Pygame Tutorials

### Camera Module Introduction

##### by Nirav Patel

##### nrp@eclecti.cc

##### Revision 1.0, May 25th, 2009

原文:[http://www.pygame.org/docs/tut/camera/CameraIntro.html](http://www.pygame.org/docs/tut/camera/CameraIntro.html)

感谢这个翻译插件[A+ Dictionary](https://chrome.google.com/webstore/detail/a%20-dictionary/nbdnlnijofenjgknplpelkpmhikpangb) 从此妈妈再也不用担心我的英语学习了！！

tips：看本文之前一定要安装pygame哟！`sudo apt-get install python-pygame`


Pygame 1.9开始已经提供了对摄像头的支持，允许你抓取静止的图片，观看实时的画面，和一些简(chou)单(lou)的电脑特效。这个教程将会包含以上功能的用法，并提供简单的代码供做参考。你也可以参考[pygame.camera](http://www.pygame.org/docs/ref/camera.html)的文档查看详细的API。

提示：作为Pygame1.9，camera模块支持linux上使用[v4l2](https://www.google.com.hk/search?&q=v4l2+)的摄像头。其他平台可以使用 Videocapture（win） 或者 Opencv（Opencv麻烦是麻烦，可是实在很强大！），本教程的重点在本地模块。大部分的代码可以在其他平台是使用，不过某些类似控制的操作也许不能正常工作。本模块依旧是实验性的，意味着在后续的版本中API可能会发生变动。

#引入和初始化
{% highlight python %}
import pygame
import pygame.camera
from pygame.locals import *

pygame.init()
pygame.camera.init()
{% endhighlight %}
摄像头模块是可选的。需要被引入和手动初始化。如上

#抓取一张图片
现在，我们来在最简单的情况下打开摄像头并且从中抓取一帧图片。在接下来的例子中，我们假设在你的电脑中摄像头叫做'/dev/video0',我们将摄像头视频的大小设置为宽640高480.我们用 get_image()来抓取图像。
{% highlight python %}
cam = pygame.camera.Camera("/dev/video0",(640,480))
cam.start()
image = cam.get_image()
{% endhighlight %}

#列出连接的摄像头
如果我们不能确定摄像头的真实路径？我们就可以使用 list_cameras()列出摄像头的列表，选取其中我们需要使用的那个（如果你有多个摄像头的话）
{% highlight python %}
camlist = pygame.camera.list_cameras()
    if camlist:
        cam = pygame.caemra.Camera(camlist[0],(640,480))
{% endhighlight %}

#控制摄像头
大多数摄像头提供像翻转图像和调整亮度的功能。set_controls() 和 get_controls() 要在 start() 后使用。
{% highlight python %}
cam.set_controls(hflip = True, vflip = False)
# set_controls(hflip = bool, vflip = bool, brightness)
print camera.get_controls()
{% endhighlight %}

#实时画面
本教程接下就开始可以看到实时画面了。
过程很简单，就是不停的从摄像头中获取视频帧然后绘制在屏幕上，有效的显示实时画面。基本上你期望也是这样吧。不停的 get_image(),然后显示，刷新，循环。因为性能的原因，我们使用每次都使用同样的显示表面。

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

因为get_image()是一个阻塞的动作，也许会在差摄像头上花费很多的时间，所以我们用 query_image()来确定摄像头是否准备好。同时可以让显示画面的帧率和摄像头的帧率分开来，并能够保障在一个单独的线程中抓取摄像头中的图像.当然如果你的摄像头支持 query_image()操作的话，这样可以有更好的性能保障。

#基本的显示效果
Pygame 可以做一些基本的视觉效果（滤镜），变形，遮罩……

##色彩空间
当你初始化摄像头的时候，有一个色彩空间的可选常数，有 'RGB', 'YUV', 和 'HSV'。在计算机视觉中 YUV 和 HSV 通常来说比 RGB 更有用。降低了颜色的阈值。
`self.cam = pygame.camera.Camera(self.clist[0], self.size, "RGB")`
![](http://www.pygame.org/docs/tut/camera/rgb.jpg)
`self.cam = pygame.camera.Camera(self.clist[0], self.size, "YUV")`
![](http://www.pygame.org/docs/tut/camera/yuv.jpg)
`self.cam = pygame.camera.Camera(self.clist[0], self.size, "HSV")`
![](http://www.pygame.org/docs/tut/camera/hsv.jpg)


##阈值
在变换模块中使用threshold()我们可做出来像下面的绿屏效果，在特定的场景中分离出特定的颜色。在接下来的例子中，我们分离出绿色的树，剩下的全部变黑。详细的使用方法看[threshold function](http://www.pygame.org/docs/ref/transform.html#pygame.transform.threshold)
{% highlight python %}
self.thresholded = pygame.surface.Surface(self.size, 0, self.display)
self.snapshot = self.cam.get_image(self.snapshot)
pygame.transform.threshold(self.thresholded,self.snapshot,(0,255,0),(90,170,170),(0,0,0),2)
{% endhighlight %}
![](http://www.pygame.org/docs/tut/camera/thresholded.jpg)

不过这只能用来寻找你知道准确颜色的对象。为了能够在现实的环境下方便的使用，我们增加一个校验机制来对对象的颜色进行辨认，并以此作为阈值。对此我们需要使用 average_color()这个方法。

下面的例子就是在方框中取得颜色，然后将此颜色作为其中的常数在 threshold()方法中使用。Note:<b>这一部分我们都使用的是 HSV 色彩空间。</b>
{% highlight python %}
def calibrate(self):
    # 抓图
    self.snapshot = self.cam.get_image(self.snapshot)
    # 更新显示
    self.display.blit(self.snapshot, (0,0))
    # 在屏幕中央花个方框
    crect = pygame.draw.rect(self.display, (255,0,0), (145,105,30,30), 4)
    # 从方框的范围中得到平均颜色
    self.ccolor = pygame.transform.average_color(self.snapshot, crect)
    # 在左上角显示一个此颜色的方框
    self.display.fill(self.ccolor, (0,0,50,50))
    pygame.display.flip()
{% endhighlight %}
![](http://www.pygame.org/docs/tut/camera/average.jpg)
`pygame.transform.threshold(self.thresholded,self.snapshot,self.ccolor,(30,30,30),(0,0,0),2)`
![](http://www.pygame.org/docs/tut/camera/thresh.jpg)

我自己做出来的效果：
![](http://ww4.sinaimg.cn/large/6a0c2c15gw1e8n9n00mmvj20hs0dcaad.jpg)
![Rondo](http://ww3.sinaimg.cn/large/6a0c2c15gw1e8n9o9n7edj20hs0dcabf.jpg)

我们可以同样的来做一个绿/蓝色屏幕，首先我们得到背景颜色，然后将背景色替换为绿色，其他不是背景的为黑色。
这是相机对准空白的墙壁。
{% highlight python %}
def calibrate(self):
    # 抓取一些背景图片
    bg = []
    for i in range(0,5):
        bg.append(self.cam.get_image(self.background))
    # 平均颜色，用来降噪
    pygame.transform.average_surfaces(bg,self.background)
    # 更新显示
    self.display.blit(self.background, (0,0))
    pygame.display.flip()
{% endhighlight %}
![](http://www.pygame.org/docs/tut/camera/background.jpg)
`pygame.transform.threshold(self.thresholded,self.snapshot,(0,255,0),(30,30,30),(0,0,0),1,self.background)`
![](http://www.pygame.org/docs/tut/camera/green.jpg)


##使用遮罩模块
这个玩意你可以用来显示图像，使用这个模块你也可以使用摄像头作为游戏的输入。上个例子，我们使用阈值分离出了特定的对象，现在，我们来找到这个对象的位置，然后使用它来控制屏幕上的小球。
{% highlight python %}
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
{% endhighlight %}
![](http://www.pygame.org/docs/tut/camera/mask.jpg)

这只是些基本的例子。你还可以跟踪不同颜色的斑点，描绘物体的轮廓，现实世界和游戏世界中的物体碰撞检测。得到一个物体的角度，然后精确的控制它。

more and have fun!


我的[渣代码]:

### 用滑块控制颜色，自定义threshold()的三个颜色参数。

* esc 退出
* ctrl+s 保存图片

{% highlight python %}
#/usr/bin/env python
# coding: utf-8

import pygame
import pygame.camera
from pygame.locals import *
import time

pygame.init()
pygame.camera.init()
pygame.display.set_caption("Pygame camera")

class Capture(object):
    def __init__(self,width=640,heigh=480):
        self.camera_size = (width,heigh)
        self.screen_size = (width,heigh+30)
        self.color = [0,0,0]
        self.threshold_color = [0,0,0]
        self.diff_color = [0,0,0]
        self.screen = pygame.display.set_mode(self.screen_size, 0,)
        self.clist = pygame.camera.list_cameras()
        if not self.clist:
            raise ValueError("Sorry, no cameras detected!")
        self.cam = pygame.camera.Camera(self.clist[0], self.screen_size, 'RGB') #  RGB HSV YUV
        try:
            self.cam.start()
        except Exception, e:
            print("camera is used")
            exit()
        self.cam.set_controls(hflip = True,vflip = True,brightness =1)  #
        print self.cam.get_controls()
        self.snapshot = pygame.Surface(self.camera_size, 0, self.screen)
        self.thresholded = pygame.surface.Surface(self.camera_size, 0, self.screen)
        self.red_scale,self.green_scale,self.blue_scale = self.create_scales(160,10)

    def create_scales(self,width,height):
        red_scale = pygame.surface.Surface((width,height))
        green_scale = pygame.surface.Surface((width,height))
        blue_scale = pygame.surface.Surface((width,height))
        for x in range(width):
            c = int((x/float(width))*255.)
            red = (c,0,0)
            green = (0,c,0)
            blue = (0,0,c)
            line_rect = Rect(x,0,1,height)
            pygame.draw.rect(red_scale,red,line_rect)
            pygame.draw.rect(green_scale,green,line_rect)
            pygame.draw.rect(blue_scale,blue,line_rect)
        return red_scale,green_scale,blue_scale

    def palette_RGB(self,x,y,width,height):
        red_scale,green_scale,blue_scale = self.create_scales(width,height/3.0)
        self.screen.blit(red_scale,(x,y))
        self.screen.blit(green_scale,(x,y+height/3.0))
        self.screen.blit(blue_scale,(x,y+height/1.5))

    def d_slider(self,color,left,top,width,height):
        t = self.screen_size[0]/3.0
        for c in range(3):
            line_rect = Rect(left+color[c]/255.*213,top+c*10,width,height)
            pygame.draw.rect(self.screen,(255,255,255),line_rect)

    def get_and_flip(self):
        if self.cam.query_image():
            self.snapshot = self.cam.get_image()
        pygame.transform.threshold(self.thresholded,self.snapshot,self.color,self.threshold_color,self.diff_color)
        self.screen.blit(self.thresholded, (0,0))
        # pygame.display.flip()
        pygame.display.update()

    def live(self):
        going = True
        while going:
            self.palette_RGB(0,480,213,30)
            self.palette_RGB(213,480,213,30)
            self.palette_RGB(426,480,213,30)
            events = pygame.event.get()
            for e in events:
                if e.type == QUIT or (e.type == KEYDOWN and e.key == K_ESCAPE):
                    self.cam.stop()
                    pygame.display.quit()
                    exit()
                    going = False
                if e.type == KEYDOWN:
                    if pygame.key.get_pressed()[K_LCTRL] and pygame.key.get_pressed()[K_s]:
                        pygame.image.save(self.thresholded,'%s.jpg' %int(time.time()))
                        print 'save jpg'
            x,y = pygame.mouse.get_pos()
            pygame.display.set_caption(str(self.color)+str(self.threshold_color)+str(self.diff_color))
            if pygame.mouse.get_pressed()[0]:
                if 480 <= y <=510:
                    row = int((y-480)/10.0)
                    if 0 <= x < 213:
                        c = x - 0
                        self.color[row] = int((c/213.)*255.)
                    if 213<= x < 426:
                        c = x - 213
                        self.threshold_color[row] = int((c/213.)*255.)
                    if 426<= x < 640:
                        c = x - 426
                        self.diff_color[row] = int((c/213.)*255.)
            self.d_slider(self.color,0,480,3,10)
            self.d_slider(self.threshold_color,213,480,3,10)
            self.d_slider(self.diff_color,426,480,3,10)
            self.get_and_flip()

if __name__ == '__main__':
    camera = Capture()
    camera.live()
{% endhighlight %}

### 获取颜色，然后追踪。

* 按m切换模式。

{% highlight python %}
#/usr/bin/env python
# coding: utf-8

import pygame
import pygame.camera
from pygame.locals import *
import time

pygame.init()
pygame.camera.init()
pygame.display.set_caption("Pygame camera")

class Capture(object):
	def __init__(self):
		self.size = (640,480)
		self.display = pygame.display.set_mode(self.size, 0,)
		self.clist = pygame.camera.list_cameras()
		if not self.clist:
			raise ValueError("Sorry, no cameras detected!")
		self.cam = pygame.camera.Camera(self.clist[0], self.size, 'RGB')
		self.cam.start()
		self.cam.set_controls(hflip = True,vflip = True,brightness =10)
		print self.cam.get_controls()
		self.snapshot = pygame.Surface(self.size, 0, self.display)
		self.thresholded = pygame.Surface(self.size, 0, self.display)

	def get_and_flip(self):
		if self.cam.query_image():
			self.snapshot = self.cam.get_image(self.snapshot)
		mask = pygame.mask.from_threshold(self.snapshot,self.ccolor,(30,30,30))
		self.display.blit(self.snapshot,(0,0))
		connected = mask.connected_component()
		if mask.count() > 100:
			coord = mask.centroid()
			pygame.draw.circle(self.display, (0,255,0), coord, max(min(20,mask.count()/400),10))
		pygame.display.flip()

	def calibrate(self):
		self.snapshot = self.cam.get_image(self.snapshot)
		self.display.blit(self.snapshot,(0,0))
		crect = pygame.draw.rect(self.display,(255,0,0),(int(self.size[0]/2.),int(self.size[1]/2.),30,30),3)
		self.ccolor = pygame.transform.average_color(self.snapshot, crect)
		self.display.fill(self.ccolor, (0,0,50,50))
		pygame.display.flip()

	def main(self):
		going = True
		mode = True
		while going:
			events = pygame.event.get()
			for e in events:
				if e.type == QUIT or (e.type == KEYDOWN and e.key == K_ESCAPE):
					self.cam.stop()
					pygame.display.quit()
					exit()
					going = False
				if e.type == KEYDOWN:
					if e.key == K_m:
						mode ^= True
			if mode:
				self.calibrate()
				pygame.display.set_caption(str(tuple(self.ccolor[:3])))
			else:
				self.get_and_flip()

if __name__ == '__main__':
	cam = Capture()
	cam.main()
{% endhighlight %}
![自爆](http://ww4.sinaimg.cn/large/6a0c2c15gw1e8n9kymobkj20hs0dc74s.jpg)
