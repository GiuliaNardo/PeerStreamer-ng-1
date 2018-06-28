


function hideWebcam(){
    $("#webcam").hide();
    $("#screen").show();
}
function hideScreen(){
    $("#screen").hide();
    $("#webcam").show();
}

/*
$( document ).ready(function() {
    $("#preview-title").val("");
    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices).catch(handleError);
});

    var preview = document.getElementById("preview");

    var mic = true;
    var cam = true;

    var constraints;

    function microphoneSettings() {
        var elem =document.getElementById("microphone");
        if(elem!=null && preview!=null){
            if (mic === true){
                elem.innerHTML = "<i class=\"zmdi zmdi-mic-off\"></i>"
                mic = false;
                preview.muted = true;
                close();
            }else {
                elem.innerHTML = "<i class=\"zmdi zmdi-mic\"></i>"
                mic = true;
                preview.muted = false;
                open();
            }
        }

    }

    function cameraSettings() {
        var elem = document.getElementById("camera");
        var img = document.getElementById("video-img-div");
        if(elem!=null && img!=null && preview!=null){
            if (cam === true){
                elem.innerHTML = "<i class=\"zmdi zmdi-videocam-off\"></i>"
                cam = false;
                preview.pause();
                preview.style.display = "none";
                img.style.display = "block";
                close();
            }else {
                elem.innerHTML = "<i class=\"zmdi zmdi-videocam\"></i>"
                cam = true;
                preview.play();
                img.style.display = "none";
                preview.style.display = "block";
                open();
            }
        }

    }




    function hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

        if (hasGetUserMedia()) {
            // Good to go!
        } else {
            alert('getUserMedia() is not supported by your browser');
        }

        var videoElement = document.getElementById("preview");
        var audioSelect = document.querySelector('select#audioSource');
        var videoSelect = document.querySelector('select#videoSource');

        navigator.mediaDevices.enumerateDevices()
            .then(gotDevices).then(getStream).catch(handleError);
        audioSelect.onchange = requestRoomCreation;
        videoSelect.onchange = requestRoomCreation;

        function gotDevices(deviceInfos) {
            for (var i = 0; i !== deviceInfos.length; ++i) {
                var deviceInfo = deviceInfos[i];
                var option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'audioinput') {
                    option.text = deviceInfo.label ||
                        'microphone ' + (audioSelect.length + 1);
                    audioSelect.appendChild(option);
                } else if (deviceInfo.kind === 'videoinput') {
                    option.text = deviceInfo.label || 'camera ' +
                        (videoSelect.length + 1); //deviceInfo.deviceId
                    videoSelect.appendChild(option);
                } else {
                    console.log('Found one other kind of source/device: ', deviceInfo);
                }
            }
        }

        function getStream() {
            if (window.stream) {
                if(videoElement!=null){
                    var stream = videoElement.srcObject;
                    if(stream!=null){
                        var tracks = stream.getTracks();
                         tracks.forEach(function(track) {
                           track.stop();
                         });

                         videoElement.srcObject = null;
                    }
                }

             }
            constraints = {
                audio: {
                    deviceId: {exact: audioSelect.value}
                },
                video: {
                    deviceId: {exact: videoSelect.value}
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 }

                    set the ideal width and height "An ideal value, when used, has gravity, which means that the
                    browser will try to find the setting (and camera, if you have more than one), with the smallest
                    fitness distance from the ideal values given."


                }
            };

            //check();
            navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);
        }


        function gotStream(stream) {
            window.stream = stream; // make stream available to console
            videoElement.srcObject = stream;
        }

        function handleError(error) {
            console.error('Error: ', error);
            if (error.toString() ==="TypeError"){
                alert("Choose at least camera or microphone")
            }else if (error.name === "NotAllowedError" || error.name === "NotFoundError"){
                document.getElementById("preview").style.display = "none";
                document.getElementById("video-img-div").style.display = "block";
            }
        }



        function close() {
            if (cam===false && mic === false){
                window.stream.getAudioTracks()[0].stop();
                 window.stream.getVideoTracks()[0].stop();
            } else if (mic === false){
                 window.stream.getAudioTracks()[0].stop();
            } else if(cam === false){
                 window.stream.getVideoTracks()[0].stop();
            }

        }


        function open() {
            if (cam===true && mic === true){
                constraints.audio = true;
                constraints.video = true;
            } else if (mic === true){
                constraints.audio = true;
            } else if(cam === true){
                constraints.video = true;
            }
            navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);

        }
        */
