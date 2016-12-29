window.onload = function() {
  var myVideo;

  require('electron').ipcRenderer.on('url', (event, message) => {

    console.log(message);
    document.getElementById('div_video').innerHTML = '<video autoplay id="video_ctrl" ><source src="'+message+'" type="video/mp4"></video>';

    // VideoElement
    myVideo = document.getElementById('video_ctrl');

    // Buttons and labels
    var playpause = document.getElementById("pp");
    var currentTime = document.getElementById("currentTime");
    var timeLeft = document.getElementById("timeLeft");

    // Sliders
    var seekBar = document.getElementById("seek-bar");

    // Play/Pause
    playpause.addEventListener("click", function(){
      if (myVideo.paused){
          playpause.innerHTML="&#10073;&#10073;";
          myVideo.play();
      }else{
          playpause.innerHTML="&#9658;";
          myVideo.pause();
        }
    });

    // Dataloaded
    myVideo.addEventListener('loadeddata', function() {
      playpause.innerHTML="&#10073;&#10073;";
      document.getElementsByClassName("controls")[0].className="controls";
       // Video is loaded and can be played
    }, false);

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

  })
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
