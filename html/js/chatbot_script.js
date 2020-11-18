gb=0;

$(document).ready(function(){
    //The first welcoming msg from the robot
    bot();

    //user keypress "enter" to send message
    $('#empty').keypress(function(event){
      if(event.which == 13){
        $('#send-btn').click();
        event.preventDefault();
      }
    });

    //User click the "send" button
    $('#send-btn').click(function(event){
          var message = $('#empty').val(); //get value from the textbox
          var displayMsg = $('.chatlogs').html(); //displaying the value from the textbox to the chatlogs
          var ourRequest = new XMLHttpRequest(); //request to get the chatbot message from the server
          ourRequest.open('GET','https://final-year-project-260106.appspot.com/?type=query&text=' + message);


        if(document.getElementById("empty").value == ""){
          $('#emptyString').html("The textbox is empty.");
          $('#emptyString').fadeIn("fast");
          $('#emptyString').delay(3000);
          $('#emptyString').fadeOut("fast");
        }
        else{
            $('.chatlogs').html(displayMsg + "<div class ='content'>" +  "<img class='picture-user' src='images/user.png'></img>" + "<p>" + message.replace(/'/g,"\&#039;").replace("\"","\&quot;")  + "</p>" + "</div>"); //display user message on the chatlogs
            document.getElementById("empty").value=""; //after sending user message, textbox automatically clear all the text
            event.preventDefault();

            ourRequest.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                  var ourData = JSON.parse(ourRequest.responseText); //data become javascript object
                  robotReply(ourData,message); // Robot reply
                }
            };
            ourRequest.withCredentials = true;
            ourRequest.send();
        }
    $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
  });//End of user send msg

    //Get user report info
    $('#reportSend').click(function(event){
          event.preventDefault();
          var name = document.getElementById("name").value;
          var problem = document.getElementById("problem").value;
          var suggest = document.getElementById("suggest").value;
          var expect = document.getElementById("expect").value;
          var getReportInfo = new XMLHttpRequest(); //request to get the chatbot message from the server
          var displayBotMsg = $('.chatlogs').html();
          getReportInfo.open("POST", "https://final-year-project-260106.appspot.com/", true);
          getReportInfo.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // tell server what type you are sending (form type...)
          getReportInfo.onreadystatechange = function(){
            if(this.readyState == 4){
                  if(this.status==200){
                      var statusData = JSON.parse(getReportInfo.responseText); //data become javascript object
                      if(statusData['status'] == "success"){
                        document.getElementById("name").value="";//clear username;
                        document.getElementById("problem").value="";//clear value
                        document.getElementById("suggest").value="";//clear value
                        document.getElementById("expect").value="";//clear value

                        $('.chatlogs').html(displayBotMsg + "<div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                        "<p>Report sent successfully</p>" + "</div>");

                        displayChat();
                        $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                      }
                  }
                      else{
                        alert("Error occured!!");
                      }
            }
          }
          getReportInfo.withCredentials = true;
          getReportInfo.send("type=report_push&issuedBy=" + name + "&description=" + problem + "&solution=" + suggest + "&outcome=" + expect); //send report info
          $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
    });//End of report sent

    //User canceling to report
    $('#reportCancel').click(function(event){
      event.preventDefault();
      displayChat();
    });//End of cancel report


});//End of ready document

//textbox scrollbar
function changedValue() {
    let text = document.getElementById("empty");
    let textValue = text.value;
    let row = text.getAttribute('rows');
    let lines = textValue.split(/\r|\r\n|\n/);
    let count = lines.length;
    if (count >= row) {
        text.style.overflowY = "scroll";
    }
    else if (count < row) {
        text.style.overflowY = "hidden";
    }
}
//This is the first message greetings from the chatbot
function bot(){
      hideTextbox();

      $(".chatlogs").html("<div class = 'current_message'><div class = 'robot'><img class='picture' src= 'images/ebee2.jpg'></img>" +
      "<p>Hi, I am the Faculty Administrative Chatbot. How can I help you?<br><br> <i>Want to know what I can do? Just type <b>&#8220;What can you do&#8221;</b> to check out.</i> ^^</p></div></div>");
      $('.current_message').hide();
      $('.current_message').delay(250).fadeIn();
      $('.current_message').removeClass('current_message');
}
//Chatbot reply user message
var counter = 0;
function robotReply(data,msg){
  var displayBotMsg = $('.chatlogs').html();
  var intent = ""
  intent = data.intentName;
  var displayBotMsg = $('.chatlogs').html();

  if(intent == "Default Fallback Intent"){
    $('.chatlogs').html(displayBotMsg + "<div class = 'current_message'><div class = 'robot' id='removeThis"+counter+"'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
    "<form><p>" + data.fulfilmentText + "<br>You may request for follow up here:<br>" +
    "<input disabled value= 'Your question: " + msg.replace(/'/g,"\&#039;").replace("\"","\&quot;") +"' id='disabled' type='text' style='color:black;'>"+
    "<input id='"+ counter+ "' type='email' placeholder='Email'><button id='querySend' type='submit' onclick='sendQuery(event,&#039;"+counter+"&#039;,&#039;"+ msg.replace(/'/g,"\&#039;").replace("\"","\&quot;") +"&#039;)'>Send</button></p></form>" +
    "</div>" + "</div>");

    $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
    var collection = document.getElementsByClassName("current_message");
    collection[0].style.opacity="0";
    $('.current_message').animate({ opacity: 1 })
    $('.current_message').removeClass('current_message');
    $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
    counter++;
  }
  else if(intent == "reportProblem"){
    hideDiv();
  }
  else if(intent == "askEndIntent" || intent =="exitConversation"){

    $('.chatlogs').html(displayBotMsg + "<div class = 'current_message'><div class = 'robot' id='thisConversation"+gb+"'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
    "<p>" + data.fulfilmentText +
    "<br><span  onmouseover='starmark(this)' onclick='result(event,this,"+gb+")' id='1one' style='font-size:40px;cursor:pointer;color:black;'  class='fa fa-star'></span>"+
    "<span onmouseover='starmark(this)' onclick='result(event,this,"+gb+")' id='2one' style='font-size:40px;cursor:pointer;color:black;'  class='fa fa-star'></span>"+
    "<span onmouseover='starmark(this)' onclick='result(event,this,"+gb+")' id='3one' style='font-size:40px;cursor:pointer;color:black;'  class='fa fa-star'></span>"+
    "<span onmouseover='starmark(this)' onclick='result(event,this,"+gb+")' id='4one' style='font-size:40px;cursor:pointer;color:black;'  class='fa fa-star'></span>"+
    "<span onmouseover='starmark(this)' onclick='result(event,this,"+gb+")' id='5one' style='font-size:40px;cursor:pointer;color:black;'  class='fa fa-star'></span>"+
    "</p></div>" + "</div>");

    gb++;

    $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
    var collection = document.getElementsByClassName("current_message");
    collection[0].style.opacity="0";
    $('.current_message').animate({ opacity: 1 })
    $('.current_message').removeClass('current_message');

  }
  else if(intent == "askFeedback"){

    var adsDetail = new Object();
    //Get advertisement or events
    var getAds = new XMLHttpRequest();
    getAds.open('GET','https://final-year-project-260106.appspot.com?type=get_rand_ad',true);
    getAds.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                  adsDetail = JSON.parse(getAds.responseText); //data become javascript object

                  var title = adsDetail["title"];
                  var startDate = adsDetail["startDate"];
                  var endDate = adsDetail["endDate"];
                  var startTime = adsDetail["startTime"];
                  var endTime = adsDetail["endTime"];
                  var note = adsDetail["note"];
                  var pic = adsDetail["img"];

                  $('.chatlogs').html(displayBotMsg += "<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                  "<p>" + data.fulfilmentText + "</p>" + "</div>" + "</div>");
                  $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                  var collection = document.getElementsByClassName("current_message");
                  collection[0].style.opacity="0";
                  $('.current_message').animate({ opacity: 1 })
                  $('.current_message').removeClass('current_message');
                  setTimeout(function(){
                    //display ads
                        if(note==null){
                          $('.chatlogs').html(displayBotMsg +"<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                          "<p><b style='font-size:30px;text-align:center;'>" + title+ "</b><br>Start Date: "+ startDate+ "<br>End Date: " + endDate + "<br>Start Time: " + startTime + "<br>End Time: " + endTime +
                          "<br><img src=' " + pic + "' style='width:200px;height:200px;'></p>" + "</div>" + "</div>");
                          $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                          var collection = document.getElementsByClassName("current_message");
                          collection[0].style.opacity="0";
                          $('.current_message').animate({ opacity: 1 })
                          $('.current_message').removeClass('current_message');
                        }
                        else if(pic==null){
                          $('.chatlogs').html(displayBotMsg +"<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                          "<p><b style='font-size:30px;text-align:center;'> " + title+ "</b><br>Start Date: "+ startDate+ "<br>End Date: ;" + endDate + "<br>Start Time: " + startTime + "<br>End Time: " + endTime + "<br><i style='color:black;'>"+
                          note + "</i></p>" + "</div>" + "</div>");
                          $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                          var collection = document.getElementsByClassName("current_message");
                          collection[0].style.opacity="0";
                          $('.current_message').animate({ opacity: 1 })
                          $('.current_message').removeClass('current_message');
                        }
                        else if(note == null && pic == null){
                          $('.chatlogs').html(displayBotMsg +"<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                          "<p><b style='font-size:30px;text-align:center;'>" + title+ "</b><br>Start Date: "+ startDate+ "<br>End Date: " + endDate + "<br>Start Time: " + startTime + "<br>End Time: " + endTime + "</p>" + "</div>" + "</div>");
                          $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                          var collection = document.getElementsByClassName("current_message");
                          collection[0].style.opacity="0";
                          $('.current_message').animate({ opacity: 1 })
                          $('.current_message').removeClass('current_message');
                        }
                        else{
                            $('.chatlogs').html(displayBotMsg +"<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                            "<p><b style='font-size:30px;text-align:center;'>" + title+ "</b><br>Start Date: "+ startDate+ "<br>End Date: " + endDate + "<br>Start Time: " + startTime + "<br>End Time: " + endTime +
                            "<br><img src=' " + pic + "' style='width:200px;height:200px;'><br><i style='color:black;'>" +note + "</i></p></div>" + "</div>");
                            $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                            var collection = document.getElementsByClassName("current_message");
                            collection[0].style.opacity="0";
                            $('.current_message').animate({ opacity: 1 })
                            $('.current_message').removeClass('current_message');
                        }
                  }, 1200);

                }//200
                else{
                  alert("Error occurred, please try again.");
                }
              }//4
            }//onreadystatechange
    getAds.withCredentials = true;
    getAds.send();
    //End get ads or events

  }

  else{
    $('.chatlogs').html(displayBotMsg + "<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
    "<p>" + data.fulfilmentText + "</p>" + "</div>" + "</div>");
    $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
    var collection = document.getElementsByClassName("current_message");
    collection[0].style.opacity="0";
    $('.current_message').animate({ opacity: 1 })
    $('.current_message').removeClass('current_message');
  }

}

function openForm() {
  document.getElementById("myForm").style.display = "block";
  $('.fixed-action-btn').html("");
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  $('.fixed-action-btn').html("<button class='open-button btn-floating btn-large pulse' ><i class= 'large material-icons' onclick= 'openForm()' id='pulse-btn'>chat</i></button>");
}
//Hide Textbox to display captcha
function hideTextbox(){
  var hideThis = document.getElementById("c3");
  var showThis = document.getElementById("e1");
  if(hideThis.style.display === "none"){
    hideThis.style.display = "block";
  }
  else{
    hideThis.style.display = "none";
    e1.style.display = "block";
  }
}
//End Hide textbox

function hideDiv(){
  var hidden1 = document.getElementById("c1");
  var hidden2 = document.getElementById("c2");
  var hidden3 = document.getElementById("c3");
  var show = document.getElementById("d2");
  if(hidden1.style.display === "none" && hidden2.style.display === "none" && hidden3.style.display === "none"){
    hidden1.style.display = "block";
    hidden2.style.display = "block";
    hidden3.style.display = "block";
  }
  else{
    hidden1.style.display = "none";
    hidden2.style.display = "none";
    hidden3.style.display = "none";
    d2.style.display = "block";
  }
}
function displayChat(){
  var display1 = document.getElementById("c1");
  var display2 = document.getElementById("c2");
  var display3 = document.getElementById("c3");
  var hide = document.getElementById("d2");
  if(hide.style.display === "none"){
    hide.style.display = "block";
  }
  else{
    hide.style.display = "none";
    display1.style.display = "block";
    display2.style.display = "block";
    display3.style.display = "block";
  }
}
function receiveWord(){ //onkeydown effects
  var name = document.getElementById("name").value;
  var problem = document.getElementById("problem").value;

  if(name!= "" && problem!=""){
      $("#reportSend").removeClass("disabled");
      $("#reportSend").addClass("pulse");
  }
  else{
    $("#reportSend").removeClass("pulse");
    $("#reportSend").addClass("disabled");
  }
}//End of onkeydown effects

//Send user inquiry
function sendQuery(e,counter,msg){
  e.preventDefault();
  var email = document.getElementById(counter).value;
  var query = ""
  query = msg;
  var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  if(!re.test(email))
    return;
  var sendUserQuery = new XMLHttpRequest();
  sendUserQuery.open("POST", "https://final-year-project-260106.appspot.com/", true);
  sendUserQuery.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var displayBotMsg = $('.chatlogs').html();
  if(query != ""){
    sendUserQuery.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                var statusData = JSON.parse(sendUserQuery.responseText); //data become javascript object



                    if(statusData['status'] == "success"){ //data received is success
                      $('.chatlogs').html(displayBotMsg + "<div class = 'current_message'><div class = 'robot'><img class='picture-robot' src= 'images/ebee2.jpg'></img>" +
                      "<p>Follow-up requested successfully! We will get in touch with you soon.</p>" + "</div>" + "</div>");
                      $(".chatlogs").scrollTop($(".chatlogs").prop("scrollHeight"));
                      $('.current_message').hide();
                      $('.current_message').delay(250).fadeIn();
                      $('.current_message').removeClass('current_message');
                      document.getElementById("removeThis"+counter).remove();
                    }
              }
              else{
                  alert("Error Occur!!");
              }
        }//end readyState
      }//end onreadystatechange
      sendUserQuery.withCredentials = true;
      sendUserQuery.send("type=follow_ups_push&message=" + query + "&email=" +email);
  }
  else{
    alert("Email is required!");
  }


}
//End of send user inquiry

//Hover rating starValue
function starmark(item){
  thisCount=item.id[0];
  sessionStorage.starRating = thisCount;
  var subid= item.id.substring(1);
    for(var i=0;i<5;i++)
    {
      if(i<thisCount)
      {
        document.getElementById((i+1)+subid).style.color="orange";
      }
      else
      {
        document.getElementById((i+1)+subid).style.color="black";
      }

    }
}
//End hover rating star

//Rating star and pass value to server
var starValue;
function result(e,item,gb){
  e.preventDefault();
  starValue=item.id[0];
  sessionStorage.starRating = starValue;
  var subid= item.id.substring(1);

  for(var i=0;i<5;i++){
    if(i<starValue){
      document.getElementById((i+1)+subid).style.color="orange";
    }
    else{
      document.getElementById((i+1)+subid).style.color="black";
    }
  }

  var ratingValue = new XMLHttpRequest(); //request to get the chatbot message from the server
  ratingValue.open('GET','https://final-year-project-260106.appspot.com/?type=query&text=' + starValue);

  ratingValue.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var ourData = JSON.parse(ratingValue.responseText); //data become javascript object
        $("#thisConversation"+gb).remove();
        var intent = ourData.intentName;
        if(intent == "askFeedback"){
          robotReply(ourData,starValue); // Robot reply
        }
      }
  };
  ratingValue.withCredentials = true;
  ratingValue.send();

}
function recaptcha(){
  var hideThis = document.getElementById("c3");
  var showThis = document.getElementById("e1");
  if(showThis.style.display === "none"){
    showThis.style.display = "block";
  }
  else{
    showThis.style.display = "none";
    hideThis.style.display = "block";
  }
}
