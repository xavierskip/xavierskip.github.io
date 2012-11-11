---
title: 折腾小记
layout: post
excerpt: apache服务器的本地配置，和一些关于openshift
tags: apache ubuntu openshift note
---


[openshift](https://openshift.redhat.com/)时髦点说就是云计算平台，同时作为个人web应用开发平台是自由免费的。   
和GAE SAE 可以说是一回事。  
但是和传统的vps又有些不同，例如 [linode](http://www.linode.com/)。   

好了不扯远了，想学习或者开发网络应用的就需要一台服务器，要知道服务器的性能都是很强大的，你一个人用那是绰绰有余，这种需求就有了 vps （Virtual Private Server 虚拟专用服务器）,将一部服务器分割成多个虚拟专享服务器的优质服务。随着网络技术的发展，“云计算”这个概念出来了，云计算平台提供可以让用户搭建web应用程序的功能。这个话题太大我也不清楚，打住。   

大多数云计算平台的基础功能是免费的包括gae，openshift，早期的sae。（因为sae现在开始收费了，我也付过费，新的计价规则出来了实在是撑不住，也没多流量就一个blog，而且sae的自由度不高，并且在国内，这一点除了国内速度快点似乎没什么优点。）gae是免费的，但是appspot域名被墙还是很不方便的，而且gae的自由度不太高，部署、功能的限制等等。但是还是要感谢gae的，毕竟goagent就搭建在那上面，fuck GFW 就靠他了！！   

注册了openshift，感觉就不一样----感觉是很折腾。部署是用git，这一点上，由于git这种分布式版本管理的特点，在openshift是搭建的应用最好能有本地环境，毕竟分布式分布式服务器并不是中心了。   

openshift感觉很自由，创建的应用可以用 ssh 连接到服务器上。ssh -D 你懂的！！！！   

于是我创建了几个应用来学习开发网络应用玩玩，并把sae上我的blog尸体放到这个上面。。。   

blog是wordpress，创建成功后，我需要对文件进行修改，增加,添加一下插件主题什么的，比如要一个插件导入我之前的wp blog 备份的文件。   

openshift是通过git来部署的。（后来我发现通过sftp也可以[via](https://openshift.redhat.com/community/blogs/getting-started-with-sftp-and-openshift)）   
我需要将程序在本地调试运行，然后放到服务器上运行即可。   

所以我需要在本地搭建wordpress的运行环境。这就需要 LAMP 
  
 - Linux （系统）
 - apache（服务器。为什么不是nginx呢？）
 - mysql（数据库）
 - php （你的程序）

搭建这些环境我就不说了，善于搜索，也就几条 apt-get 搞定的事。   

进入正题了，前戏够长的。  

* apache的默认路径是 `/var/www` 。而你不喜欢这个路径，我想自定义路径该怎么设置。
* 我本地有几个网站程序，放在不同的路径，或者同一目录下，但是通过不同的域名或者子域名去访问。

要设置好这些就要了解，apache是怎么设置的，设置文件在哪？需要怎么修改！   

开始我查到的是apache的配置文件是 httpd.conf ，在 `/etc/apache2/` 目录下。（如果你是ubuntu，安装的是 apt-get install apache2 的话）   
可是打开一看这个文件是空的。    
后来查找才搞清楚，apache2的配置文件进行了调整优化，和之前的不一样了，那是以前的老资料，配置都放在httpd.conf文件里面。  
主配置文件是`apache2.conf`.   
在最后面两行可以看见：

	# Include the virtual host configurations:
	Include sites-enabled/

这个就是’虚拟主机‘，我们等一下需要设置的。   
在`/etc/apache2/` 目录下，我们还可以看见两个文件夹`sites-available` 和`sites-enable`。顾名思义，一个是“可用的”一个是“使用的”。   
打开`sites-available` 下你会看到几个文件，这就是你的site配置文件，its available 。而打开`sites-enable`目录你会发现这个目录下是个链接，指向`sites-available`下的文件。   

也就是说`sites-enable`文件夹中的链接指向的文件就是有效的apache的虚拟主机配置文件。   
我们在`sites-available`文件夹下的配置文件通过链接到`sites-enable`文件夹下来生效。    
于是我们来看一下这个配置文件并进行修改  

	<VirtualHost *:80>
		ServerAdmin webmaster@localhost   # 管理员的邮箱
		ServerName  domain                # domain 域名
		ServerAlias wp                    # 昵称别名？
		DocumentRoot /home/www/wordpress  # 你的网站文件路径
		DirectoryIndex                    # 主页文件
		<Directory />
			Options FollowSymLinks
			AllowOverride None
		</Directory>
		<Directory /home/www/wordpress>   # 网站路径
			Options Indexes FollowSymLinks MultiViews
			AllowOverride None
			Order allow,deny
			allow from all
		</Directory>
		#后面的是一些其他的设置了。
		ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
		<Directory "/usr/lib/cgi-bin">
			AllowOverride None
			Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
			Order allow,deny
			Allow from all
		</Directory>

		ErrorLog ${APACHE_LOG_DIR}/error.log

		# Possible values include: debug, info, notice, warn, error, crit,
		# alert, emerg.
		LogLevel warn

		CustomLog ${APACHE_LOG_DIR}/access.log combined

	    Alias /doc/ "/usr/share/doc/"
	    <Directory "/usr/share/doc/">
		Options Indexes MultiViews FollowSymLinks
		AllowOverride None
		Order deny,allow
		Deny from all
		Allow from 127.0.0.0/255.0.0.0 ::1/128
	    </Directory>

	</VirtualHost>

设置好后 可以自行链接`ln -s /sites-available/custom  /sites-enable/custom`,重启生效 `sudo service apache2 restart`.   
也可以`sudo /usr/sbin/a2ensite wp   #你设置的别名 `，然后重启apache。   

修改hosts后就可以直接用域名访问本地的各个网络程序了。  

1. [安装Apache](http://blog.danthought.com/2012/10/ubuntu-apache-quick-guide-one-install-apache/)
2. [Apache配置文件](http://blog.danthought.com/2012/10/ubuntu-apache-quick-guide-about-apache-configuration/)
3. [Apache MPM](http://blog.danthought.com/2012/10/ubuntu-apache-quick-guide-about-apache-mpm/)
4. [Apache 关键配置](http://blog.danthought.com/2012/11/ubuntu-apache-quick-guide-about-key-configuration/)
5. [Apache 虚拟主机基础](http://blog.danthought.com/2012/11/ubuntu-apache-quick-guide-about-virtual-host-basic/)
6. [Apache 虚拟主机配置](http://blog.danthought.com/2012/11/ubuntu-apache-quick-guide-about-virtual-host-configuration/)

























