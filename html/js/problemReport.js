var key = "";//global key to get docKey
var currentPage = 1;
var maxPage = 1;
$(document).ready(function(){

    //List out problem report
    var reportList = new XMLHttpRequest();
    reportList.open('GET','https://final-year-project-260106.appspot.com/?type=pull_report_list&limit=10&page=1',true);
    reportList.onreadystatechange = function(){
        if(this.readyState == 4){
              if(this.status==200){
                  var statusData = JSON.parse(reportList.responseText); //data become javascript object
                  showList(statusData);
                }
              }
            }
    reportList.withCredentials = true;
    reportList.send();
    //End of list of problem report

    //Call server to ask for pagination
    var pagination = new XMLHttpRequest();
    var i = 1;
    var pageNum = "";
    var page = $(".pagination").html();
    pagination.open('GET','https://final-year-project-260106.appspot.com/?type=get_report_list_pages&limit=10',true);
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
                    $(".pagination").html("<li class='waves-effect'><a href='' id='previousPage' onclick='redirectToPageNum(event," + (elemPrevPage) +")'><i class='material-icons white-text'>chevron_left</i></a></li>" +
                    page + pageNum + "<li class='waves-effect'><a href='#' id='nextPage' onclick='redirectToPageNum(event,"+(elemNextPage)+")'><i class='material-icons white-text'>chevron_right</i></a></li>");

                  }
                  $("#active"+currentPage).attr("class","active teal lighten-2");
                }//200
              }//4
            }//onreadystatechange
    pagination.withCredentials = true;
    pagination.send();
    //End request for pagination

    //Update status from unresolved to solved or the other way round
    $("#reportDetails").on('click','#up',function(e){
      e.preventDefault();
      var update = new XMLHttpRequest();
      update.open('GET','https://final-year-project-260106.appspot.com/?type=update_report&docKey='+key,true);
      update.onreadystatechange = function(){
          if(this.readyState == 4){
                if(this.status==200){
                      var statusData = JSON.parse(update.responseText); //data become javascript object
                      if(statusData["status"]=="success"){
                        getProReportDetails(key);
                        sort(5);
                      }
                      else {
                        alert(statusData["message"]);
                      }
                    }//200
        }//readyState
      }//onreadystatechange
      update.withCredentials = true;
      update.send();
    });
    //end of update status

    //Delete problem report details
    $("#reportDetails").on('click','#remove',function(e){
      e.preventDefault();
      var getConfirm = confirm("Do you want to delete this problem report?");
      var del = new XMLHttpRequest();
      if (getConfirm == true){
        del.open('GET','https://final-year-project-260106.appspot.com/?type=delete_report&docKey='+key,true);
        del.onreadystatechange = function(){
            if(this.readyState == 4){
                  if(this.status==200){
                        var statusData = JSON.parse(del.responseText); //data become javascript object
                          if(statusData["status"]=="success"){
                            sort(5);
                            $('.modal').modal('close');
                            M.toast({html: 'Report deleted!', classes: 'yellow black-text pulse'});
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
    });
    //End of delete problem report details

});//End of ready function

//Sort by function
var sortBy = "";
var orderBy = "";
function sort(option){
  switch (option) {
    case '1':
          sortBy = "&sortBy=date";
      break;
    case '2':
          sortBy = "&sortBy=status";
      break;
    case '3':
          orderBy = "&orderBy=ASC";
      break;
    case '4':
          orderBy = "&orderBy=DESC";
      break;

  }
  var sort = new XMLHttpRequest();
  var limit = 10;
  sort.open('GET','https://final-year-project-260106.appspot.com/?type=pull_report_list&limit=10&page='+currentPage+sortBy+orderBy,true);
  sort.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(sort.responseText); //data become javascript object
                showList(statusData);

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


//Show problem report list in summary
function showList(statusData){
  var i=0;
  var data = statusData['data'];
  var elementString = "";

  for(i=0; i<Object.keys(data).length; i++){
    var entry = data[i];
    elementString += "<tr><td>" + parseInt((i+1)) + "</td><td>" + entry['reportDate'] + "</td><td class='truncate' id='description'>" + entry['report'] + "</td><td>" +
    entry['status'] + "</td><td><a class='waves-effect waves-light btn modal-trigger' onclick=getProReportDetails(&#039;"+entry['docKey']+"&#039;) href='#triggerInt'>View</a></td></tr>"
  }
  $("#problemReportList").html(elementString);
}
// End of showing problem report list in summary

//onlick view button to show problem report details
function getProReportDetails(data){
  var reportDetails = new XMLHttpRequest();
  key = data;
  $("#notify").html("");
  reportDetails.open('GET','https://final-year-project-260106.appspot.com/?type=pull_report&docKey='+data,true);
  reportDetails.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                  var statusData = JSON.parse(reportDetails.responseText); //data become javascript object
                  if(statusData["status"]=="success"){

                  $("#issBy").attr("value",statusData["issuedBy"]);
                  $("#dat").attr("value",statusData["date"]);
                  $("#sta").attr("value",statusData["reportStatus"]);
                  $("#repDes").val(statusData["problemDescription"]);
                  $("#propSol").val(statusData["proposedSolution"]);
                  $("#expOut").val(statusData["expectedOutcome"]);

                  $("#issByLabel").addClass('active');
                  $("#datLabel").addClass('active');
                  $("#staLabel").addClass('active');
                  $("#repDesLabel").addClass('active');
                  $("#propSolLabel").addClass('active');
                  $("#expOutLabel").addClass('active');

                  //$("#up").html("<a href='' class='btn-floating btn-small btn tooltipped' data-position='right' data-tooltip='Update status' onclick='updateStatus.eventPreventDefault("+ key +")'><i class='material-icons' >sync</i></a>")
                }
                else{
                  alert("Error Occur!!!");
                }

              }
              else{
                  alert("Error Occur!!");
              }
        }//readyState
    }//onreadystatechange
    reportDetails.withCredentials = true;
    reportDetails.send();
  }
//End of showing problem report details

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

  selectedPageReportDetail.open('GET','https://final-year-project-260106.appspot.com/?type=pull_report_list&limit=10&page='+currentPage+sortBy+orderBy,true);
  selectedPageReportDetail.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(selectedPageReportDetail.responseText); //data become javascript object
                showList(statusData);
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
