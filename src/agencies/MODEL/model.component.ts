import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import moment from 'moment';
import { KV, OpenAPIService } from '../../app/services/DataInputService';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../../app/services/UtilsService';

@Component({
  selector: 'model',
  standalone: true,
  imports: [ CommonModule],
  styleUrl: '../../3rdwind.css',
  templateUrl: 'model.component.html',
})
export class ModelComponent {
  constructor(public svc: OpenAPIService,  public sanitizer: DomSanitizer, public utils:UtilsService){

  }

VA_API: Array<string> =
[
"Address Validation API|address-validation-3|Provides methods to standardize and validate addresses.|restricted access,verification|oat.ux5mwDP9Z2ulCT3xt3QPS25Yo9t1ca4J",


"Appeals Status API|appeals-status-1|Allows retrieval of all decision review request statuses (both legacy and AMA). Statuses are read only.|restricted access,va benefits",

"Benefits Claims API|benefits-claims-2|Find and submit Veteran benefits claims.|va benefits,authorization code grant,client credentials grant|key.0oavwa8onzEHS0r4r2p7",

"Benefits Documents API|benefits-documents-1|Submit or retrieve a list of supporting claim documents from the Veterans Benefits Management System.|restricted access,va benefits,client credentials grant|oat.0oavt7o94s78S8deD2p7",

"Benefits Intake API|benefits-intake-1|Upload and get the status of VA benefits documents.|va benefits|oat.EeeCEgpWKgryJhkst5pOq3R5CkuHaWDc",

"Benefits Reference Data API|benefits-reference-data-1|Look up data and codes that help with VA benefits claims.|va benefits,open data|oat.LONAljmqZAAZToEGjpZUDwbF9M1WT05h",

"Clinical Health API (FHIR)|fhir-clinical-health-0|Use to develop clinical-facing applications that improve access to and management of patient health data.|restricted access,health,authorization code grant",

"Community Care Eligibility API|community-care-eligibility-0|VA's Community Care Eligibility API utilizes VA's Facility API, VA's Enrollment & Eligibility system and others to satisfy requirements found in the VA's MISSION Act of 2018.|health,authorization code grant,client credentials grant|oat.0oavt7yrhqVsy1gJP2p7",

"Decision Reviews API|appeals-decision-reviews-2|Allows submission, management, and retrieval of decision review requests and details such as statuses in accordance with the AMA.|restricted access,va benefits",

"Direct Deposit Management API|direct-deposit-management-1|Manage direct deposit information for payments from the VA.|restricted access,va benefits,client credentials grant",

"Education Benefits API|benefits-education-1|Determine Veteran eligibility for the Post-9/11 GI Bill’s education benefits.|restricted access,va benefits,client credentials grant",

"Guaranty Remittance API|lgy-remittance-0|Lets lenders automate parts of the mortgage post-closing process|restricted access,loan guaranty,client credentials grant",

"Loan Guaranty API|loan_guaranty_property-1|Use the Loan Guaranty API to Manage VA Home Loans.|restricted access,loan guaranty",

"Loan Review API|loan-review-1|Transmit post-close Loan Guaranty documents.|restricted access,loan guaranty,client credentials grant",

"Patient Health API (FHIR)|fhir-4|Use the OpenID Connect and SMART on FHIR standards to allow VA patients to authorize third-party applications to access data on their behalf.|health,authorization code grant,client credentials grant|bea.0oavt7phclhrBzY5b2p7",

"Provider Directory API|provider-directory-r4-0|Use this API to return lists of VA providers and their information, such as locations, specialties, office hours, and more.|health,open data",

"VA Facilities API|facilities-1|Find VA facilities, including their addresses, available services, and hours of operation.|facilities,open data",

"VA Forms API|forms-0|Look up VA forms and check for new versions.|forms,open data",

"VA Letter Generator API|va-letter-generator|Generate documents and letters for proof of existing VA benefits and status.|restricted access,verification,client credentials grant",

"Veteran Confirmation API|confirmation|Confirm Veteran status for a given person with an API key.|verification",

"Veteran Service History and Eligibility API|veteran-verification|Confirm Veteran status for a given person, or get a Veteran’s service history or disability rating.|verification,authorization code grant,client credentials grant"
];

  SpaceShipsCode: Array<string> = ["address-validation-3", "benefits-claims-2", "benefits-reference-data-1", "benefits-documents-1", "benefits-intake-1", "appeals-status-1"];


 async visitStar(star: string){
  const source =  star;
  let obj = { method: "get", agency: "DVA" , outerSpace : source} ;
  this.svc.spaceFetch(obj, 2);
  document.querySelector("#apiPage")!.innerHTML = this.svc.northernLights();
 }



apiList: Array<string>=[];
rootURL: string = `https://api.nasa.gov/`

FullInfo = [""];
SpecimenSheet: Array<string> = [];
OtherInfo = [""];
SpaceShips: Array<string>=[];
currentIndex =0;
isLocked: boolean= false;
isSystemReady = false;
isLookUp = false;

portal :  {key:string, vault:any, scribe:string}[] = [{key:"", vault:"", scribe:""}] ;

ngOnInit(): void {
  for(let api of this.VA_API) {
    const items = api.split("|");
    const obj: any = {};
    obj.key = items[0];
    obj.vault = items[1];
    obj.scribe = items[2] + "|" + items[3];
    if(items[4]) obj.scribe += "|" + items[4];
    this.portal.push(obj);
  }
  this.isSystemReady = false;
}



unlock(){
  if(!this.isLocked) return;
  this.isLocked =  !this.isLocked;
  this.hideAPIResult = true;
}

orbitFreely(i: number){
  if(this.isLocked)  return;
  this.isLookUp = true;
  this.currentIndex = i;
}

$DOM: any;


info = signal<any>({"title":"", "version":"", "description":""});
paths = signal("");
tags = signal<any>([{"name":"", "description":""}]);
tempo = signal("");
endPoints: Array<string>=[];
objectProps: Array<any> = [];

///!DVA
async scanPayload(destination:string, scribe: string){
    if(this.isSystemReady) this.utils.messageNorthStar("Clearing...")
    let response = await fetch(`assets/JSON/${destination}.json`);
    if(destination=="fhir-4") destination = "fhir/v0/r4/"
    const temp = scribe.split("|")[2];
    this.utils._vault = destination + "|"  + temp;
    let json = await response.json();
    this.info.set(json.info);
    this.tags.set(json.tags);
    const paths = json.paths;
    const excludeKeys = ['responses', 'requestBody', 'security', 'length'];
    const extractedData = this.utils.extractKeyValuePairs(paths, excludeKeys);
    console.clear();
    const htmlOutput = this.utils.jsonToHtml(extractedData);
    this.tempo.set(htmlOutput)
    this.isSystemReady = true;
    if(this.isSystemReady) this.utils.messageNorthStar("")
}

infoToggle = true;


//! NASA
voyageReady()
{     console.clear()
      const div =new DOMParser().parseFromString("<div>" + this.SpecimenSheet[this.currentIndex][2] + "</div>", "text/html");
      const divElement = div.querySelector("div")!;
      let tag = "NEVER MIND THIS"
      let temp = this.utils.specialTraverse(divElement, "P|H2|H3,P|TABLE|H3|CODE|STRONG|BR|IMG");
      if(temp.includes("<h3 "))   tag = "<h3 "
      else if(temp.includes("<h2 "))   tag="<h2 ";
      const tabs = temp.split(tag.trim());
      let result = "";
      let oldTable = "";
      let oldHeader="";
      let baseAPI: string = "";
      let restriction: string = "";
      if( divElement.firstElementChild!.tagName ==="TABLE")
            result+=  this.utils.formatResult("Select Category",this.vulcanizeTable(divElement.firstElementChild!.outerHTML,1 ));//this.classifyMesa(divElement.firstElementChild!.outerHTML)
      else
      for(let x=0; x<tabs.length; x++)
      {
            let vals =  tabs[x].split("<table");
            let header = tag + vals[0];
            let code = new DOMParser().parseFromString("<div>" + header + "</div>", "text/html").querySelector("code");
            let code2 = new DOMParser().parseFromString("<div>" + header + "</div>", "text/html").querySelectorAll("code");
            if(code) {
                  if(code2.length>1) code=code2[code2.length-1];//alert(code2[0].innerHTML + "\n" + code2[1].innerHTML  )
                  if(this.utils.isSubstringAny(header.toUpperCase(), "HTTP REQUEST,HTTPS://,HTTP://")) {
                    baseAPI = code.innerHTML.replace("GET","").replace("PUT","").trim().split(" <")[0];
                    baseAPI = baseAPI.split("?")[0];
                  }
                  if(this.utils.isSubstringAny(header.toUpperCase(), "INPUT RESTRICTION")) {
                    restriction = code.innerHTML;;
                  }
            }
            if(vals.length<=1 && baseAPI!="")
              {
                vals = oldTable.split("<table");
                header = oldHeader;
              }
            if(vals.length>=2) {
              // vals = oldTable.split("<table");
              // header= oldHeader;
                for(let x=1; x<vals.length; x++)
                  {
                    const table = "<table" + vals[x];
                    const inputLevel =  this.classifyMesa(table)
                      if(inputLevel===0) result += this.utils.formatResult((x==1?header:''), table) + "<hr>";
                      else {
                                  if(baseAPI==="" && inputLevel==2){
                                      oldHeader= header;
                                      oldTable = table;
                                  }
                                  else {
                                      result += this.utils.formatResult(header,this.vulcanizeTable(table, inputLevel, baseAPI, restriction))
                                      baseAPI = "";
                                      restriction="";
                                    }
                      }
                  }
              }
      }
      this.isLocked = true;
      this.isLookUp = false;
      document.querySelector("#capsule-2")!.innerHTML = "<div class='flex gap-4 bg-transparent'>" + result + "</div>";
      this.hideAPIResult = true;
}

class=["info", "non-orbit", "satellite" ]

classifyMesa(mesa: string){
  mesa = mesa.toUpperCase()
  const firstCase = this.utils.isSubstringAny(mesa,  "YYYY,STRING,BOOL,INT,INTEGER")
  const secondCase =  this.utils.isSubstringAny(mesa, "PARAMETER,API,ENDPOINT");
  if(firstCase && secondCase ) return 2;
  if( firstCase || secondCase) return 1;
  return 0;
}
hideAPIResult = true;;

invertOrbit(){
  this.isLookUp = !this.isLookUp;
}

crypticText(entry: string){
  // should remove all  n on chars except _
        entry = entry.replaceAll("\<\/", "\<").replaceAll("<a>", "").replaceAll("<b>", "").replaceAll("<u>", "").replaceAll("<p>", "");
        entry = entry.replaceAll("{", "").replaceAll("}", "").replaceAll("\/","_").trim();
        let entries = entry.toLowerCase().split("_");
        let result =""
        for(let x=0; x<entries.length; x++ ){
          if(entries[x].trim() !== "" )  {
            let first: string = entries[x].trim().substring(0,1);
            result+= entries[x].replace(first, first.toUpperCase()) + " ";
          }
        }
        return result.trim();
}


isItOn(one: string | Array<string>, all: string ){
        let list:  Array<string>;
        if(typeof one=="string" ){
          list = (one + ",").split(",");
        }
        else {
          list = one;
        }
        all= all.toUpperCase();
        for(let x=0; x<list.length; x++){
          // if( (list[x]+"").trim()!=="" )
          if( all.split(list[x].toUpperCase()).length > 0) return true;
        }
        return false;
}

///! NASA
vulcanizeTable(tableName : string, inputLevel:number, baseAPI: string ="", restriction: string =""){
        this.utils._idGenerator()
        let result ="";
        try{
              let fetchButton = "";
              const trs = (new DOMParser().parseFromString(tableName, "text/html")).querySelectorAll("tr");
              let columnNames = trs[0].querySelectorAll("th");
              if(columnNames.length==0) columnNames = trs[0].querySelectorAll("td")
              for(let x=1; x<trs.length; x++){
                            let tds = trs[x].querySelectorAll("td");
                            if(tds.length===0) tds = trs[x].querySelectorAll("th");
                            let element: string = ""
                      if(tds.length>0){
                                  //!!!  DATA ENTRY SECTION
                                  let orbit="";
                                  let ID=""; let VALUE=""; let TYPE=""; let REQUIRED=""; let URL=""; let NOTES="";
                                  for(let i=0; i<columnNames.length; i++){
                                        const item = columnNames[i].innerHTML.toUpperCase();
                                        orbit = tds[i].innerHTML.replaceAll("<p>","").replaceAll("</p>","").replaceAll("<em>","").replaceAll("</em>","");
                                        tds[i].innerHTML =orbit.replaceAll("\/","")
                                        if(item.includes("PARAMETER") || item.includes("API"))  ID =orbit;
                                        if(item.includes("TYPE") || item.includes("DEFINITION") )  TYPE =orbit;
                                        if(item.includes("VALUE") || item.includes("DEFAULT"))  VALUE =orbit;
                                        if(item.includes("REQUIRED") )  REQUIRED =orbit;
                                        if(item.includes("URL") || item.includes("EXAMPLE") || item.includes("ENDPOINT") || item.includes("API") )  URL =orbit;
                                        if(item.includes("NOTES") || item.includes("DESCRIPTION") || item.includes("DEFINITION") )  NOTES =orbit;
                                        }
                                        let excludeThis = this.utils.isSubstringAny(tds[0].innerHTML.toUpperCase(), "API_KEY,API KEY,APIKEY,DEMO_KEY") ||
                                          this.utils.isSubstringAny(tds[1].innerHTML.toUpperCase(), "API_KEY,API KEY,APIKEY,DEMO_KEY");
                                        let isBottomButton = true;
                                        let insert = "";
                                  if(inputLevel==1){
                                            let url; let urlID="";
                                            if(URL!="") {
                                                url = URL.split(`href="`)[1].split(`?`)[0];
                                                const temp = url.replace("https://", "").split("/");
                                                urlID = temp[temp.length - 1];
                                              }
                                              let level1Case = "";
                                              const item = columnNames[0].innerHTML.toUpperCase();
                                                  if(item.includes("MOSAIC")) level1Case="MOSAIC";
                                                  else
                                                  if(item.includes("EXAMPLE API")  ) level1Case="EXOPLANET";
                                                  else
                                                  if(item.includes("API")  ) level1Case="DONKI";
                                                  else
                                                  if(item.includes("ENDPOINT")  ) level1Case="TLE";

                                              if(x===1) insert   = this.customizeLevel1(level1Case, trs.length-1);

                                              if(level1Case==="DONKI")
                                                          element +=  `<tr><td class='min-w-[400px] orbit-launcher item-selector' data-url='${url}' title='fetch${this.utils.IDR}'
                                                          id='${urlID}' onclick='fetchData(this, 1)'>${tds[0].querySelector('a')?.innerHTML}</td><td class='hidden'>${TYPE}</td>${insert}</tr>`;
                                              else
                                              if(this.utils.isSubstringAny(level1Case,"MOSAIC,EXOPLANET"))
                                                          {
                                                            element +=  insert +  `<tr><td class='min-w-[350px]'>${tds[0].innerHTML}</td>`
                                                            for(let x=1; x<tds.length; x++)  element+= `<td class='w-fit'><button class='btn btn-sm hover:bg-amber-200 bg-slate-600 text-stone-100'
                                                                      onclick='anchorUp('${tds[x].getAttribute("href")??tds[x-1].getAttribute("href")}')'>${this.iconBtn[x-1]}</button></td>`
                                                            element += "</tr>";
                                                          }
                                              if(level1Case==="TLE")
                                                            element +=   insert + `<tr><td><button class='btn btn-sm hover:bg-amber-200 bg-slate-600 text-stone-100'
                                                                      onclick='anchorUp('${tds[0].innerHTML}')'>${this.iconBtn[x-1]}</button></td>${tds[1].innerHTML}<td></tr>`;
                                        }
                                  if(inputLevel==2) {
                                          if(URL.includes("GET ")){
                                                  const url = URL.replace("GET ","").replace("(q)", "")
                                                  const button = `<button id='fetch${this.utils.IDR}-${x}'  data-url='${baseAPI}/${url}'  class='fetchButton' onclick='fetchOne(this)'>Fetch</button>`;
                                                  insert= url +` <input type='text' id='entry${this.utils.IDR}-${x}'>` + button;
                                                  insert = "<div class='grid grid-cols-3 min-w-48  text-right ml-4'>" + insert + "</div>";
                                                  element +=  `<tr><td class='min-w-60 text-sm font-extrathin align-top'>${NOTES}</td><td class='w-fit'>${insert}</td></tr>`;
                                                  isBottomButton = false;
                                                  excludeThis = true;
                                          }
                                          else{
                                                  if(this.utils.isSubstringAny(TYPE.toUpperCase(), "STARTING PAGE,DISPLAY COUNT"))  VALUE="integer";
                                                  if(this.utils.isSubstringAny(TYPE.toUpperCase(), "DATASOURCE")) TYPE="DROPDOWN_MULTI|" + VALUE.split("(")[0];
                                                  if(this.utils.isSubstringAny(TYPE.toUpperCase(), "SORT ORDER")) TYPE="DROPDOWN|ASC,DESC";
                                                  if(VALUE.toUpperCase()=="N/A") VALUE=""
                                                  if(this.utils.isSubstringAny(TYPE.toUpperCase(), "LAT,LON")) TYPE="float";
                                                  if(this.utils.isSubstringAny(TYPE.toUpperCase(), "YYYY") && VALUE==="")  insert=this.utils.formatInput(TYPE,NOTES, ID );

                                                      else
                                                  insert=this.utils.formatInput(TYPE,VALUE, ID );
                                          }
                                          fetchButton = `<button id='fetch${this.utils.IDR}-${x}' data-baseapi='${baseAPI}' data-restriction='${restriction}' class='fetchButton' onclick='fetchData(this)'>Fetch</button>`;
                                          if(this.SpaceShipsCode[this.currentIndex].includes("EPIC")){
                                                  baseAPI = "https://api.nasa.gov/EPIC/api";
                                                  this.epicArchive = "https://api.nasa.gov/EPIC/" + ID;
                                                  const logic = `<button id='fetch${this.utils.IDR}-${x}'  data-url='${baseAPI}/${ID}/${this.utils.isSubstringAny(ID,'/all,/date')?'':'images'}'  class='fetchButton' onclick='fetchData(this,2)'>Fetch</button>`;
                                                  if(TYPE==="string"){
                                                      insert = logic
                                                  }
                                                  else {
                                                    this.utils._idGenerator();
                                                    insert=this.utils.formatInput( TYPE,VALUE, ID );
                                                    insert+= logic.replace("fetchButton", "fetchDate").replace("Fetch", "OK");
                                                  }
                                                  fetchButton = "";
                                          }
                                          if(!excludeThis)
                                          element +=  `<tr><td class='w-20'>${this.crypticText(ID)}</td><td class='max-w-44'>${insert}</td><td class='max-w-32 px-2'>${VALUE}</td><td class='max-w-40 text-sm font-extrathin'>${NOTES}</td></tr>`;
                                          if(x>=trs.length-1 && isBottomButton){
                                                element +=  `<tr><td colspan='4' class='p-0 header-[1px] my-4 bg-slate-800'></td></tr><tr class='header-12'><td class='w-32'></td><td>${fetchButton}</td><td></td><td class='text-sm font-extrathin'></td></tr>`;
                                          }
                                  }

                          result+=  (element) ;
                      }
                      else{
                      result+=   `<tr><td colspan='4' class='p-0 header-[1px] my-4 bg-slate-800'></td></tr><tr class='header-12'><td class='w-32'></td><td>${fetchButton}</td><td></td><td class='text-sm font-extrathin'></td></tr>`;
                      }
              }
            }
            catch(err){
              return "";// FullInfo[specimentNumber];
            }

            console.error("Vulcanized", "============================================")
            if(result.includes("APOD")) console.warn("WARNING, this has APOD!!!!")
           return( `<table class='w-fit !important'>${result}</table>`);
}

iconBtn=["👀","☵"];

///!! This is exclusive for NASA
customizeLevel1(caseName : string, numRecords: number){
      let result="";
      let specialOption = ""
      switch(caseName){
        case "DONKI": {
          const end_date = this.utils._todayStr;
                    const start_date = this.utils.addDays(end_date,-30);
                    let options: any = [  ["All Location", "Earth","Messenger","Stereo A", "Stereo B"],
                                          ["All Catalog", "SWRC", "Winslow", "Messenger_IME_Catalog"] ];
                    const fetchSubmit = `<button id='${this.utils.IDR}-submit' class='fetchButton prep${this.utils.IDR}' onclick='fetchData(this,2)'>Fetch</button>`;

                    for(let x=0; x<2; x++){
                      const caption= options[x][0].split(" ");
                      specialOption += `<select class='w-24 m-2 p-1  ${this.utils.IDR}' title='${caption[1]}' id='options${x}'>`;
                      for(let i=0; i<options[x].length; i++){
                        const v = options[x][i];
                        if(i===0)    specialOption+= `<option value='' selected=selected`;
                            else
                                    specialOption+= `<option value='${v}'`
                        specialOption+= `>${v}</option>`
                      }
                      specialOption+= `</select>`
                    }
                    const dates = `<div class='grid w-full text-center grid-cols-2'>
                    Start Date<input    type='date' class='${this.utils.IDR}'  title='start_date'   value='${moment(start_date).format("YYYY-MM-DD")}' >
                    End Date  <input    type='date' class='${this.utils.IDR}'  title='end_date'     value='${moment(end_date).format("YYYY-MM-DD")}' >
                    &nbsp;${fetchSubmit}</div>`;
                    specialOption = `<h3 id='${this.utils.IDR}Condition' class='text-slate-600 my-1 text-2xl text-center'></h3><hr class='mb-2'>
                    <div id='${this.utils.IDR}Options' class='w-[400px] text-center '>${specialOption}</div>${dates} `;
                    return `<td    rowspan='${numRecords}'><div class='items-align rounded-t-lg filter-container
                          w-[400px] hidden  p-2 rounded header-full bg-slate-300  drop-shadow-lg'>${specialOption}</div></td>`;
        }
        case "MOSAIC": {
                  return `<tr><thead><th>Mosaic</th><th>Preview</th><th>Capabilities</th></thead></tr>`;
        }
        case "EXOPLANET": {
                  return `<tr><thead><th>Example API</th><th>URL</th></thead></tr>`;
        }
        case "TLE": {
                  return `<tr><thead><th>Endpoint</th><th>Description</th></thead></tr>`;
        }
        default: break;
      }
  return result
}



epicArchive = ""

commandControl(){
  let el = document.querySelector("#proxy");
  const action: any = el?.getAttribute("data-action");
  if(action=="0") this.spaceShake();
  else if(action=="1") this.peepHole(el?.getAttribute("data-attach"));
  else if(action=="2") this.flyOver();
}

private peepHole(attach: any){
  console.log(attach);
  const data = attach.split(",");
  const container = document.getElementById('sample');
      data.forEach((Url: string) => {
        if(this.utils.isSubstringAny( Url.toUpperCase(),".JPG,.PNG,.BMP" )){
          const imgElement = document.createElement('img');
          imgElement.src = Url;
          container!.appendChild(imgElement);}
        // else if(this.utils.isSubstringAny( Url.toUpperCase(),".JSON")){
        //   fetch(Url)
        //           .then(response => response.json())
        //           .then(data => {
        //             container!.appendChild(data);
        //           })

        // }
        }

      )
}

private flyOver(){}
urlRequest = signal("");

private async spaceShake(){
  const  message = (sessionStorage.getItem("OuterSpaceSession")+"").split("|||");
  this.hideAPIResult = false;
  // this.svc.northernLights.set(`<h1 class='text-indigo-700 text-5xl text-center animate-pulse '>LOADING....</h1>`);
  document.querySelector("#capsule-3")!.innerHTML = `<h1 class='text-indigo-700 text-5xl text-center animate-pulse '>LOADING....</h1>`; //this.svc.northernLights();
  const agency  = message[0]
  let baggage = message[2];
  sessionStorage.removeItem("OuterSpaceSession")
  if(this.utils.isSubstringAny(baggage, "/all,/images,/date") && !(this.utils.isSubstringAny(baggage, "search?")))  baggage = baggage.split("?")[0];
  this.urlRequest.set(baggage);
      const obj: any ={};
      obj.method = "post";
      obj.sectionID =  agency;
      obj.agency =    agency;
      obj.outerSpace =     baggage + "_METEORITES_" ;
      let temp= await this.svc.spaceFetch(obj, 1);
      // let temp=this.svc.northernLights();
      document.querySelector("#capsule-3")!.innerHTML = `<h1 class='text-red-700 text-5xl text-center animate-pulse '>SANITIZING...</h1>`;
      try{
        if(this.SpaceShipsCode[this.currentIndex].includes("EPIC")){

              let epics = temp.split("epic_");
              let ymd = epics[0].split("<api-value>")[1].split("</api-value>")[0];
              ymd = ymd.substring(0,4) + "/" + ymd.substring(4,6) + "/" + ymd.substring(6,8);
              const url = baggage.split("?")[0].replace("/api/", "/archive/").replace("date/", "") + ymd;
              for(let x=1; x< epics.length; x++){
                  const item = ("epic_" + epics[x]).split("</api-value>")[0];
                  const jpg =  `${url}/jpg/${item}.jpg`
                  const replacement = `<button class='mr-2  btn-accent btn-sm' onclick="popUp('${jpg}')">LO-RES</button>` +  `<button class=' btn-accent btn-sm' onclick="popUp('${url}/png/${item}.png')">HI-RES</button>`;
                  temp = temp.replace(item, replacement);
              }
        }
        // document.querySelector("#hoverOrbit")!.innerHTML = document.querySelector("#capsule-2")!.innerHTML;
        temp = temp.replaceAll("apiPop", "popUp");
        document.querySelector("#capsule-3")!.innerHTML = temp;

      }
      catch (err){}

}

        _$EQ(left: any, right:any){
          return left===right;
        }

        _$SPLIT(item: string, sub: string){
          if(item=="undefined") return item;
          let result =  item.split(sub.replace("|", ""));
          if(sub.includes("|")) {
            const temp = sub.split("|");
            result[0]+= temp[0];
            result[1]= temp[1]+ result[1];
          }
          else {
            result[0]+= sub;
          }
          return result;
        }

        // _$IN(left: string| Array<string> , right:string | Array<string>){
        //   return left.includes(right.toString())  || right.includes(left.toString());
        // }

        _$FOR(item: any, action:any){
          item.array.forEach( () => {

          });
        }

delimiter="⇚|⇛";
temp = ""
ngAfterViewInit(): void {}







}
