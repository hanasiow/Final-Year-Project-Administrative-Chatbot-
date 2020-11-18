$(document).ready(function(){
  $('#login-form').on('submit',function(e){
    e.preventDefault();
    var username = document.getElementById("icon_prefix_un").value;
    var password = document.getElementById("icon_prefix_pw").value;


    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://final-year-project-260106.appspot.com/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.open('GET','https://final-year-project-260106.appspot.com/',true);

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                  var statusData = JSON.parse(xhttp.responseText); //data become javascript object
                      if(statusData['status'] == "success"){ //data received is success
                        document.getElementById("status").innerHTML = "";
                        window.location.href = ("administrative.html");
                      }
                      else{ //data received is unsuccess
                        //disabled the submit button
                        $("button").replaceWith("<button type='submit' id='transform' class='btn-small waves-effect waves-light btn disabled'>Login</button>");
                        //display error message
                        DisplayStatus(statusData); //call function
                      }
              }
              else{
                  alert("Error Occur!!");
              }
        }
    };

    xhttp.withCredentials = true;
    xhttp.send("type=login&id=" + username + "&password=" +password); //send username and password to server
  });
});
function receiveWord(){ //onkeydown effects
  var a = document.getElementById("icon_prefix_un").value;
  var b = document.getElementById("icon_prefix_pw").value;
  var transform = $("button").html();
  if(a!= "" && b!=""){
      $("button").replaceWith("<button type='submit' id='transform' class='btn-small waves-effect waves-light btn pulse'>Login</button>");
  }
  else{
    $("button").replaceWith("<button type='submit' id='transform' class='btn-small waves-effect waves-light btn disabled'>Login</button>");
  }
}
function DisplayStatus(statusData){ //unsuccessful login will clear username and password and display error msg
  document.getElementById("status").innerHTML = statusData['message'];
  document.getElementById("icon_prefix_un").value="";//clear username;
  document.getElementById("icon_prefix_pw").value="";//clear password;
  event.preventDefault();
}
