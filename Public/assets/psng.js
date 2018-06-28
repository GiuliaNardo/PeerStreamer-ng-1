var channels = null;

$(document).ready(function() {
	var a = document.getElementById("search").value="";
});

function isSearching(){
	var res=false;
	if ($("#search").is(":focus"))
		res= true
	return res;

}

function response_channel(ch)
{
	channel = ch.id;
	set_state(ch.name);
	startStream(ch.janus_streaming_id);
}

function set_state(s)
{
	if(document.getElementById("video")!=null){
		var t = document.getElementById("player-title");
		t.innerHTML = s;
	}

}

function filterChannels(){
	//call update channel with matched channel name
	var list = [];
	var i = 0;
	var word = null;
	var text = document.getElementById("search").value;
	for (el in channels){
		var ch_name = channels[el].name;
		if(ch_name.toLowerCase().indexOf(text) >= 0){
			list[i] = channels[el];
			i++;
		}
	}
	update_channels(list)
}

function checkIfChannelExists(chs){
	//check if current channel is still exists
	var res = false;
	if(document.getElementById("video")!=null){
		var text = document.getElementById("player-title").textContent;
		if (text!=""){
			for (el in chs){
				if(chs[el].name === text){
					res = true;
				}
			}
		}else{
			res=true;
		}
	}
	return res
}

function request_channel(ch)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var ch = JSON.parse(this.responseText);
			response_channel(ch);
		}
		if (this.readyState == 4 && this.status != 200) {
			set_state("&lt;An error occurred with channel&gt;");
			$("#container-error").show();
		}
	};
	var id = Math.random().toString(36).substr(2, 8);
	xhttp.open("POST", "/channels/" + id, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "ipaddr=" + encodeURIComponent(ch.ipaddr) + "&port=" + encodeURIComponent(ch.port);
	xhttp.send(params);
}

function update_channels(chs)
{
	var search = document.getElementById('search');
	var body = document.getElementsByTagName("BODY")[0];
	var list = document.getElementsByClassName("channel-list");
	var thumbnail = document.getElementById("thumbnail");

	if (list!=null){
				var home = document.getElementById("home");
				$(".channel-list").empty();
				$("#no-ch").hide();
				if( thumbnail!=null){
					while (thumbnail.firstChild) {
						thumbnail.removeChild(thumbnail.firstChild);
					}
				}

				if (chs.length > 0){
					for (el in chs) {
						//alert(chs[el].toSource())
						if(home!=null){
							if(home.style.display === "block"){
								createThumbnail(chs[el].name); //in home.js file
								document.body.style.backgroundColor = "#fff";
							}

						}

						var superNode = document.createElement("DIV");
						superNode.className ="sidelink"
						var node = document.createElement("DIV");
						node.className="channel-link";
						var textnode = document.createTextNode(chs[el].name);

						node.appendChild(textnode);
						superNode.appendChild(node);
						$(".channel-list").append(superNode);
						(function (ch) {
							if(home!=null){
								if(home.style.display === "block"){
									document.getElementById("thumb-id").onclick=function(e){
										request_channel(ch);
										document.getElementById("home").style.display = "none";
										document.getElementById("video").style.display = "block";
										document.body.style.backgroundColor = "#1E2930";
									};
								}
							}

							node.onclick = function(e){
								request_channel(ch);
								document.getElementById("home").style.display = "none";
								document.getElementById("video").style.display = "block";
								document.body.style.backgroundColor = "#1E2930";
							};

						})(chs[el]);
					}
				}else{
					$("#no-ch").show();

					var list = document.getElementsByClassName("channel-list");
					var node = document.createElement("DIV");
					node.className="sidelink";
					var textnode = document.createTextNode("No channel available");
					node.appendChild(textnode);
					//list.appendChild(node);
					$(".channel-list").append(node);
			}

	}
	var ch_exists = checkIfChannelExists(chs);
	if (!ch_exists){
		$('#remotevideo').hide();
		$('#container-error').show();
	}

}

function refresh_channels()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			channels = JSON.parse(this.responseText);
				if(!isSearching()){ //if cursor is not on searchbar, update the list of channels
					update_channels(channels);
				}
		}
	};
	xhttp.open("GET", "/channels", true);
	xhttp.send();
}

function update_channel()
{
	if (channel.length > 0)
	{
		var xhttp = new XMLHttpRequest();
		xhttp.open("UPDATE", "/channels/" + channel, true);
		xhttp.send();
	}
}

function update_source()
{
   var xhttp = new XMLHttpRequest();
   xhttp.open("UPDATE", "/sources/" + myroom, true);
   xhttp.send();
}
