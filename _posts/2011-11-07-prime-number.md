---
comments: true
date: 2011-11-07 12:50:08
layout: post
title: 求素数
wordpress_id: 163
categories:
- python
tags:
- python
---

暑假在家看Java，有一道习题，就是要求出来100内的素数，当时也是想了半天也搞不出来，上网查了查，都忘记了怎么搞出来的你，以为懂了。
现在想用python求素数，仍然搞不出来。
看这个帖子
[求100内的素数，给8000](http://www.iteye.com/topic/996233)

里面有几个方法有意思

    
    
    primes =[x for x in range ( 1 , 100 ) if not [y for y in range ( 2 ,x/2+1)   if x % y == 0 ]] 
    print primes
    


这应该是最python的方法了，强大的列表解析呀!


    
    
    primes = []  
      
    for n in range(2, 101):  
        for i in primes:  
            if n % i == 0:  
                break  
            elif i ** 2 > n:  
                primes.append(n)  
                break  
        else:  
            primes.append(n)  
      
    print primes  
    


我觉得这个思路很清晰呀！


经过我修改的，个人很满意

    
    
     #-*- encoding:UTF-8 -*- 
    
    primes=[]
    num = int(raw_input('enter:'))
    for n in range(2,num):
    	for i in primes:
    		if n%i == 0:
    			break
    	else:
    		primes.append(n)
    
    print primes
    print '1到',num,'有',len(primes),'个素数'
    




