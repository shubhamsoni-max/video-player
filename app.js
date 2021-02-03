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

var player = videojs("myVideo", options, function () {
  // print version information at startup
  let vjs = document.querySelector(".vjs-control-bar");

  let myVideo = document.getElementById("myVideo");

  var msg =
    "Using video.js " +
    videojs.VERSION +
    " with videojs-record " +
    videojs.getPluginVersion("record") +
    " and recordrtc " +
    RecordRTC.version;
  videojs.log(msg);
  vjs.insertAdjacentHTML(
    "beforeend",
    `<span class = "video-btn"><i class="fas fa-video"></i></span>`
  );
  vjs.insertAdjacentHTML(
    "beforeend",
    `<span class = "mice-btn"><i class="fas fa-microphone-alt"></i></span>`
  );

  // select classes
});

// error handling
player.on("deviceError", function () {
  console.log("device error:", player.deviceErrorCode);
});

player.on("error", function (element, error) {
  console.error(error);
});

// user clicked the record button and started recording
player.on("startRecord", function () {
  // event.preventDefault();
  // console.log(event);
  let video_device = document.querySelector(".video-device");
  let audio_device = document.querySelector(".audio-device");
  let custom_video_select = document.querySelector(".custom-video-select");
  let custom_audio_select = document.querySelector(".custom-audio-select");
  let video_btn = document.querySelector(".video-btn");
  let mice_btn = document.querySelector(".mice-btn");
  // let option = document.querySelector("option");
  let currentStream;
  let enumeratorPromise = navigator.mediaDevices.enumerateDevices();
  function stopMediaTracks(stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  // list of video devices

  video_btn.addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }
    // navigator.mediaDevices
    //   .enumerateDevices()
    //   .then(gotDevices)
    //   .catch(errorCallback);

    // function gotDevices(devices) {
    //   custom_video_select.innerHTML = "";
    //   devices.forEach(function (device) {
    //     if (device.kind === "videoinput") {
    //       let option = video_device.appendChild(
    //         document.createElement("option")
    //       );
    //       custom_video_select.length + 1;
    //       option.text = device.label;
    //       custom_video_select.append(option);
    //     }
    //     console.log(
    //       device.kind + ": " + device.label + " id = " + device.deviceId
    //     );
    //   });
    // }
    function gotDevices(mediaDevices) {
      custom_video_select.innerHTML = "";
      custom_video_select.appendChild(document.createElement("option"));
      let count = 1;
      mediaDevices.forEach((mediaDevice) => {
        // console.log(mediaDevice);
        if (mediaDevice.kind === "videoinput") {
          const option = document.createElement("option");
          option.value = mediaDevice.deviceId;
          const label = mediaDevice.label || `Camera ${count++}`;
          const textNode = document.createTextNode(label);
          option.appendChild(textNode);
          custom_video_select.appendChild(option);
        }
      });
    }
    if (typeof currentStream !== "undefined") {
      stopMediaTracks(currentStream);
    }
    const videoConstraints = {};
    if (custom_video_select.value === "") {
      videoConstraints.facingMode = "environment";
    } else {
      videoConstraints.deviceId = { exact: custom_video_select.value };
    }
    const constraints = {
      video: videoConstraints,
      audio: false,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        currentStream = stream;
        myVideo.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
        console.log("working");
      })
      .then(gotDevices)
      .catch((error) => {
        console.error(error);
      });
    navigator.mediaDevices.enumerateDevices().then(gotDevices);
    // navigator.mediaDevices.enumerateDevices().then(gotDevices);
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

    function gotDevices(devices) {
      custom_audio_select.innerHTML = "";
      devices.forEach(function (device) {
        if (device.kind === "audioinput") {
          let option = audio_device.appendChild(
            document.createElement("option")
          );
          custom_audio_select.length + 1;
          option.text = device.label;
          custom_audio_select.append(option);
        }
      });
    }

    if (typeof currentStream !== "undefined") {
      stopMediaTracks(currentStream);
    }
    const audioConstraints = {};
    if (custom_audio_select.value === "") {
      audioConstraints.facingMode = "environment";
    } else {
      audioConstraints.deviceId = { exact: custom_audio_select.value };
    }
    const constraints = {
      video: false,
      audio: audioConstraints,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        currentStream = stream;
        myVideo.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
      })
      .then(gotDevices)
      .catch((error) => {
        console.error(error);
      });
  });

  console.log("started recording!");
});

// user completed recording and stream is available
player.on("finishRecord", function () {
  // the blob object contains the recorded data that
  // can be downloaded by the user, stored on server etc.
  console.log("finished recording: ", player.recordedData);
});
