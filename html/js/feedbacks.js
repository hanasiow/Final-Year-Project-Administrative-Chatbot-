var key = "";//global key to get docKey
var currentPage = 1;
var maxPage = 1;

$(document).ready(function(){
  //List out feedbacks
  var fList = new XMLHttpRequest();
  fList.open('GET','https://final-year-project-260106.appspot.com/?type=pull_logs_list',true);
  fList.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(fList.responseText); //data become javascript object
                showFList(statusData);
              }
            }
          }
  fList.withCredentials = true;
  fList.send();
  //End of the feedback list

//Call server to ask for pagination
  var pagination = new XMLHttpRequest();
  var i = 1;
  var pageNum = "";
  var page = $(".pagination").html();
  pagination.open('GET','https://final-year-project-260106.appspot.com/?type=get_log_list_pages&limit=10',true);
  pagination.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(pagination.responseText); //data become javascript object
                if(statusData["status"]=="success"){
                    while(statusData["pages"] >= i){
                      maxPage = statusData["pages"];
                      pageNum += "<li class='waves-effect' id='active"+i+"'><a href='#' onclick='redirectToPageNum(event,"+i+")' class='pages white-text'>" + i + "</a></li>";
                      i++;
                    }//End while

                      var elemNextPage = currentPage;
                      var elemPrevPage = currentPage;
                      if(currentPage < maxPage)
                          elemNextPage += 1;
                      if(currentPage > 1)
                          elemPrevPage -= 1;

                      $(".pagination").html("<li class='waves-effect'><a href='' id='previousPage' onclick='redirectToPageNum(event," + (elemPrevPage) +")'><i class='material-icons white-text'>chevron_left</i></a></li>" +
                      page + pageNum + "<li class='waves-effect'><a href='#' id='nextPage' onclick='redirectToPageNum(event,"+(elemNextPage)+")'><i class='material-icons white-text'>chevron_right</i></a></li>");

                }//success
                $("#active"+currentPage).attr("class","active teal lighten-2");
              }//200
            }//4
          }//onreadystatechange
  pagination.withCredentials = true;
  pagination.send();
  //End request for pagination


});//End ready document


//Show summary of feedbacks list
function showFList(statusData){
  var i=0;
  var data = statusData['data'];
  var elementString = "";


  for(i=0; i<Object.keys(data).length; i++){
    var entry = data[i];
    var rateString = entry["rating"];
    var rateInt = parseInt(rateString);
    var starString = ""
    if(rateInt < 1){
      for(ii=0; ii<5; ii++)
        starString += "<span class='fa fa-star'></span>";
    }
    else{
      for(ii=0; ii<5; ii++){
        if(ii<rateInt){
          starString += "<span class='fa fa-star checked'></span>";
        }
        else{
          starString += "<span class='fa fa-star'></span>";
        }
      }
    }
    elementString += "<tr><td>" + parseInt((i+1)) + "</td><td>" + entry['logDate'] + "</td><td>" +
    starString + "</td><td><a class='waves-effect waves-light btn modal-trigger' onclick=getFList(event,&#039;"+entry['docKey']+"&#039;) href='#FListModal'>View</a>"+
    "<a href='#' onclick='deleteThisRequest(event,&#039;"+entry['docKey']+"&#039;)' class='btn-floating btn-medium btn tooltipped' data-position='top' data-tooltip='Remove' id='dustbin'><i class='material-icons' >delete_forever</i></a></td></tr>";


  }

  $("#feedbacksList").html(elementString);
}
//End of summary feedback list

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

  selectedPageReportDetail.open('GET','https://final-year-project-260106.appspot.com/?type=pull_logs_list&limit=10&page='+currentPage+sortBy+orderBy,true);
  selectedPageReportDetail.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(selectedPageReportDetail.responseText); //data become javascript object
                showFList(statusData);
                $(".pagination").on('click',"#active"+data,function(e){
                  e.preventDefault();
                  $("#active"+currentPage).attr("class","active teal lighten-2");
                });

              }//200
            }//4
          }//onreadystatechange
  selectedPageReportDetail.withCredentials = true;
  selectedPageReportDetail.send();
}
//End of redirect selected page

//Sort by function
var sortBy = "";
var orderBy = "";
function sort(option){
  switch (option) {
    case '1':
          sortBy = "&sortBy=date";
      break;
    case '2':
          sortBy = "&sortBy=rating";
      break;
    case '3':
          orderBy = "&orderBy=ASC";
      break;
    case '4':
          orderBy = "&orderBy=DESC";
      break;

  }
  var sort = new XMLHttpRequest();
  sort.open('GET','https://final-year-project-260106.appspot.com/?type=pull_logs_list&limit=10&page='+currentPage+sortBy+orderBy,true);
  sort.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(sort.responseText); //data become javascript object
                showFList(statusData);
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

//Pop out log
function getFList(e,data){
  e.preventDefault();
  key = data;
  var getLog = new XMLHttpRequest();
  getLog.open('GET','https://final-year-project-260106.appspot.com/?type=pull_log&docKey='+data,true);
  getLog.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                  var statusData = JSON.parse(getLog.responseText); //data become javascript object
                  if(statusData["status"]=="success"){
                  $("#fDate").val(statusData["dateTime"]);
                  $("#labelDate").addClass('active');
                  var i = 0;
                  var req = statusData["request"];
                  var resp = statusData["response"];
                  var elementString = "";
                  var rateString = statusData["rating"];
                  var rateInt = parseInt(rateString);
                  var starString = ""

                  for(i=0; i<Object.keys(req).length; i++){
                    elementString += "<div class='input-field col s12'>"+
                      "<textarea id='logRequest' disabled  type='text' class='materialize-textarea white-text'>"+ req[i.toString()] +"</textarea>"+
                      "<label  id='labelRequest' for='logRequest' class='teal-text text-lighten-2 active'>Student question:</label>"+
                    "</div></div>";

                    elementString += "<div class='row'><div class='input-field col s12'>"+
                      "<textarea id='logResponse' disabled type='text' class='materialize-textarea white-text'>" + resp[i.toString()] +"</textarea>"+
                      "<label  id='labelResponse' for='logResponse' class='teal-text text-lighten-2 active'>Chatbot response:</label>"+
                    "</div></div>";
                  }
                  $("#rowRequestAndResponse").html(elementString);

                  for(i=0; i<rateInt; i++){
                    if(rateInt!=0){
                      starString += "<span class='fa fa-star checked'></span>";
                    }
                    else{
                      starString += "<span class='fa fa-star'></span>";
                    }
                  }
                  $("#starStringAppear").html("<label id='labelStar' class='teal-text text-lighten-2 active'>Rating:</label><br>"+starString);
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
    getLog.withCredentials = true;
    getLog.send();
  }

//End pop out log

//Delete problem report details
function deleteThisRequest(e,data){
  e.preventDefault();
  key = data;
  var getConfirm = confirm("Do you want to delete this feedback?");
  var del = new XMLHttpRequest();

  if (getConfirm == true){
    del.open('GET','https://final-year-project-260106.appspot.com/?type=delete_log&docKey='+key,true);
    del.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                    var statusData = JSON.parse(del.responseText); //data become javascript object
                      if(statusData["status"]=="success"){
                        sort(5);
                        M.toast({html: 'Deleted!', classes: 'yellow black-text pulse'});
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
