var key = "";//global key to get docKey
var currentPage = 1;
var maxPage = 1;

$(document).ready(function(){
  $("#imgInp").change(function() {
    readURL(this, '#eventImg');
  });
  $("#imgUpload").change(function() {
    readURL(this, '#eventPubImg');
  });
  $(".datepicker").datepicker({
    format:'dd-mm-yyyy'
  });

  $('.timepicker').timepicker({
    twelveHour: false
  });
  //Pull out ads list
  var maList = new XMLHttpRequest();
  maList.open('GET','https://final-year-project-260106.appspot.com/?type=pull_ad_list&limit=10',true);
  maList.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(maList.responseText); //data become javascript object
                showMAList(statusData);
              }
            }
          }
  maList.withCredentials = true;
  maList.send();
  //End pull out ads list

  //Call server to ask for pagination
  var pagination = new XMLHttpRequest();
  var i = 1;
  var pageNum = "";
  var page = $(".pagination").html();
  pagination.open('GET','https://final-year-project-260106.appspot.com/?type=get_ad_list_pages&limit=10',true);
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

});//End of ready document

//Output summary of ads list
function showMAList(statusData){
  var i=0;
  var data = statusData['data'];
  var elementString = "";

  for(i=0; i<Object.keys(data).length; i++){
    var entry = data[i];
    elementString += "<tr><td>" + parseInt((i+1)) + "</td><td>" + entry['startDate'] + "</td><td>" +
    entry['endDate'] + "</td><td>" + entry['startTime'] + "</td><td>" + entry['endTime'] +
    "</td><td id='titleLeft' class='truncate'>" + entry['title'] +"</td>"+
    "<td><a class='waves-effect waves-light btn modal-trigger' onclick=viewDetailAds(event,&#039;"+entry['docKey']+"&#039;) href='#modalDetailAds'>View</a>"+
    "<a href='#' onclick='deleteThisRequest(event,&#039;"+entry['docKey']+"&#039;)' class='btn-floating btn-medium btn tooltipped' data-position='top' data-tooltip='Remove' id='dustbin'>"+
    "<i class='material-icons' >delete_forever</i></a></td></tr>";
  }
  $("#manageAdsList").html(elementString);
  $('.tooltipped').tooltip();
}
//End of summary ads list

//Sort by function
var sortBy = "";
var orderBy = "";
function sort(option){
  switch (option) {
    case '1':
          sortBy = "&sortBy=startDate";
      break;
    case '2':
          sortBy = "&sortBy=endDate";
      break;
    case '3':
          orderBy = "&orderBy=ASC";
      break;
    case '4':
          orderBy = "&orderBy=DESC";
      break;

  }
  var sort = new XMLHttpRequest();
  sort.open('GET','https://final-year-project-260106.appspot.com/?type=pull_ad_list&limit=10&page='+currentPage+sortBy+orderBy,true);
  sort.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(sort.responseText); //data become javascript object
                showMAList(statusData);
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

  selectedPageReportDetail.open('GET','https://final-year-project-260106.appspot.com/?type=pull_ad_list&limit=10&page='+currentPage+sortBy+orderBy,true);
  selectedPageReportDetail.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(selectedPageReportDetail.responseText); //data become javascript object
                showMAList(statusData);
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

//Pop out Events/ Ads detail
function viewDetailAds(e,data){
  e.preventDefault();
  key = data;
  var pullAds = new XMLHttpRequest();
  pullAds.open('GET','https://final-year-project-260106.appspot.com/?type=pull_ad&docKey='+data,true);
  pullAds.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                  var statusData = JSON.parse(pullAds.responseText); //data become javascript object
                  if(statusData["status"]=="success"){
                    $('#title').val(statusData['title']);
                    $('#documentKey').val(key);
                    $('#titleLabel').addClass('active');
                    $('#startDate').val(statusData['startDate']);
                    $('#startDateLabel').addClass('active');
                    $('#endDate').val(statusData['endDate']);
                    $('#endDateLabel').addClass('active');
                    $('#startTime').val(statusData['startTime']);
                    $('#startTimeLabel').addClass('active');
                    $('#endTime').val(statusData['endTime']);
                    $('#endTimeLabel').addClass('active');
                    if(statusData['note'] != null){
                      $('#note').val(statusData['note']);
                      $('#noteLabel').addClass('active');
                    }
                    if(statusData['img'] != null){
                      $('#eventImg').attr('src', statusData['img']);
                    }else{
                      $('#eventImg').attr('src', '');
                    }




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
    pullAds.withCredentials = true;
    pullAds.send();
}
//End pop out Events/ Ads detail

//Delete event
function deleteThisRequest(e,data){
  e.preventDefault();
  key = data;
  var getConfirm = confirm("Do you want to delete this event?");
  var del = new XMLHttpRequest();

  if (getConfirm == true){
    del.open('GET','https://final-year-project-260106.appspot.com/?type=delete_ad&docKey='+key,true);
    del.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                    var statusData = JSON.parse(del.responseText); //data become javascript object
                      if(statusData["status"]=="success"){
                        sort(5);
                        M.toast({html: 'Event deleted!', classes: 'yellow black-text pulse'});
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
//End of delete event

//Update form
function update(e){
  e.preventDefault();
  var form = document.getElementById("eventDetailsForm");
  var formData = new FormData(form);
  var eTitle = document.getElementById("title").value;
  var sDate = document.getElementById("startDate").value;
  var eDate = document.getElementById("endDate").value;
  var sTime = document.getElementById("startTime").value;
  var eTime = document.getElementById("endTime").value;
  
  var updateForm = new XMLHttpRequest();
  if(eTitle != "" && sDate !="" && eDate != "" && sTime != "" && eTime != ""){

    updateForm.open("POST", "https://final-year-project-260106.appspot.com/", true);
    //updateForm.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    updateForm.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                    var statusData = JSON.parse(updateForm.responseText); //data become javascript object
                        if(statusData["status"]=="success"){
                          M.toast({html: 'Event updated!', classes: 'yellow black-text pulse'});
                          sort(5);
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
      updateForm.withCredentials = true;
      updateForm.send(formData);
    } //End no empty value
    else{
      M.toast({html: 'Event title, date and time cannot be empty!', classes: 'red black-text pulse'});
    }
}
//End update formData

//Show upload image
function readURL(input, elem) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $(elem).attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}
//End upload image

function publishButton(event){
  event.preventDefault();
    $("#publishEventsBtn").html("Publish");
    document.getElementById("publishEventsBtn").disabled = false;
    document.getElementById("filePath").value="";
    document.getElementById("titleP").value="";
    document.getElementById("startDateP").value="";
    document.getElementById("endDateP").value="";
    document.getElementById("startTimeP").value="";
    document.getElementById("endTimeP").value="";
    document.getElementById("noteP").value="";
    $("#eventPubImg").attr("src",' ');
}

//button for publish event
function publish(event){
  event.preventDefault();
  var form = document.getElementById("eventPublishForm");
  var formData = new FormData(form);
  var eTitle = document.getElementById("titleP").value;
  var sDate = document.getElementById("startDateP").value;
  var eDate = document.getElementById("endDateP").value;
  var sTime = document.getElementById("startTimeP").value;
  var eTime = document.getElementById("endTimeP").value;

  var publishForm = new XMLHttpRequest();

  if(eTitle != "" && sDate !="" && eDate != "" && sTime != "" && eTime != ""){
    $("#publishEventsBtn").html("Publishing");
    document.getElementById("publishEventsBtn").disabled = true;
    publishForm.open("POST", "https://final-year-project-260106.appspot.com/", true);
    //updateForm.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    publishForm.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                    var statusData = JSON.parse(publishForm.responseText); //data become javascript object

                      if(statusData["status"]=="success"){
                        M.toast({html: 'Event published!', classes: 'yellow black-text pulse'});
                        sort(5);
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
      publishForm.withCredentials = true;
      publishForm.send(formData);
      } //End no empty value
      else{
        M.toast({html: 'Event title, date and time cannot be empty!', classes: 'red black-text pulse'});
      }
}
//End button for publish event
