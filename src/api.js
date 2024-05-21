import express, { urlencoded } from 'express';
import pkg from 'body-parser';
import cors from 'cors'; // Install cors middleware: npm install cors
import fetch from 'node-fetch';
import cheerio from "cheerio";
import pretty from "pretty";
// import fs from "fs";
import fsrw from "fs/promises";
import { randomBytes, randomInt } from 'crypto';

const { json } = pkg;
const app = express();
app.use(cors({ origin: 'http://localhost:4200', methods: ['GET', 'POST'] }));
app.use(json()); 
app.use(urlencoded( {extended: true}));

let openInfo={};
let delimiter = "♽";
app.listen(3000, () => {
  console.warn(`Server started on port 3000`);
});

let sectionID;
//!FETCH-FIELDS
app.post('/htmx-fetch-fields', async (req, res) => {
  try {
      let prefix ="";
      let suffix ="";
      let URL ="";
      let agency    = req.body.agency;
      let endPoint  = req.body.endPoint;
      let agencyURL = req.body.agencyFields;
      let info = extractAPI(agency);
      let html ="";
      prefix= info.ROOT
      const isSpecialType = "NO"; // = req.body.specialTypeAgency;
      sectionID = req.body.sectionID;
      if(agency==="DVA"){
            const bearerToken = "Bearer 0oau8p8n6nWLAEv9g2p7";
            URL =   'https://sandbox-api.va.gov/services/fhir/v0/r4/Appointment/FOBJ7YQOH3RIQ5UZ6TRM32ZSQA000000';
            const bearer ={ headers: { 'Authorization': bearerToken,     'accept': 'application/fhir+json' }};
            // const response = await fetch(URL,  bearer );
            // html = await response.json();
            // html = toHTMLTable(html);
      }

      console.clear();
      console.table(agencyURL);
      const specialType = getSpecialTypeCase(agencyURL.toUpperCase()); 
    
                        function iterateObject(obj, agencyURL){
                            let result="";
                            if(typeof obj!=="object") result = specialTypeParser( obj, agencyURL);   
                            else {
                              if(Array.isArray(obj)){
                                for(let x=0; x<obj.length; x++)
                                {
                                    const kv = obj[x].split(":");
                                    if(typeof obj[x]==="object"){
                                      result  +=  _DIVISION( _DIVHEAD(kv[0]) +  _SECTION(iterateObject(kv[1], agencyURL)));
                                    }
                                    else {
                                      result += specialTypeParser( obj[x], agencyURL, true); 
                                    }
                                }
                              }
                              else
                              {
                                for (const [key, value] of Object.entries(obj))
                                {
                                  if(typeof value==="object"){
                                      result  += _DIVISION(_DIVHEAD(key) + _SECTION( iterateObject(value, agencyURL)));
                                  } 
                                  else {
                                      result += specialTypeParser( value, agencyURL  );
                                  }
                                }
                              }
                            }
                            return result;    
                          }
     

          if(specialType.length===0)
          {
            suffix="?page[number]=1&page[size]=1";
            URL = (prefix + agencyURL + suffix).replaceAll("//", "/") + info.KEY;
            html = await fetchSpecialType(URL,"getDataFields");
          }
          else 
          {
            for(let x=0; x<specialType.length; x++) {
              console.table( typeof specialType[x] + "--------------------------------------------------------------------"  );
              if(typeof specialType[x] ==="string")
              {     
                if( specialType[x].includes(">") ){
                  const rnd = sectionID;
                  const parm = specialType[x].split(">");
                  let  extra=""
                  if(parm.length==3) extra = classRange(parm[2]); 
                  const id = parm[0].replaceAll(" ","")
                  html+= `<div class='grid grid-cols-2 mx-2 text-start'>${parm[0].toUpperCase()}: <input id="${id}${sectionID}" ${extra}  ${classType(parm[1])}  /></div>`;
                }
                else{
                  html+= iterateObject(specialType[x], agencyURL);
                }
              }
              else
              {
                  html+= iterateObject(specialType[x], agencyURL);
              }
            } 

            const today = new Date();
            const defaultDate= "pattern='[0-9]{4}-[0-1][0-9]-[0-3][0-9]' value='" + today.toISOString().slice(0, 10) +"'";
            const thirtyDaysAgo = new Date(today.setDate(new Date().getDate() -30));
            const defaultDate30= "pattern='[0-9]{4}-[0-1][0-9]-[0-3][0-9]' value='" + thirtyDaysAgo.toISOString().slice(0, 10) +"'";
            let baseFilter = "<div class='mb-4 grid grid-cols-2'><div>Start Date:</div><input type='date' "+ defaultDate30 
              +" id='start_date'/><div>End Date:</div><input type='date' "+ defaultDate 
              +" id='end_date'/></div>";
            // } 
            // const urlSubmit = `onclick="apiSubmitRequest('${info.ROOT}','${info.KEY}')"`;
            const urlSubmit = `onclick="apiSubmitRequest('${agency}')"`;
            baseFilter += ` <button-nav id='submitBtn' class='submitBtn hidden' ${urlSubmit} >Submit</button-nav>`;
            html = `${_DIVISION(html)}<hr>
                    <div id='result' class='my-2 text-center'>${baseFilter}</div>`;
            suffix = "?page=1&_count-1"
          }
          
          html=html.replaceAll('"',"");
          res.status(200).send(_HTMX(html)); 
            
  }
  catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

function classType(type){
  let result = "";
  let specialType = "";
  switch(type.toUpperCase()){
    case "INT"      :  result = "numeric"; break;
    case "CURRENCY" :  specialType ="class='dollar'";   result = "numeric"; break;
    case "TIME"     :  specialType ="class='time'";     result = "time"; break;
    case "DATE"     :  specialType ="class='date'";     result = "date"; break;
    case "CHK"      :  specialType ="class='toggle toggle-warning'"; result = "checkbox"; break;
    case "BOOLEAN"  :  specialType ="class='toggle toggle-primary'"; result = "checkbox"; break;
    case "STRING"   :  result = "text"; break;
    default         :  result = "text"; break; 
  }
  return `type="${result}"   ${specialType}`;
}

function classRange(type){
  if(!type.indexOf("|")>=0) return "";
      const vals = type.split("|");
      let result = `type='range' class='range' min='${vals[0]}'   max='${vals[1]}'`;
      if(type.length==3) result+= `  step='vals[2]'`;
      return result
}

//! FETCH-DATA
app.post('/htmx-fetch-data', async (req, res) => {
  try {
    const endPoint = req.body.endPoint; 
    let html = await fetchSpecialType(endPoint, "toHTMLTable" );
    html=html.replaceAll('"',"");
    if( html.indexOf("-root></api-root")>=0 || html==="")  
    html="<h1 class='text-4xl bg-red-400 p-6 text-white'>NO RECORD FOUND.</h1>"
    res.status(200).send(_HTMX(html)); 
  }
  catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

//! FETCH-PROTO
app.post('/htmx-fetch-proto', async (req, res) => {
  try {
    const baseURL = req.body.endPoint.replaceAll("|", "'").replaceAll("_EQUALS_", " eq ");
    const url = new URL(baseURL);
    const proto = await fetch(url.toString())
    const html = await proto.json();
    let result =""
    if(html.metadata!==undefined) result+= _ROOT(toHTMLTable(html.metadata));
    if(html.OpenFemaDataSets!==undefined) result+= _ROOT(toHTMLTable(html.OpenFemaDataSets));
    res.status(200).send(_HTMX(result)); 
  }
  catch(error) {
    console.error("Error fetching data:", error);
  };
})

function isItSpecialTypeCase(agencyURL){
  const specialType = ["fhir"];
  for(let x=0; x<specialType.length; x++) {
    if(agencyURL.indexOf(specialType[x] + "/")>=0)
      return ["AllergyIntolerance", "Appointment", "Condition", "Device", "DeviceRequest","DiagnosticReport","DocumentReference",
        "Encounter","Immunization", "Location" ];
  }
  return [];
};

function getSpecialTypeCase(agencyURL){
  switch(agencyURL){
   
    //! DVA
    case "FHIR/V0/R4/": 
    return  ["AllergyIntolerance", "Appointment", "Condition", "Device", "DeviceRequest","DiagnosticReport","DocumentReference",
    "Encounter","Immunization", "Location" ];
   
    case "veteran_verification/v2/".toUpperCase():
    return ["Disability Rating", "Enrolled Benefits", "Flashes","Service History", "Status"];
   
    case "claims/v2/".toUpperCase(): 
    return ["Veteran Identifier", "Claims", "5103 Waiver", "Intent To FIle", "Disability Compensation", "Power of Attorney"]

    //! NASA
    case "PLANETARY/APOD/" :
    return [ "Count>int", "Thumbs>chk", "Sample>date", "sample2>time", "Total Cost>currency", "SampleRange>int>5|100|4", "check>boolean"];
    
    case "DONKI/":
                    const location = ["Location","All", "Earth","Messenger","Stereo A", "Stereo B"];
                    const catalog =  ["Catalog","All", "SWRC", "Winslow", "Messenger_IME_Catalog"];
    return ["Coronal Mass Ejection:CME", "Geomagnetic Storm:GST", 
      "Interplanetary Shock:IPS" + delimiter + location + delimiter + catalog,
      "Solar Flare:FLR","Solar Energetic Particle:SEP", "Magnetopause Crossing:MPC", "Radiation Belt Enhancement:RBE", "High Speed Stream:HSS"];

    //! DHS
    case "FEMA": 
    openInfo.RECORDS=`https://www.fema.gov/api/open/_VERSION/_ENTITY_`
    openInfo.META=`https://www.fema.gov/api/open/_VERSION_/OpenFemaDataSets?$filter=name_EQUALS_|_ENTITY_|`;
    return [
      {"Disaster Information":
      ["Declaration Denials:v1","Disaster Declaration Summaries:v2","FEMA Web Declaration Areas:v1",
      "FEMA Web Disaster Declarations:v1","FEMA Web Disaster Summaries:v1","Mission Assignments:v1"]},

      {"Emergency Management Preparedness and Alerts":
      ["Emergency Management Performance Grants:v2","IPAWS Archived Alerts:v1",
      "Preparedness (Non-Disaster)/Assistance to Firefighter Grants:v1",
      "Annual NFIRS Public Data:https://www.fema.gov/about/openfema/data-sets/fema-usfa-nfirs-annual-data",
      "Community Emergency Response Team (CERT):https://www.fema.gov/about/openfema/data-sets/community-emergency-response-team-cert-dataset",
      "National Household Survey:https://www.fema.gov/about/openfema/data-sets/national-household-survey",
      "Sandy PMO --- Disaster Relief Appropriations Act of 2013 (Sandy Supplemental Bill) Financial Data:https://www.fema.gov/about/openfema/data-sets/sandy-pmo-disaster-relief-appropriations-act-2013-sandy-supplemental-bill"  
      ]}, 

      {"Individual Assistance":
      ["Housing Assistance Program Data - Owners:v2",
      "Housing Assistance Program Data - Renters:v2",
      "Individuals and Households Program - Valid Registrations:v1",
      "Individual Assistance Housing Registrants - Large Disasters:v1",
      "Registration Intake and Individuals Household Program (RI-IHP):v2"
      ]},
      
      {"Public Assistance":
      ["Public Assistance Applicants:v1",
      "Public Assistance Applicants Program Deliveries:v1",
      "Public Assistance Funded Projects Details:v1",
      "Public Assistance Funded Projects Summaries:v1",
      "Public Assistance Grant Award Activities:v1",
      "Public Assistance Second Appeals Tracker:https://www.fema.gov/about/openfema/data-sets/fema-public-assistance-second-appeals-tracker"
      ]}
    ]
    //! TREASURY
      // case:
      // result =

      // {"Hazard Mitigation": },
      // {"National Flood Insurance Program" :}, 
      // {"Miscellaneous": }
    default: return [];

      
  }  
}

function sanitizeString(item){
  const unwantedChars = "\/!`,][:#&}{*$\"\'";
  for(let x=0; x<unwantedChars.length; x++){
    item = item.replaceAll(unwantedChars.substr(x,1), "");
  }
  item = item.replaceAll("=", "EQ");
  item = item.replaceAll("?", "QQ");
  return item;
}

function specialTypeParser( item, agencyURL, isSpecialType=false ){
  let kv = item.split(":");  
  let result;
  if(isSpecialType){
    const specialTypeObject = openInfo.META;// + delimiter + openInfo["RECORDS"];  
    const entity = kv[0].replaceAll(" ","");
    let payLoad;
    if( kv[1].indexOf("http")>=0){
      //it is a LINK
      payLoad = kv[1]+":"+ kv[2];
    }    
    else {
      payLoad =  specialTypeObject.replaceAll("_VERSION_", kv[1]).replaceAll("_ENTITY_", entity);
    }
    result = `<button-nav onclick="showInfo('${payLoad}')">${kv[0]}</button-nav>`;
  } else {
    const params =  agencyURL + kv[1] + "|" + kv[0];
    const id = "id='" + sanitizeString(params).replaceAll("|","").replaceAll(" ","") + "'";
    result = "<button-nav class='categorySelect' " + id +  " title='" + params + "' onclick='setFilter(this)'>" + kv[0] + "</button-nav>";
  }

  if(kv[1]!== undefined){
    const opt = kv[1].split(delimiter);
    if(opt.length>1){
      let optionsCtrl=""
      for(let x=1; x<opt.length; x++){
        const optItems= opt[x].split(",");
        optionsCtrl += "<tr class='w-full'><td class='font-extrabold w-[100px]'>"+ optItems[0] +":</td>" ;
        optionsCtrl +="<td><select class='apiOption' id='" + optItems[0] + "'>";
                for(let i=1; i<optItems.length; i++){
                  optionsCtrl+="<option value='" + optItems[i] + "'"+ 
                                      (i===1 ? "selected=selected" : "") +">" + optItems[i] + 
                              "</option>";
                }
        optionsCtrl+="</select></td></tr>";
      } 
      optionsCtrl= "<table style='display:none; width:100%' id='extraFilter'>" + optionsCtrl +  "</table>"; 
      result = result + "<br>" + optionsCtrl ;
    }
  }
  
  return result;
}



async function fetchSpecialType(URL, status) {
  const jsonFolder = "src/___memoized/___JSON/";
  let jsonFile = URL.split("&api_key")[0]; // get rid of the api_key in saving for memoizing.
  jsonFile = sanitizeString(jsonFile); 
  const cutter = jsonFile.length - 60;
  jsonFile = jsonFolder + jsonFile.substr(cutter <= 0 ? 0 : cutter) ;
  return await readFileAndHandleErrors(jsonFile, URL, status)
          .then(data => {
            console.warn('Existing API result:', data);
            return data;
          })
          .catch(error => {
            console.error('***API ERROR:', error);
            return '***API ERROR:' +  error;
          });
  
  }
  
async function readFileAndHandleErrors(jsonFile, URL, status) {
        try {
          //! so it will always cannot find the file.
          jsonFile = "asfdasfasferrorout";
          const data = await fsrw.readFile(jsonFile, 'utf8');
          result = data; // result = existing data if file exists
        } catch (error) 
        {
              if (error.code === 'ENOENT') {
                console.clear();
                console.log(`File '${jsonFile}' does not exist.`);
                    const newURL = (URL.indexOf("https:")>=0 || URL.indexOf("http:")>=0) ? URL : _ROOT_KEY.ROOT + URL + _ROOT_KEY.KEY;
                    
                    console.clear();
                    console.warn("newURL",newURL)
                    
                    const response = await fetch(newURL);
                    const fetchedData = await response.json();
                    let processedData;
                          if (status === "getDataFields") {
                            processedData = getDataFields(fetchedData);
                          } else if (status === "toHTMLTable") {
                            processedData = toHTMLTable(fetchedData);
                          } else {
                            throw new Error('Invalid status provided.'); // Handle invalid status
                          }
                          const fileContents = JSON.stringify(processedData);
                          //! Ignre these for testing so it won't save 
                          //return await fsrw.writeFile(jsonFile, fileContents, 'utf8').then( (err)=> {
                          //     if(err) result = "ERR:" + err.code;
                          //     console.log('Data written to ' + jsonFile);
                          //     return fileContents;
                          // })
                          return fileContents;
                }
                else{
                  return `'${jsonFile}' is NOT a valid filename`;
                }   
        }
}



function throwError(error)
{
  console.error(error);
  throw error;
}

function getDataFields(JSON, specialType){  
        let filterFields=[];
        const rnd =  sectionID;
        let newJSON = [];
        if(specialType){
          result = "";
        }

        let meta = JSON.meta;
        for(let key in meta.dataTypes) {
          filterFields.push(key)
          let fieldName = key;
          let caption =  meta.labels[fieldName];
          let dataType = meta.dataTypes[fieldName];
          const component = `<api-caption>${caption}</api-caption><api-ctrl id='${fieldName}' class='${dataType}'></api-ctrl>`; 
          newJSON.push(component);
        }

        console.table(newJSON);

        return newJSON.map(field => 
          {
            const apiCaption = field.match(/<api-caption>(.*?)<\/api-caption>/)[1];
            const apiCtrlId = field.match(/id='(.*?)'/)[1];
            const apiCtrlClass = field.match(/class='(.*?)'/)[1];
            return  `<div class='fieldComponent grid grid-cols-2'>
                    <div class='flex min-w-60 text-xs'><input type='checkbox' class='checkbox mr-4 cb_${apiCtrlId}' id='cb_${apiCtrlId}_${rnd}' checked='checked'/>${apiCaption}:</div>
                    <div>       <div class='max-w-20 opr_${apiCtrlId}' id='opr_${apiCtrlId}_${rnd}'></div>
                    <input class='${apiCtrlClass} field${rnd}' onchange='showOpr(this)' ${classType(apiCtrlClass)} id='${apiCtrlId}_${rnd}' ></div>
                    </div>`
          }).join('').replaceAll("\n","") 
                    +  `<div class='my-2 text-center'><hr><button-nav class='disabled submitBtn' id='field${rnd}' onclick='searchFilter(this)'>Search</button-nav></div>`; 
  }


let _ROOT_KEY; 

function extractAPI(agencyName){
  let API_OBJECT = [];
  API_OBJECT.push( {"agencyName": "NASA",  "ROOT": "https://api.nasa.gov/", "KEY" : "&api_key=vbLbGfNJGHnixVbFnZ4qthBgHYQfzO2bmaXk9PFR" } );
  API_OBJECT.push( {"agencyName": "DVA",   "ROOT": "https://sandbox-api.va.gov/services/", "KEY" : "" } );
  API_OBJECT.push( {"agencyName": "DHS",   "ROOT": "https://api.dhsprogram.com/rest/dhs/", "KEY" : "" } );
  API_OBJECT.push( {"agencyName": "Treasury",   "ROOT": "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/", "KEY" : "" } );
  
  const index =  API_OBJECT.find( (element) =>  element.agencyName==agencyName ) ;
  _ROOT_KEY = index;
  return index;
}

/*
https://sandbox-api.va.gov/services/va_facilities/v1/


https://api.fiscaldata.treasury.gov/services/api/fiscal_service
https://sandbox-api.va.gov/services/veteran-confirmation/v1/status
*/

//! To easily/clearly enclose items per hierarchy
    function _DIVHEAD(item){
      return "<api-header><b class='p-4'>" + item + "</b></api-header>";
    }

    function _LINKNAV(item, option=""){
      return "<a class='"+ option +"'>" + item + "</a>";
    }

    function _DIVISION(item){
      return "<api-div>"+ item +"</api-div>";
    }
    
    function _HTMX(item){
      return "<HTMX>"+ item +"</HTMX>";
    }

    function _SECTION(item){
      return "<api-section>"+ item +"</api-section>";
    } 

    function _ARRAY(item){
      return "<api-array>"+ item +"</api-array>";
    } 

    function _OBJECT(item){
      return "<api-object>"+ item +"</api-object>";
    } 

    function _VALUE(item){
      return "<api-value>"+ item +"</api-value>";
    } 
    function _KEY(item){
      return "<api-key>"+ item +"</api-key>";
    } 
    function _ROOT(item){
      return "<api-root>"+ item +"</api-root>";
    } 
    function _NODE(item){
      return "<api-node>"+ item +"</api-node>";
    }
    function _COMP(item){
      return "<api-component>"+ item +"</api-component>";
    }
    function _UI(item){
      return "<api-ui>"+ item +"</api-ui>";
    }

    function keyStyle(item){
      return item.toUpperCase().replaceAll("_", "  ");
    }

    function isLinkable( item ){
      if(typeof item!="string") return "No assigned value";
      if(item.indexOf("http") >=0 )
      {
        const isPhoto = item.indexOf("jpg") >=0 || item.indexOf("png") >=0 || item.indexOf("gif") >=0 || item.indexOf("bmp") >=0; 
        return "<span class='urlMedia' onclick='apiPop(`" + item + "`)'>" + (isPhoto? "⎗":"⎆") + "</span>";
      }
      else
      return item;
    }
    function nodeInteract(item, level){
      const id = "btn" + new Date().getTime();
      const nodeBtnExpand =   `<button class='nodeButton hidden' (click)="nodeCollapse('`+ id  + `')"  title='Collapse'> + </button>`;
      const nodeBtnCollapse = `<button class='nodeButton' (click)="nodeExpand('`+ id  +`')" title='Expand'> - </button>`;
      // return _NODE(  (level>=3) ? 
      //       ( nodeBtnExpand + "<span id='"+ id + "'> " + nodeBtnCollapse + item +  "</span>" )
      //               : item );

      return  (level>=9) ? "..." : item ;
    }
//!==================================================

//! Shortcut the structure 
    function isObject(element){
      return (element!= null && element!= undefined && typeof element==="object");
    }
    function isArray(element){
      return Array.isArray(element);
    }
//!==================================================

function toHTMLTable(JSON, level=0){
  let result = "";
  if(isObject(JSON))
  {
    level++;
    if(isArray(JSON))
    {
      for(let value of JSON){
        result+= (level<=1 ? _ROOT:_ARRAY)( toHTMLTable(value, level)) ;
        // _CELL( toHTMLTable(value, level));
      }
    }
    else 
    {
      for (const [key, value] of Object.entries(JSON)) {
        const label = _KEY( keyStyle(key) );
        const item = isObject(value)  ? _NODE( nodeInteract(toHTMLTable(value, level), level) ) 
                                      : _VALUE( isLinkable(value??'N/A')) ;
        result += _OBJECT( label + item  );
      }
    }
  }
    return result; 
}


// function toArrayObjects(JSON){
//   let result = [];
//   if(isObject(JSON))
//   {
//     if(isArray(JSON))
//     {
//       for(let value of JSON){
//         result.push( toArrayObjects(value) );
//       }
//     }
//     else 
//     {
//       for(const [key, value] of Object.entries(JSON) ){
//         result.push( { "key": key, "value": isObject(value) ? toArrayObjects(value) : value });
//       }
//     }
//   }
//     result = result;
// }



