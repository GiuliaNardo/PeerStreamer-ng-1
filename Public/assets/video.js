
$(document).ready(function () {

    var i=0, max = 10;

    for (i; i< max; i++){
        $("#chat").append("<div class=\"col col-2 col-lg-2 user-img\">\n" +
            "                    <img src=\"https://image.freepik.com/icone-gratis/profilo-utente-ombra_318-40244.jpg\">\n" +
            "                    <div class=\"user-name\">Penelope12345</div>\n" +
            "                </div>\n" +
            "                <div class=\"col col-10 col-lg-10 chat-text \">\n" +
            "                    Sirenas judicia dicimus numerum re ex.\n" +
            "                    Attinet nul tam ineptum mox humanam pro divelli invitus.\n" +
            "                    Pauciora in potentia vi at ut credendi recorder. Fal enim iis aër esse meam.\n" +
            "                    Ignorata vigiliam ob cavendum collecta deceptor et me ab.\n" +
            "                    Nullam fateri sua nos quodam arrogo desunt uno sed eandem.\n" +
            "                </div>");


    }
    window.setInterval(function() {
        var elem = document.getElementById('chat');
        elem.scrollTop = elem.scrollHeight;
    }, 5000);


    var live=true; //true for live video. It changes display property of some mediaPlayer button


    $('#remotevideo').controls = false;

    $('#seek-bar').val = "0";
    if (live){
        $('#seek-bar-div').hide();
        $("#stop-button").hide();
    } else{
        $("#live-img").hide();
        $('#remotevideo').on("timeupdate", function() {
        var value = (100 / $('#remotevideo').duration) * $('#remotevideo').currentTime;
        $('#seek-bar').val = value;
        });
        // Event listener for the seek bar
        $('#seek-bar').on("change", function() {
            var time = $('#remotevideo').duration * ($('#seek-bar').val / 100);
            $('#remotevideo').currentTime = time;
        });
        // Pause the video when the slider handle is being dragged
        $('#seek-bar').on("mousedown", function() {
            $('#remotevideo').trigger('pause');
        });

        // Play the video when the slider handle is dropped
        $('#seek-bar').on("mouseup", function() {
            $('#remotevideo').trigger('play');
        });
    }
}) ;

/*chat functions*/
function hideChat() {
    var chat = document.getElementById("chat-box");
    chat.style.display = "none";
    document.getElementById("left-arrow").style.display = "block";
    $('#colonnaPlayer').removeClass('col-9');
    $('#colonnaPlayer').addClass( "col-11" );

}
function displayChat() {
    var chat = document.getElementById("chat-box");
    chat.style.display = "block";
    document.getElementById("left-arrow").style.display = "none";
    $('#colonnaPlayer').addClass('col-9');
    $('#colonnaPlayer').removeClass( "col-11" );
}



/*Popover functions*/

$(function () {
    $('[data-toggle="popover"]').popover()
});
$(function () {
    $('.example-popover').popover({
        container: 'body'
    })
});
$(function(){
    $('[rel=popover]').popover({
        html : true,
        content: function() {
            return $('#popover_content_wrapper').html();
        }
    });
});

function createImages() {
    var i =0, max_images = 15;
    for (i; i<max_images; i++) {
        $("#popover-images").append("<div class=\"col-popover col-4\">\n" +
            "    <button class='popover-btn' type=\"submit\"><img class=\"popover-img\" src=\"https://s3.pixers.pics/pixers/700/FO/11/87/39/88/700_FO11873988_13d7872d148cbcd83db171fe442b144d.jpg\"></button>\n" +
            "</div>")
    }
}





function togglePlayPause() {
    var btn = document.getElementById("play-pause-button");
    if($("#remotevideo")!=null){

        if ($("#remotevideo").get(0).paused || $("#remotevideo").get(0).ended){
            btn.title = "pause";
            btn.innerHTML = "<i class=\"zmdi zmdi-pause\"></i>";
            $("#remotevideo").trigger('play');
        } else{
            btn.title = "play";
            btn.innerHTML = "<i class=\"zmdi zmdi-play\"></i>";
            $("#remotevideo").trigger('pause');
        }
    }

}

function stopPlayer(){
    var btn = document.getElementById("stop-button");
    if($("#remotevideo")!=null){
        $("#remotevideo").trigger('pause');
        $("#remotevideo").currentTime = 0;

        btn.innerHTML = "<i class=\"zmdi zmdi-stop\"></i>";
    }

}
function mute() {
    var volume = document.getElementById("volume");
    if($("#remotevideo")!=null){
        if (!$("#remotevideo").prop('muted')){
            $("#remotevideo").prop('muted',true);
            volume.innerHTML = "<i class=\"zmdi zmdi-volume-off\"></i>"
        }else{
            $("#remotevideo").prop('muted', false);
            volume.innerHTML = "<i class=\"zmdi zmdi-volume-up\"></i>"
        }
    }
}

function changeVolume() {
    if($("#remotevideo")!=null){
        var volumeBar = document.getElementById("volume-bar");
        $("#remotevideo").prop("volume", volumeBar.value);
    }
}

function showVolume() {
    document.getElementById("volume-bar").style.visibility = "visible";
}
function hideVolume() {
    document.getElementById("volume-bar").style.transition = "2s";
    document.getElementById("volume-bar").style.visibility = "hidden";
}

function fullScreen() {

    if($("#remotevideo")!=null){
        var elem = $("#remotevideo")[0];
        if(document.getElementById('container-error').style.display === "none"){
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }
    }
}



function settings() {
    var items = document.getElementById("div-settings");
    items.style.visibility = "visible"
    /*
    var src1080 = "./video/mov_bbb.mp4";
    var src720 = "./video/mov_bbb.mp4";
    var src480 = "./video/mov_bbb.mp4";
    mediaPlayer.setAttribute('src', src1080);
    */
}
