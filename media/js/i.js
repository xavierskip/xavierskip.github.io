//footer  custom
var bq = [
  "Don't never try to judge me Dude, you don't know what Fuck I been through",
  "It's only after we've lost everthing that we're free to do anything!",
  "I believe whatever doesn't kill you, simply makes you ... stranger",
  "参差多态乃幸福本源"
]
function random(len){
  return Math.floor(Math.random()*len)
}
var input = document.getElementById("quote");
input.innerText = bq[random(bq.length)];
//  Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-35426524-1']);
_gaq.push(['_setDomainName', 'blog.xavierskip.com']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();