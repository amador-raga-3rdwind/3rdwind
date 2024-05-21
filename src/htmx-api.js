
var expressServer="http://localhost:3000/";
function apiPop(element){
    window.open(element, "_blank");
}

function apiSubmitRequest( ROOT, KEY ){
const date1 = "startDate=" + document.getElementById("start_date").getAttribute("value");
 const date2 = "endDate=" + document.getElementById("end_date").getAttribute("value");
      let url = window.localStorage.getItem("apiURL");
      url +=  "?" + date1 + "&" + date2 ;     
    if(document.getElementById("extraFilter").style.display==="block"){
      const opt = document.querySelectorAll(".apiOption");
      for (let x=0; x<opt.length; x+ +){
        url+= `&${opt[x].getAttribute("id")}=${opt[x].getAttribute("value")}`;
      }
    }
    url += KEY;
    url = ROOT + url.replaceAll("///", "/").replaceAll("//", "/");
    document.getElementById("endPoint").setAttribute("value", url)
    document.querySelector("#dataTable").innerHTML = "NOW LOADING...";
    document.getElementById("triggerFinger").click();
  }


  function setFilter(parm){
    parm = parm.replaceAll("//", "/");
    window.localStorage.setItem("apiURL", parm);
    document.getElementById("extraFilter").style.display = (parm.indexOf("IPS")>=0 ? "block":"none");
  }

  function showInfo(payLoad){
    alert(payLoad)
    document.querySelector("#dataTable").innerHTML = "NOW LOADING...>";
    if(payLoad.indexOf("_EQUALS_")<0){
      document.querySelector("#dataTable").innerHTML = `Click <a href='${payLoad}'>${payLoad}</a> to open`;
    }
    else {
      document.getElementById("endPoint").setAttribute("value", payLoad);
      document.getElementById("triggerProto").click();
    }
  }

  function proxyClick(triggerName){
    alert("I WILL PUSH THE TRIGGER NOW")
    document.querySelector("#" + triggerName).click();
    alert("MISSION ACCOMPLISHED!")
  }


