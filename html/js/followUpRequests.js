var key = "";//global key to get docKey
var currentPage = 1;
var maxPage = 1;

$(document).ready(function(){
//List out follow-up requests
var requests = new XMLHttpRequest();
requests.open('GET','https://final-year-project-260106.appspot.com/?type=pull_follow_ups_list&limit=10',true);
requests.onreadystatechange = function(){
    if(this.readyState == 4){
          if(this.status==200){
              var statusData = JSON.parse(requests.responseText); //data become javascript object
              showRequestList(statusData);
            }
          }
        }
requests.withCredentials = true;
requests.send();
//End of list of problem report

//Call server to ask for pagination
var pagination = new XMLHttpRequest();
var i = 1;
var pageNum = "";
var page = $(".pagination").html();
pagination.open('GET','https://final-year-project-260106.appspot.com/?type=pull_follow_ups_list_pages&limit=10',true);
pagination.onreadystatechange = function(){
    if(this.readyState == 4){
          if(this.status==200){
              var statusData = JSON.parse(pagination.responseText); //data become javascript object
              if(statusData["status"]=="success"){
                while(statusData["pages"] >= i){
                  maxPage = statusData["pages"];

                  pageNum += "<li class='waves-effect' id='active"+i+"'><a href='#' onclick='redirectToPageNum(event,"+i+")' class='pages white-text'>" + i + "</a></li>";

                  i++;
                }
                var elemNextPage = currentPage;
                var elemPrevPage = currentPage;
                if(currentPage < maxPage)
                  elemNextPage += 1;
                if(currentPage > 1)
                  elemPrevPage -= 1;
                $(".pagination").html("<li class='waves-effect'><a href='#' id='previousPage' onclick='redirectToPageNum(event," + (elemPrevPage) +")'><i class='material-icons white-text'>chevron_left</i></a></li>" +
                  page + pageNum + "<li class='waves-effect'><a href='#' id='nextPage' onclick='redirectToPageNum(event,"+(elemNextPage)+")'><i class='material-icons white-text'>chevron_right</i></a></li>");

              }
              $("#active"+currentPage).attr("class","active teal lighten-2");
            }//200
          }//4
        }//onreadystatechange
pagination.withCredentials = true;
pagination.send();
//End request for pagination

}); //End of ready document

//Call function to show Follow-up Request list
function showRequestList(statusData){
  var i=0;
  var data = statusData['data'];
  var elementString = "";

  for(i=0; i<Object.keys(data).length; i++){
    var entry = data[i];
    elementString += "<tr><td>" + parseInt((i+1)) + "</td><td>" + entry['dateTime'] + "</td><td>" + entry['email'] + "</td><td id='requestMsg' class='truncate'>" +
    entry['message'] + "</td><td><a href='#replyHere' onclick='replyRequest(event,&#039;"+entry['docKey']+
    "&#039;,&#039;"+ entry['message']+"&#039;)' class='btn-floating btn-medium btn tooltipped' data-position='left' data-tooltip='Reply' ><i class='material-icons' >reply</i></a>"+
    "<a href='#' onclick='deleteThisRequest(event,&#039;"+entry['docKey']+"&#039;)' class='btn-floating btn-medium btn tooltipped' data-position='top' data-tooltip='Remove' id='dustbin'><i class='material-icons' >delete_forever</i></a></td></tr>";
  }

  $("#followUpRequestsList").html(elementString);
  $('.tooltipped').tooltip();
}
//End of displaying follow-up request list

//Sort by function
var orderBy = "";
function sort(option){
  switch (option) {
    case '3':
          orderBy = "&orderBy=ASC";
      break;
    case '4':
          orderBy = "&orderBy=DESC";
      break;

  }
  var sort = new XMLHttpRequest();
  sort.open('GET','https://final-year-project-260106.appspot.com/?type=pull_follow_ups_list&limit=10&page='+currentPage+orderBy,true);
  sort.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(sort.responseText); //data become javascript object
                showRequestList(statusData);

            }
            else{
                alert("Error Occur!!");
            }
      }
  };
  sort.withCredentials = true;
  sort.send();
}
// End of Sort function

//Clicking page number to redirect selected page
function redirectToPageNum(e,data){
  e.preventDefault();
  currentPage = data;
  if(currentPage < maxPage)
    $('#nextPage').attr('onclick','redirectToPageNum(event,'+(currentPage+1)+')');

  if(currentPage > 1)
    $('#previousPage').attr('onclick','redirectToPageNum(event,'+(currentPage-1)+')');

    $(".pagination").children().attr("class","waves-effect");
    $("#active"+currentPage).attr("class","active teal lighten-2");

  var selectedPageReportDetail = new XMLHttpRequest();

  selectedPageReportDetail.open('GET','https://final-year-project-260106.appspot.com/?type=pull_follow_ups_list&limit=10&page='+currentPage+orderBy,true);
  selectedPageReportDetail.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(selectedPageReportDetail.responseText); //data become javascript object
                showRequestList(statusData);
                $(".pagination").on('click',"#active"+data,function(e){
                  e.preventDefault();
                  $("#active"+data).attr("class","active teal lighten-2");
                });

              }//200
            }//4
          }//onreadystatechange
  selectedPageReportDetail.withCredentials = true;
  selectedPageReportDetail.send();
}
//End of redirect selected page

//Delete problem report details
function deleteThisRequest(e,data){
  e.preventDefault();
  key = data;
  var getConfirm = confirm("Do you want to delete this follow-up request?");
  var del = new XMLHttpRequest();

  if (getConfirm == true){
    del.open('GET','https://final-year-project-260106.appspot.com/?type=followUp_delete&docKey='+key,true);
    del.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                    var statusData = JSON.parse(del.responseText); //data become javascript object
                      if(statusData["status"]=="success"){
                        sort(5);

                      }
                      else{
                      alert("Error occured!!!");
                      }
              }//200
              else{
                alert("Error occured!!!");
              }
          }//4 readyState
        }//onreadystatechange
        del.withCredentials = true;
        del.send();
  }//end of Confirming from user
}
//End of delete problem report details

//Reply request
function replyRequest(e,data,msg){
  e.preventDefault();
  key = data;
  var getSingleRequest = new XMLHttpRequest();

  getSingleRequest.open('GET','https://final-year-project-260106.appspot.com/?type=pull_follow_up&docKey='+data,true);
  getSingleRequest.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                  var statusData = JSON.parse(getSingleRequest.responseText); //data become javascript object
                  if(statusData["status"]=="success"){
                  $("#studentMsg").val(statusData["queryMessage"]);
                  $("#tag1").addClass('active');
                }
                else{
                  alert("Error occurred, please try again.");
                }

              }
              else{
                  alert("Error occured!!");
              }
        }//readyState
    }//onreadystatechange
    getSingleRequest.withCredentials = true;
    getSingleRequest.send();
  }

//Send Answer
function answer(e){
  e.preventDefault();
  var adminMessage = ""
  adminMessage = document.getElementById("adminMsg").value;
  var sendEmail = new XMLHttpRequest();

  if(adminMessage != ""){
    sendEmail.open("POST", "https://final-year-project-260106.appspot.com/", true);
    sendEmail.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendEmail.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                    var statusData = JSON.parse(sendEmail.responseText); //data become javascript object

                        if(statusData["status"]=="success"){
                          sort(5);
                          M.toast({html: 'Successfully sent!', classes: 'yellow black-text pulse'});
                          }
                          else{
                            alert("Please try again!!!");
                          }
              }//200
              else{
                alert("Error occured!!!");
              }
        }//4
      }//onreadystatechange
      sendEmail.withCredentials = true;
      sendEmail.send("type=followUp_reply&docKey=" + key + "&message=" + adminMessage);
  }//not an empty value to reply
  else{
    M.toast({html: 'Please enter your answer into the textbox!', classes: 'red black-text pulse'});
  }
}
// End of send answer

//textbox scrollbar
function changedValue() {
    let text = document.getElementById("adminMsg");
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
