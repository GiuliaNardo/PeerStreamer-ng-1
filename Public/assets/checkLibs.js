
var libs = ['jquery','popper', 'bootstrap'];
var load;

for (i=0; i<libs.length;i++) {
    load = false;
    console.log("prima"+ load)
    if(document.getElementById(libs[i]).onload){a()}

    console.log("dopo"+ load)
    loadScript(a(), libs[i]);

    checkLibrary(libs[i]);
}



function loadScript(callback, id) {
    var script  = document.getElementById(id);
    script.onload = callback;
    //script.addEventListener("onload", callback);
};

function a (){
    load = true;
}


function checkLibrary(id){
    console.log("cheL "+id)
    if (!load){
        var script  = document.createElement("script");
        switch (id) {
            case "jquery":
                script.src = "./libs/jquery3.3.1.js";
                //script.setAttribute("src", "./libs/jquery3.3.1.js");
                script.type = "text/javascript";
                console.log("JQ");
                break;
            case "popper":
                script.setAttribute("src", "./libs/popper.js");
                break;
            default:

        }
        document.head.prepend(script);
    }else{
        console.log("OK")
        switch (id) {
            case "jquery":
                console.log("OK"+id)
                break;
            case "popper":
                console.log("OK"+id)
                break;
            default: console.log("nanana")

        }
    }
}
