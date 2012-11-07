---
comments: true
date: 2011-11-04 18:01:20
layout: post
title: 斐波那契数列（Fibonacci）
wordpress_id: 137
categories:
- python
tags:
- python
---

斐波纳契数列就是，这个数列的中的数等于前两个数字的之和



	
  * _a_1 = 1

	
  * _a_2 = 1

	
  * _a__n_ = _a__n_ − 1 + _a__n_ − 2


[知道更多点这里](http://zh.wikipedia.org/wiki/%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E6%95%B0%E5%88%97)

输入第一个数
输入接下来的数，
生成在某个范围的斐波纳契数列


    
     #-*- encoding:UTF-8 -*- 
    
    def fibs(star,nexto,upto):
    	result = [star,nexto]
    	while True:
    		n = result[-1]+result[-2]
    		if n <upto:
    			result.append(n)
    		else:
    			break
    	print result
    
    star = input('Enter a number what you want start: ')
    nexto = input('Enter the next number: ')
    upto = input('Enter a number what you want stop: ')
    print 'your Fibonacci series  like this[',star,',',nexto,',~~~,',upto,']'
    
    fibs(star,nexto,upto)


还有改进的地方，输入数据的地方
还有细节的方面可以完善么？
先这样吧！
