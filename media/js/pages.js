$(function(){
  $(document).keydown(function(e) {
    var url = false;
        if (e.which == 39 || e.which == 75) {  // right arrow and k  to previous
            url = document.getElementById("previous").href;
        }
        else if (e.which == 37 || e.which == 74) {  // left arrow and j to next
            url = document.getElementById("next").href;
        }
        if (url) {
            window.location = url;
        }
  });
})