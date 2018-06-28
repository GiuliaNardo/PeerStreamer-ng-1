
function createThumbnail(ch_name){
  $('#thumbnail').append("<div class=\"col col-lg-3 col-3 square \">\n" +
      "                       <a id='thumb-id'> <div class=\"image\">\n" +
      "                            <img class=\"img-thumbnail\" src=\"img/albapemba.jpg\">\n" +
      "                        </div></a>\n" +
      "                        <div class=\"didascalia\">\n" +
      "                            <div>Watch <span style='font-weight:600'>"+ch_name+"</span>!</div>\n" +
      "                        </div>\n" +
      "                    </div>")
}
