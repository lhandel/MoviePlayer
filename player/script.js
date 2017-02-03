const remote = require('electron').remote;
const Datastore = require('nedb');
const application = remote.app;
const path = require('path')
var activity = new Datastore({filename: path.join(application.getPath('userData'), 'storage/activity.db'), autoload: true });



window.onload = function() {

  var timer;
  var viewInfo;
  var myVideo;
  var viewData;


  require('electron').ipcRenderer.on('url', (event, message) => {

    viewInfo= message.viewInfo;

    // Check current time
    activity.findOne({id:viewInfo.id,episode_id:viewInfo.episode_id}, function (err, docs) {
        console.log(docs);
        viewData = docs;
        if(docs.completed<0.96 && docs.completed > 0.1){
            $(".continue").removeClass("hide");
            myVideo.currentTime = docs.currentTime;
            myVideo.pause();
        }

    });

    // Update currentTime before closing
    window.onbeforeunload = (e) => {

      activity.update({_id:viewData._id}, { $set: {currentTime:myVideo.currentTime,completed:(myVideo.currentTime/myVideo.duration)}}, { multi: false }, function (err, numReplaced) {
        console.log(numReplaced)
        if(numReplaced==1)
          e.returnValue = true
      });

    }



  $(document).ready(function(){

    $("#continue").click(function() {
        $(".continue").fadeOut();
        myVideo.play();
    });
    $("#restart").click(function() {
        $(".continue").fadeOut();
        myVideo.currentTime = 0;
        myVideo.play();
    });
    $(".controls .volList").mouseenter(function(){
      $( ".volyme-container" ).animate({
        width: 95,
      },100);
    });
    $(".controls .volList").mouseleave(function(){
      $( ".volyme-container" ).animate({
        width: 0,
      },100);
    });

    $("body").mousemove(function( event ) {
      $(".controls").show();
      $("body").removeClass("hideMouse");
      clearInterval(timer);
      timer = setTimeout(function() {
          console.log("Fade out");
          $(".controls.loaded").fadeOut();
          $("body").addClass("hideMouse");
      }, 1300);
    });
    $( "body" ).keydown(function( event ) {
      if(event.which==32)
        playpauseToggle();
    });
  });

    document.getElementById('div_video').innerHTML = '<video autoplay id="video_ctrl" ><source src="'+message.url+'" type="video/mp4"></video>';

    // VideoElement
    myVideo = document.getElementById('video_ctrl');

    // Buttons and labels
    var playpause = document.getElementById("pp");
    var currentTime = document.getElementById("currentTime");
    var timeLeft = document.getElementById("timeLeft");

    // Sliders
    var seekBar = document.getElementById("seek-bar");
    var volymeSlider = document.getElementById("volyme-slider");

    // Play/Pause
    playpause.addEventListener("click", function(){
      playpauseToggle();
    });
    function playpauseToggle(){
      if (myVideo.paused){
          playpause.innerHTML="&#10073;&#10073;";
          myVideo.play();
      }else{
          playpause.innerHTML="&#9658;";
          myVideo.pause();
        }
    }
    // Dataloaded
    myVideo.addEventListener('loadeddata', function() {

      playpause.innerHTML="&#10073;&#10073;";
      document.getElementsByClassName("controls")[0].className="controls loaded";
       // Video is loaded and can be played


    }, false);

    // volyme
    volymeSlider.addEventListener("input",function() {
      console.log(volymeSlider.value);
      myVideo.volume = (volymeSlider.value/100);
      if(volymeSlider.value<5){
        $(".volyme-icon").html('<i class="fa fa-volume-off" aria-hidden="true"></i>');
      }else if(volymeSlider.value > 5 && volymeSlider.value< 50){
        $(".volyme-icon").html('<i class="fa fa-volume-down" aria-hidden="true"></i>');
      }else{
        $(".volyme-icon").html('<i class="fa fa-volume-up" aria-hidden="true"></i>');
      }
    });
    // Seek
    seekBar.addEventListener("change", function() {
      // Calculate the new time
      var time = myVideo.duration * (seekBar.value / 100);

      // Update the video time
      myVideo.currentTime = time;
      currentTime.innerHTML = myVideo.currentTime.toHHMMSS();
      timeLeft.innerHTML = (myVideo.currentTime-myVideo.duration).toHHMMSS();
    });

    // Update labels
    myVideo.addEventListener("timeupdate", function() {
      // Calculate the slider value
      var value = (100 / myVideo.duration) * myVideo.currentTime;

      // Update the slider value
      seekBar.value = value;
      currentTime.innerHTML = myVideo.currentTime.toHHMMSS();
      timeLeft.innerHTML = (myVideo.currentTime-myVideo.duration).toHHMMSS();
    });

    // Pause the video when the slider handle is being dragged
    seekBar.addEventListener("mousedown", function() {
      myVideo.pause();
    });

    // Play the video when the slider handle is dropped
    seekBar.addEventListener("mouseup", function() {
      myVideo.play();
    });

    // Play the movie
    try {
      myVideo.play();
    } catch (e) {}

  });
}

Number.prototype.toHHMMSS = function () {
var sec_num = parseInt(this, 10); // don't forget the second param
var hours   = Math.floor(sec_num / 3600);
var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
var seconds = sec_num - (hours * 3600) - (minutes * 60);

if( hours < 0){
  hours   = hours;
}else if (hours   < 10) {
  hours   = hours;
}

if (minutes < 10) {minutes = "0"+minutes;}
if (seconds < 10) {seconds = "0"+seconds;}
if(hours==00){
  return minutes+':'+seconds;
}
return hours+':'+minutes+':'+seconds;
}
