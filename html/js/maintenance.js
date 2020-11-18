$(document).ready(function(){


  //get previous automated value
    var getAutomated = new XMLHttpRequest();
    getAutomated.open("GET", "https://final-year-project-260106.appspot.com/?type=get_cron_param", true);

    getAutomated.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(getAutomated.responseText); //data become javascript object
                getAutomatedDay(statusData);
            }
            else{
              alert("Error occured, please try again.");
            }
          }
        }
    getAutomated.withCredentials = true;
    getAutomated.send();
  //End of get previous automated value

  //Get total maintenance
  var getTotalM = new XMLHttpRequest();
  getTotalM.open("GET", "https://final-year-project-260106.appspot.com/?type=maint_count", true);

  getTotalM.onreadystatechange = function(){
    if(this.readyState == 4){
          if(this.status==200){
              var statusData = JSON.parse(getTotalM.responseText); //data become javascript object
              totalMaintenance(statusData);
          }
          else{
            alert("Error occured, please try again.");
          }
        }
      }
  getTotalM.withCredentials = true;
  getTotalM.send();
  //End of get total maintenance

  });//End ready document

  //Display previous value for automated jobs
  function getAutomatedDay(statusData){
    document.getElementById("proReportDel").value = statusData["problemDays"];
    document.getElementById("feedDel").value = statusData["feedbackDays"];
    document.getElementById("followReportDel").value = statusData["followUpsDays"];
  }
  //End of display automated jobs

  //Update new automated value
  function updateAutomated(event){
    event.preventDefault();
    proReportNew = document.getElementById("proReportDel").value;
    feedNew = document.getElementById("feedDel").value;
    followNew = document.getElementById("followReportDel").value;

    var updateNewAutoValue = new XMLHttpRequest();
    if(proReportNew > 0 && feedNew >0 && followNew >0){
      updateNewAutoValue.open("GET", "https://final-year-project-260106.appspot.com?type=update_cron&problemDays="+proReportNew+"&feedbackDays="+feedNew+"&followUpDays="+followNew, true);
      updateNewAutoValue.onreadystatechange = function(){
          if(this.readyState == 4){
                if(this.status==200){
                      var statusData = JSON.parse(updateNewAutoValue.responseText); //data become javascript object
                      if(statusData["status"]=="success"){
                        M.toast({html: 'Successfully updated!', classes: 'yellow black-text pulse'});

                        //reload
                          var getAutomated = new XMLHttpRequest();
                          getAutomated.open("GET", "https://final-year-project-260106.appspot.com/?type=get_cron_param", true);

                          getAutomated.onreadystatechange = function(){
                            if(this.readyState == 4){
                                  if(this.status==200){
                                      var statusData = JSON.parse(getAutomated.responseText); //data become javascript object
                                      getAutomatedDay(statusData);
                                  }
                                  else{
                                    alert("Error occured, please try again.");
                                  }
                                }
                              }
                          getAutomated.withCredentials = true;
                          getAutomated.send();
                        //End reload

                      }
                      else{
                      alert("Error occurred, please try again.");
                      }
                }//200
                else{
                alert("Error occurred, please try again.");
                }
            }//readyState
        }//onreadystatechange
        updateNewAutoValue.withCredentials = true;
        updateNewAutoValue.send();
    }//End confirm value >0
    else{
      M.toast({html: 'Input number value cannot be less than one!', classes: 'red black-text pulse'});
    }
  }
  //End of update new automated value

// display maintenance count value
function totalMaintenance(statusData){
  var pr = statusData["problemReport"];
  var fb = statusData["feedbacks"];
  var fu = statusData["followUps"];


  $("#badge1").html(pr['total']);
  $("#badge2").html(pr['resolvedCount']);
  $("#badge3").html(fb['total']);
  $("#badge4").html(fb['rating0']);
  $("#badge5").html(fb['rating1']);
  $("#badge6").html(fb['rating2']);
  $("#badge7").html(fb['rating3']);
  $("#badge8").html(fb['rating4']);
  $("#badge9").html(fb['rating5']);
  $("#badge10").html(fu['total']);

}// End of display maintenance count value

// Delete all problem report
function prDelAll(event){
  event.preventDefault();
  var getConfirm = confirm("Do you want to delete all problem reports?");
  var delAll = new XMLHttpRequest();

  if (getConfirm == true){
  delAll.open('GET','https://final-year-project-260106.appspot.com/?type=maint_bd_problem_all',true);
  delAll.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(delAll.responseText); //data become javascript object
                if(statusData["status"]=="success"){
                  M.toast({html: statusData['message'], classes: 'yellow black-text pulse'});


                  //reload page
                  var getTotalM = new XMLHttpRequest();
                  getTotalM.open("GET", "https://final-year-project-260106.appspot.com/?type=maint_count", true);

                  getTotalM.onreadystatechange = function(){
                    if(this.readyState == 4){
                          if(this.status==200){
                              var statusData = JSON.parse(getTotalM.responseText); //data become javascript object
                              totalMaintenance(statusData);
                          }
                          else{
                            alert("Error occured, please try again.");
                          }
                        }
                      }
                  getTotalM.withCredentials = true;
                  getTotalM.send();
                  // End reload page
                }
                else{
                alert("Error occurred, please try again.");
                }
          }//200
          else{
          alert("Error occurred, please try again.");
          }
      }//readyState
  }//onreadystatechange
  delAll.withCredentials = true;
  delAll.send();
}//End of confirm
}
// End of delete all problem report

// Delete resolved problem report
function prDelResolved(event){
  event.preventDefault();
  var getConfirm = confirm("Do you want to all resolved problem reports?");
  var delResolved = new XMLHttpRequest();

  if (getConfirm == true){
  delResolved.open('GET','https://final-year-project-260106.appspot.com/?type=maint_bd_problem_resolved',true);
  delResolved.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(delResolved.responseText); //data become javascript object
                if(statusData["status"]=="success"){
                  M.toast({html: statusData['message'], classes: 'yellow black-text pulse'});

                  //reload page
                  var getTotalM = new XMLHttpRequest();
                  getTotalM.open("GET", "https://final-year-project-260106.appspot.com/?type=maint_count", true);

                  getTotalM.onreadystatechange = function(){
                    if(this.readyState == 4){
                          if(this.status==200){
                              var statusData = JSON.parse(getTotalM.responseText); //data become javascript object
                              totalMaintenance(statusData);
                          }
                          else{
                            alert("Error occured, please try again.");
                          }
                        }
                      }
                  getTotalM.withCredentials = true;
                  getTotalM.send();
                  // End reload page

                }
                else{
                alert("Error occurred, please try again.");
                }
          }//200
          else{
          alert("Error occurred, please try again.");
          }
      }//readyState
  }//onreadystatechange
  delResolved.withCredentials = true;
  delResolved.send();
}//End confirm
}
//End of Delete resolved problem report

// Delete all feedbacks
function fbDelAll(event){
  event.preventDefault();
  var getConfirm = confirm("Do you want to delete all feedbacks?");
  var delAllFb = new XMLHttpRequest();

  if(getConfirm == true){
  delAllFb.open('GET','https://final-year-project-260106.appspot.com/?type=maint_bd_feedback_all',true);
  delAllFb.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(delAllFb.responseText); //data become javascript object
                if(statusData["status"]=="success"){
                  M.toast({html: statusData['message'], classes: 'yellow black-text pulse'});

                  //reload page
                  var getTotalM = new XMLHttpRequest();
                  getTotalM.open("GET", "https://final-year-project-260106.appspot.com/?type=maint_count", true);

                  getTotalM.onreadystatechange = function(){
                    if(this.readyState == 4){
                          if(this.status==200){
                              var statusData = JSON.parse(getTotalM.responseText); //data become javascript object
                              totalMaintenance(statusData);
                          }
                          else{
                            alert("Error occured, please try again.");
                          }
                        }
                      }
                  getTotalM.withCredentials = true;
                  getTotalM.send();
                  // End reload page

                }
                else{
                alert("Error occurred, please try again.");
                }
          }//200
          else{
          alert("Error occurred, please try again.");
          }
      }//readyState
  }//onreadystatechange
  delAllFb.withCredentials = true;
  delAllFb.send();
}//End confirm
}
// End of delete all feedbacks

//Delete selected rating
function fbDelRate(event,num){
  event.preventDefault();
  var getConfirm = confirm("Do you want to delete all rating "+num+" feedbacks?");
  var delZeroFb = new XMLHttpRequest();

  if(getConfirm == true){
  delZeroFb.open('GET','https://final-year-project-260106.appspot.com/?type=maint_bd_feedback_byValue&rating='+num,true);
  delZeroFb.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(delZeroFb.responseText); //data become javascript object
                if(statusData["status"]=="success"){
                  M.toast({html: statusData['message'], classes: 'yellow black-text pulse'});

                  //reload page
                  var getTotalM = new XMLHttpRequest();
                  getTotalM.open("GET", "https://final-year-project-260106.appspot.com/?type=maint_count", true);

                  getTotalM.onreadystatechange = function(){
                    if(this.readyState == 4){
                          if(this.status==200){
                              var statusData = JSON.parse(getTotalM.responseText); //data become javascript object
                              totalMaintenance(statusData);
                          }
                          else{
                            alert("Error occured, please try again.");
                          }
                        }
                      }
                  getTotalM.withCredentials = true;
                  getTotalM.send();
                  // End reload page

                }
                else{
                alert("Error occurred, please try again.");
                }
          }//200
          else{
          alert("Error occurred, please try again.");
          }
      }//readyState
  }//onreadystatechange
  delZeroFb.withCredentials = true;
  delZeroFb.send();
}//End confirm
}
//End delete selected rating

// Delete all follow-up request
function followRequestDel(event){
  event.preventDefault();
  var getConfirm = confirm("Do you want to delete all follow-up requests?");
  var furDelAll = new XMLHttpRequest();

  if(getConfirm == true){
  furDelAll.open('GET','https://final-year-project-260106.appspot.com/?type=maint_bd_followUps_all',true);
  furDelAll.onreadystatechange = function(){
      if(this.readyState == 4){
            if(this.status==200){
                var statusData = JSON.parse(furDelAll.responseText); //data become javascript object
                if(statusData["status"]=="success"){
                  M.toast({html: statusData['message'], classes: 'yellow black-text pulse'});

                  //reload page
                  var getTotalM = new XMLHttpRequest();
                  getTotalM.open("GET", "https://final-year-project-260106.appspot.com/?type=maint_count", true);

                  getTotalM.onreadystatechange = function(){
                    if(this.readyState == 4){
                          if(this.status==200){
                              var statusData = JSON.parse(getTotalM.responseText); //data become javascript object
                              totalMaintenance(statusData);
                          }
                          else{
                            alert("Error occured, please try again.");
                          }
                        }
                      }
                  getTotalM.withCredentials = true;
                  getTotalM.send();
                  // End reload page

                }
                else{
                alert("Error occurred, please try again.");
                }
          }//200
          else{
          alert("Error occurred, please try again.");
          }
      }//readyState
  }//onreadystatechange
  furDelAll.withCredentials = true;
  furDelAll.send();
}//End confirm
}
// End of delete all problem report
