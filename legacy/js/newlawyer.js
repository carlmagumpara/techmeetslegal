$(document).ready(function(){
  function show() {
    $('.loading').hide();
    $('.content').fadeIn();
  };
  $(window).load(function() {
    show();
    $('html,body').animate({scrollTop: 601}, 700);
  });
  $(window).unload(function() {
    show();
    $('html,body').animate({scrollTop: 601}, 700);
  });
});
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: 'dUqOztOx2u0',
    fs: '0',
    events: {
      'onReady': onPlayerReady
    }
  });
}
function onPlayerReady(event) {
event.target.stopVideo();
  $(document).ready(function(){
    $(window).scroll(function(){
        var ScrollTop = parseInt($(window).scrollTop());
        if ((ScrollTop >= 23100) && (ScrollTop <= 24199)) {
          event.target.playVideo();
         }
         else {
          event.target.pauseVideo();
         }
    });
  });
}