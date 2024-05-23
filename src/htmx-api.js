  // var submitValue;
  // var submitLabel;
  // var loadingIcon =  `<span class="loading loading-ring loading-lg"></span>
  //                     <span class="loading loading-ring loading-xl"></span>
  //                     <span class="loading loading-ring loading-2xl"></span>
  //                     <span class="loading loading-ring loading-3xl"></span>`;
  // var delimiter = "♽";
  
  //       function apiPop(element){
  //           window.open(element, "_blank");
  //       }

  //       function apiSubmitRequest(){
  //         // relayToClient("SUBMIT REQUEST  "  );
  //         const date1 = "startDate=" + document.getElementById("start_date").getAttribute("value");
  //         const date2 = "endDate=" + document.getElementById("end_date").getAttribute("value");
  //           let url = submitValue.split(delimiter)[0] +  "?" + date1 + "&" + date2 ;
  //           if(submitValue.indexOf("IPS")>=0) {
  //             const opt = document.querySelectorAll(".apiOption");
  //             for (let x=0; x<opt.length; x++){
  //               let val = opt[x].options[opt[x].selectedIndex].getAttribute("value");
  //               if(val!=null)  url+= `&${opt[x].getAttribute("id")}=${val}`;
  //             }
  //           }
  //           url =  url.replaceAll("///", "/").replaceAll("//", "/");
  //           setObject("endPoint", url)
  //           HTMXScript(2);
  //         }

  //       function getSectionID(parm = "sectionID"){
  //         let x =  JSON.parse(sessionStorage.getItem("OPENAPI-OBJ"));
  //         return x[parm];
  //       }  

  //       function setObject(parm = "sectionID", value){
  //         let x =  JSON.parse(sessionStorage.getItem("OPENAPI-OBJ"));
  //         x[parm] = value;
  //         sessionStorage.setItem("OPENAPI-OBJ", JSON.stringify(x))
  //       }  

  //       async function universalFetch(API, objPOST, target){
  //             const headerDict = {
  //               'Content-Type': 'application/json',
  //               'Accept': 'application/json',
  //               'Access-Control-Allow-Headers': 'Content-Type',
  //               'Accept-Encoding': 'deflate, gzip;q=1.0, *;q=0.5'
  //             }
  //             const result =  await fetch( API, {
  //               method: 'POST',
  //               headers: new Headers( headerDict ),
  //               body: objPOST,
  //               } )
  //               const innerHTML = await result.text();
  //               document.querySelector("#" + target).innerHTML = innerHTML;
  //           }



  //       function HTMXScript(panelNumber){ 
  //           const triggers = ["", "Category", "Data", "Proto"];
  //           const sectionID = getSectionID();
  //           const panel = "#output" + sectionID + panelNumber;
  //           document.querySelector(panel).innerHTML = `<p class='text-2xl text-white bg-red-400'>${submitLabel}</p>${loadingIcon}`; 
  //           trigger.click();
  //           // relayToClient("ON ITS WAY....." );
  //       }


  //       function setFilter(puzzle){
  //         const id = puzzle.id;
  //         const title = puzzle.title;
  //         parms = title.split("|");
  //         submitValue = parms[0];
  //         submitLabel = parms[1];
  //         document.getElementById("submitBtn" + getSectionID()).classList.remove("hidden");
  //         let allItems = document.querySelectorAll(".categorySelect");
  //         for(let x=0; x<allItems.length; x++ ) {
  //           allItems[x].classList.remove("selectedCategory");
  //         }
  //         document.querySelector("#" + id).classList.add("selectedCategory");
  //         if(submitValue.indexOf("IPS")>=0)
  //         document.getElementById("extraFilter").style.display = "block"
  //       }

  //       function showOpr(parm){
  //         alert(parm.id);
  //         alert(parm.classList.toString())

  //       }


  //       function relayToClient(msg){
  //       document.querySelector("#relayMessage").text = msg;
  //       document.querySelector("#relayButton").click();
  //       }

  //       function searchFilter(parm){
  //         relayToClient("THIS IS A SAMPLE NOTIFICATION")
  //         let filterString = "&filter="
  //         const opr = "eq";
  //         let filterCount=0;
  //         alert(parm);
  //         const rnd = "_" + parm.id.replace("field","");
  //         const elements = document.querySelectorAll("." + parm.id);
  //         for(let x=0; x<elements.length; x++){
  //           const idField = elements[x].id.replace(rnd,"");
  //           value= elements[x].value;
  //           if(value!=undefined && value!="") {
  //             filterString += (filterCount===0 ? "": ",") +  idField + ":" + opr + ":" + value ;
  //             filterCount++
  //           }
  //         }
  //         alert(filterString);
  //       }

  //       function showInfo(payLoad){
  //         let fema = "https://www.fema.gov/api/open/v1/OpenFemaDataSets?$filter=";
  //         alert(getSectionID())
  //         // document.querySelector("#dataTable").innerHTML = "NOW LOADING...>";
  //         // if(payLoad.indexOf("_EQUALS_")<0){
  //         //   document.querySelector("#dataTable").innerHTML = `Click <a href='${payLoad}'>${payLoad}</a> to open`;
  //         // }
  //           document.getElementById("endPoint").setAttribute("value", fema + payLoad);
  //           HTMXScript(3);
  //       }


// <style>
//   .selectedItem {
//     @apply bg-red-800 drop-shadow-2xl;
//   }
// </style>
