/*
#
#
#
#
#
*/


 $(document).ready(function() {
 	task=0;
 	var b = $('body'),
		w = $(window),
		add = $('<a id="add" href="javascript:;">↑↑↓↓←→←→ABAB</a>');
	b.append(add);
	add.hide();
	// useragent
	var browserName = navigator.userAgent.toLowerCase();
	Browser = {
		version: (browserName.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
		safari: /webkit/i.test(browserName) && !this.chrome,
		opera: /opera/i.test(browserName),
		firefox:/firefox/i.test(browserName),
		msie: /msie/i.test(browserName) && !/opera/.test(browserName),
		mozilla: /mozilla/i.test(browserName) && !/(compatible|webkit)/.test(browserName) && !this.chrome,
		chrome: /chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)
	}
	if (Browser.msie && Browser.version <= 9 || Browser.firefox ) {
		var useragent = document.createElement('p');
		useragent.setAttribute('id','ua');
		useragent.innerHTML='<p>还在使用IE浏览器么？为了获得更好的浏览效果和体验，<a href="http://abetterbrowser.org/">给自己选个更好更先进的浏览器吧！</a>\
								用不同浏览器的人怎么能在一起？ <strong>:)</strong> </span><br>个人推荐追求速度、简约和安全的网络浏览器\
 						    	<a href="http://www.google.cn/intl/zh-CN/chrome/browser/eula.html??hl=zh-CN&standalone=1">chrome</a>\
 								<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABj0lEQVQokYWSTUhUYRSGD+KiOwyEIdKihnTwNjjhuFB0bKHOTe+n30XENrpoV7toGeRicKfgQl1IIi6MKHAWEZJzKzezKBIUwtkoQtw7g2M/FhExYig8LqYUYaQXzup9Dodz3iNSXpUiUnGOd6ovThd7Q318v9PP3rDma3+CQkcbZeF8U4ydeDOFzji71k0KnXF22lvIN8XwzcjZJp1WeLUmvhnBb4iSi94gF43iX4/ghevxwvVshq79OGlwXMWrVhOv1mRt+xsPnm1x/+kWxeI+R1njpP7xAe0qtGvz/vIV1Pgqt6fWGZxcp2fsA0dZg8OsweGGgYgERESCelmh04qBlEVsZIWWZIbmZIbGR29LcPYCfz4GEZGgiIioFzbaVThpG8/zuXrvCaG7C3zKe6UJGwa/31WfLp6Ys+h9aaPTNo6rcFxF92L3XzhAcbWKNxOXps9cqmvWwk710Ldko5cVj183cLB2kV+ZGnKpuvJZxEbbf3bMJLDmb/F5KYS/GOb5w5qZ/yYupdeoLGccA0ps2V86vloGAAAAAElFTkSuQmCC">\
 							</p>';		
		b.append(useragent);
	};
	//scroll
	var tmp = w.scrollTop(),
		scrolls = 0;
	w.scroll(function(){
		var current = w.scrollTop();
		if (current>tmp){
			scrolls++
		}else if (current<tmp){
			scrolls--
		}else{ return true}
		tmp = current;console.log(scrolls)

		if (scrolls == 1) {
			$('#arg1').animate({'top':'toggle',"opacity": "toggle"},700)
			$('#arg2').fadeIn(200).animate({'top':'+=100px'},700)
		}
		if (scrolls == 13) {
			$('#arg4').fadeIn(1000)
		}
		if (scrolls == 19) {
			$('#arg5').fadeIn(1000)
		} 
		if (scrolls >= 7) {
			add.fadeIn('slow')
		} else{
			add.fadeOut('slow')
		}

		if ( w.scrollTop() > 2300 && task == 0){
			display()
		}
	});
	add.click(function(){
		return add.hide(),w.scrollTop(0);
	});
	// 彩蛋
	var k = [];
	document.onkeydown = function(e) {
		e = e || window.event;
    	k.push(e.keyCode);console.log(e.keyCode)
    	if (k.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0 || k.toString().indexOf("49,48,55") >= 0 ) {
        	eggs();
        	k = [];
    	}
    };
    function eggs(){
    	var src = parseInt(Math.random()*7)+'.gif';
    	var eggs= document.createElement('div');
    	var img = document.createElement('img');
    	eggs.setAttribute('id','eggs');
    	img.setAttribute('src',src);
		b.append(eggs);
		$('#eggs').append(img);
		$('#eggs img').css( {'margin-left': -img.width/2,'margin-top': -img.height/2});
		$('#eggs').click(function(){
			$(this).remove();
		});
    }

});

// print 
function display(){
	task +=1;
	var src = $('#src').text(),
		len = src.length,
		count = 0,
		content = [],
		cursor = '<span class="cursor">_</span>';
    function print(){
		if (src.charAt(count) == '\\') {
			content.push('<br>');
			Delay = 130;
		}else if (src.charAt(count) == '|') {
			content.pop();
			Delay = 100;
		} else{
			content.push(src.charAt(count));
			Delay = 170;
		};
		$('#display').html(content.join('')+cursor);
		if(count<len){
			setTimeout(print,Delay);
			count++;
		}
	}
	setTimeout(print,700);
	function blink(){
		if ($('.cursor').css('visibility') == 'visible' ) {
			$('.cursor').css('visibility','hidden') 
		} else{
			$('.cursor').css('visibility','visible')
		}
		setTimeout(blink,700)
	}
	blink();		
}
// BGM
(function(){
	var audio   = document.getElementById('audio'),
		Console = document.getElementById('Console');
	Console.onclick = play;
	function play(){
		if (audio.paused) {
			audio.play();
			Console.className = 'playing';
		}else{
			audio.pause();
			Console.className = 'stop';
		}
	}	
})();

//  这一段求年月日的可把我害惨了！！我擦！！！实在没想出什么好主意了。。
(function(){
	function Time(date){
		var t = {
			year:  date.getFullYear(),
			month: date.getMonth(),
			day:   date.getDate()
		}
		return t
	}

	var now        = new Time(new Date()),
		birthday   = new Time(new Date(1991,9,7)),    //坑爹呀！月份是从0开始的呀!
		missYear   = 0,
		missMonth  = 0,
		missDay    = 0,
		month      = [31,28,31,30,31,30,31,31,30,31,30,31],
		L_month    = [31,29,31,30,31,30,31,31,30,31,30,31];
			
	if (now.year > birthday.year) {
		missYear = now.year - birthday.year;
	} else{
		return 0 
	}
	if (now.month > birthday.month) {
		missMonth = now.month - birthday.month;
	} else{
		missYear -=1;
		missMonth = 12 - birthday.month + now.month;
	}
	if ( now.day > birthday.day ) {
		missDay = now.day - birthday.day;
	} else{
		missMonth -=1;
		missDay = date() - birthday.day + now.day;
	};

	function date(){
		if ( now.year%4==0 && now.year%100 != 0 || now.year%400 == 0 ) {
			return L_month[now.month-1]		
		}else {
			return month[now.month-1]
		}
	}
	// output
	var content    = '<p style="margin-bottom:10px;">已经有<b style="font-size:16px;">'
			         + missYear +'年'+ missMonth +'月'+ missDay +'天'+
			         '</b>从的我生命中流逝</p><p style="margin-bottom:10px;">下一颗巧克力是什么味？</P>',
		time       = document.createElement("div");	         
	time.setAttribute('id','time');
	time.setAttribute('class','box');
	time.innerHTML = content; 
	$("#footer").append(time);
})();



/*  scroll
window.onload = function(){
    //adding the event listerner for Mozilla
    if(window.addEventListener){
    	document.addEventListener('DOMMouseScroll', scroll, false);
    }
    //for IE/OPERA etc
    document.onmousewheel = scroll;
    function scroll(event){
    	if (document.body.scrollTop>1200) {};
    	var delta = 0;
    	if (!event){
    		event = window.event;
    	}
    	// normalize the delta
    	if (event.wheelDelta) {
        	// IE and Opera
    		delta = event.wheelDelta / 60;
    	} else if (event.detail) {
    		// W3C
        	delta = -event.detail / 2;
        }
 		var currPos=document.getElementById('jandan').offsetTop;
    	//calculating the next position of the object
        currPos=parseInt(currPos)-(delta*50);
        //moving the position of the object
    	$('#jandan').css('top',currPos+'px');
    }
}
*/