$(function(){
    if (document.querySelector('.game-container')) return;
    $(document).keydown(function(e) {
        var url = false;
        var prev = document.getElementById("previous");
        var next = document.getElementById("next");
        if ((e.which == 39 || e.which == 75) && prev) {      
            url = prev.href; // right arrow and k  to previous
        }
        else if ((e.which == 37 || e.which == 74) && next) { 
            url = next.href; // left arrow and j to next
        }
        if (url) {
            window.location = url;
        }
  });
});