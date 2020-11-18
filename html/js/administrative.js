// Confirmation user is login
var loginRequest = new XMLHttpRequest();
loginRequest.open('GET','https://final-year-project-260106.appspot.com/?type=login_check',true);

loginRequest.onreadystatechange = function(){
    if(this.readyState == 4){
          if(this.status==200){
              var statusData = JSON.parse(loginRequest.responseText); //received data become javascript object
              if(statusData['loggedIn'] == "false"){
                window.location.href = ("login.html");
              }
          }
          else{
              alert("Error Occured!!");
          }
    }
}
loginRequest.withCredentials = true;
loginRequest.send();
// End of Confirmation



$(document).ready(function(){
  // Init Modal
  $('.modal').modal();

  //Mobile side-nav
  $(".button-collapse").sideNav();

  // Init Slider
  $('.slider').slider();

  //Dropdown
  $(".dropdown-trigger").dropdown();

  //redirect to administrative page
  $('.nav-content').on('click','#mtn',function(e){
    e.preventDefault();
    window.location.href = ("administrative.html");
  });

  //redirect to problemReport page
  $('.nav-content').on('click','#pr',function(e){
    e.preventDefault();
    window.location.href = ("problemReport.html");
  });

  //redirect to feedback
  $('.nav-content').on('click','#fb',function(e){
    e.preventDefault();
    window.location.href = ("feedbacks.html");
  });

  //redirect to follow up request
  $('.nav-content').on('click','#fr',function(e){
    e.preventDefault();
    window.location.href = ("followUpRequests.html");
  });

  //redirect to manage ad
  $('.nav-content').on('click','#ma',function(e){
    e.preventDefault();
    window.location.href = ("manageAds.html");
  });

//clicking add new user
$('.nav-wrapper').on('click','.addUser',function(e){
  document.getElementById("status").innerHTML= "";
});
//end of click add new user */

//ADD NEW USER FORM
  $('#addUserForm').on('submit',function(e){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://final-year-project-260106.appspot.com/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // tell server what type you are sending (form type...)
    e.preventDefault();
    var username = document.getElementById("icon_prefix_un").value;
    var password1 = document.getElementById("icon_prefix_pw1").value;
    var password2 = document.getElementById("icon_prefix_pw2").value;



    xhttp.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(xhttp.responseText); //data become javascript object
                    if(password1 == password2 && username!=""){
                        if(statusData['status'] == "success"){ //data received is success
                          document.getElementById("status").innerHTML= statusData['message'];
                          document.getElementById("icon_prefix_un").value="";//clear username;
                          document.getElementById("icon_prefix_pw1").value="";//clear password;
                          document.getElementById("icon_prefix_pw2").value="";//clear password;
                          event.preventDefault();
                        }
                        else if(statusData['status'] == "fail"){
                          duplicateInfo(statusData); //call function
                        }
                        else{
                          redirectToLogin(); //call function
                        }
                    }
                    else{
                      errorMatchingPw(); //call function
                    }
            }
            else{
                alert("Error Occur!!");
            }
      }
  };
  xhttp.withCredentials = true;
  xhttp.send("type=register&id=" + username + "&password=" +password1); //send username and password to server
  });
// END OF ADD NEW USER FORM

//View User Form
$('.nav-wrapper').on('click','.userList',function(e){
  var viewUser = new XMLHttpRequest();
  viewUser.open('GET','https://final-year-project-260106.appspot.com/?type=pull_users',true);
  viewUser.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(viewUser.responseText); //data become javascript object
                showUserList(statusData);

            }
            else{
                alert("Error Occur!!");
            }
      }
  };
  viewUser.withCredentials = true;
  viewUser.send();

});//End of View User

//LOGOUT
$('.nav-wrapper').on('click','.getOut',function(e){
  var logOutRequest = new XMLHttpRequest();
  logOutRequest.open('GET','https://final-year-project-260106.appspot.com/?type=logout',true);
  logOutRequest.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                window.location.href = ("login.html");
            }
            else{
                alert("Error Occur!!");
            }
      }
  };
  logOutRequest.withCredentials = true;
  logOutRequest.send();
});//End of logout

});//End of ready(function())

//Add new user duplicate info
function duplicateInfo(statusData){
  document.getElementById("status").innerHTML = statusData['message'];
  document.getElementById("icon_prefix_un").value="";//clear username;
  document.getElementById("icon_prefix_pw1").value="";//clear password;
  document.getElementById("icon_prefix_pw2").value="";//clear password;
  event.preventDefault();
}//End of duplicateInfo()

//Logout and redirect to login page
function redirectToLogin(){
  window.location.href = ("login1.html");
}//End of redirectToLogin()

//Error Matching password have to clear all input details
function errorMatchingPw(){
  document.getElementById("status").innerHTML = "Password does not match";
  document.getElementById("icon_prefix_un").value="";//clear username;
  document.getElementById("icon_prefix_pw1").value="";//clear password;
  document.getElementById("icon_prefix_pw2").value="";//clear password;
  event.preventDefault();
}// End of errorMatchingPw()

//onkeydown effects
function receiveWord(){
  var a = document.getElementById("icon_prefix_un").value;
  var b = document.getElementById("icon_prefix_pw1").value;
  var c = document.getElementById("icon_prefix_pw2").value;

  var transform = $("button").html();
  document.getElementById("status").innerHTML= "";
  if(a!= "" && b!="" && c!=""){
      $("button").replaceWith("<button type='submit' class='waves-effect waves-light btn pulse' style='margin-left:140px;'>Confirm</button>");
  }
  else{
    $("button").replaceWith("<button type='submit' class='waves-effect waves-light btn disabled' style='margin-left:140px;'>Confirm</button>");
  }
}//End of onkeydown effects

//call user list function
function showUserList(statusData){
  var i=0;
  var data = statusData['data'];
  var elementString = "";


  for(i=0; i<Object.keys(data).length; i++){
    var entry = data[i];
    elementString += "<li class='collection-item avatar'><i class='material-icons circle green'>person</i>"+"<span class='title'><br>"
    + entry['id'] +"</span><a href='#' onclick='deleteUser(&#039;"+entry['docKey']+"&#039;)' class='secondary-content'><i class='material-icons' id='del'>close</i></a></li>";

  }
  $("#ulist").html(elementString);
}
//End of call user list function

//Delete users
function deleteUser(entry){
  var deleteChip = new XMLHttpRequest();
  var ques = confirm("Delete user?");

  if(ques == true){
    deleteChip.open('GET','https://final-year-project-260106.appspot.com/?type=delete_user&docKey='+entry,true);
    deleteChip.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
              updateUserList();
            }
            else{
                alert("Error Occur!!");
            }
      }//End this.readyState
    }//End deleteChip.onreadystatechange
    deleteChip.withCredentials = true;
    deleteChip.send();
  }//End if(ques)
  else{

  }
}//End of delete users

//After delete user update user list
function updateUserList(){
  var update = new XMLHttpRequest();
  update.open('GET','https://final-year-project-260106.appspot.com/?type=pull_users',true);
  update.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(update.responseText); //data become javascript object
                showUserList(statusData);

            }
            else{
                alert("Error Occur!!");
            }
      }
  };
  update.withCredentials = true;
  update.send();
}
//End updated user list
