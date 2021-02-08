

var options = {
  controls: true,
  bigPlayButton: false,
  width: 320,
  height: 240,

  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      displayMilliseconds: false,
      debug: true,
    },
  },
  
};

// apply some workarounds for certain browsers
// applyAudioWorkaround();

var player = videojs("myVideo", options, function () {
  // print version information at startup
  

  let myVideo = document.getElementById("myVideo");

  var msg =
    "Using video.js " +
    videojs.VERSION +
    " with videojs-record " +
    videojs.getPluginVersion("record") +
    " and recordrtc " +
    RecordRTC.version;
  videojs.log(msg);

  let vjs = document.querySelector(".vjs-control-bar");
  vjs.insertAdjacentHTML(
    "beforeend",
    `<span class = "video-btn"><i class="fas fa-video"></i></span>`
  );
  vjs.insertAdjacentHTML(
    "beforeend",
    `<span class = "mice-btn"><i class="fas fa-microphone-alt"></i></span>`
  );
  
});


document.querySelector(".vjs-device-button").onclick = ()=>{
  player.record().enumerateDevices();
 
// Change AudioInput

  function changeAudioInput(event) {
    var label = event.target.options[event.target.selectedIndex].text;
    deviceId = event.target.value;
  
    try {
      // change audio input device
      player.record().setAudioInput(deviceId);
      console.log(
        "Changed audio input to '" +
          label +
          "' (deviceId: " +
          deviceId +
          ")"
      );
    } catch (error) {
      console.warn(error);
      // jump back to first output device in the list as it's the default
      event.target.selectedIndex = 0;
    }
  }

// Set videoInput

function changeVideoInput(event) {
  var label = event.target.options[event.target.selectedIndex].text;
  deviceId = event.target.value;

  try {
      // change video input device
      player.record().setVideoInput(deviceId);

      console.log("Changed video input to '" + label + "' (deviceId: " +
          deviceId + ")");
  } catch (error) {
      console.warn(error);

      // jump back to first output device in the list as it's the default
      event.target.selectedIndex = 0;
  }
}

player.on("enumerateReady", function () {
  let custom_video_select = document.querySelector(".custom-video-select");
  let custom_audio_select = document.querySelector(".custom-audio-select");
  let video_btn = document.querySelector(".video-btn");
  let mice_btn = document.querySelector(".mice-btn");


  // list of video devices

  video_btn.addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }
    navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .catch((err) => {
      console.log(err);
    });
    function gotDevices(mediaDevices) {
      custom_video_select.innerHTML = "";
      let count = 1;
      mediaDevices.forEach((mediaDevice) => {
        if (mediaDevice.kind === "videoinput") {
          const option = document.createElement("option");
          option.value = mediaDevice.deviceId;
          const label = mediaDevice.label || ` ${count++}`;
          const textNode = document.createTextNode(label);
          option.appendChild(textNode);
          custom_video_select.appendChild(option);
        }
      });

      if (custom_video_select.length == 0) {
        // no output devices found, disable select
        option = document.createElement('option');
        option.text = 'No video input devices found';
        option.value = undefined;
        custom_video_select.appendChild(option);
        custom_video_select.disabled = true;
        console.warn(option.text);
    } else {
        console.info('Total video input devices found:', custom_video_select.length);
    }

    }
    custom_video_select.addEventListener("change", changeVideoInput);
  });

 // list of audio devices
  mice_btn.addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .catch((err) => {
        console.log(err);
      });

      function gotDevices(mediaDevices) {
        custom_audio_select.innerHTML = "";
        let count = 1;
        mediaDevices.forEach((mediaDevice) => {
          if (mediaDevice.kind === "audioinput") {
            const option = document.createElement("option");
            option.value = mediaDevice.deviceId;
            const label = mediaDevice.label || ` ${count++}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);
            custom_audio_select.appendChild(option);
          }
        });

        if (custom_audio_select.length == 0) {
          // no output devices found, disable select
          option = document.createElement('option');
          option.text = 'No audio input devices found';
          option.value = undefined;
          custom_audio_select.appendChild(option);
          custom_audio_select.disabled = true;
          console.warn(option.text);
      } else {
          console.info('Total audio input devices found:', custom_audio_select.length);
      }
      }
      custom_audio_select.addEventListener("change", changeAudioInput);
  });
});

}

// error handling

player.on("enumerateError", function () {
  console.log("enumerate error:", player.enumerateErrorCode);
});

player.on("deviceError", function () {
  console.log("device error:", player.deviceErrorCode);
});

player.on("error", function (element, error) {
  console.error(error);
});

// user clicked the record button and started recording
player.on("startRecord", function () {
  

  console.log("started recording!");
});

// user completed recording and stream is available
player.on("finishRecord", function () {
  // the blob object contains the recorded data that
  // can be downloaded by the user, stored on server etc.
  console.log("finished recording: ", player.recordedData);
});
