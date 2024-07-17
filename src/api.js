import express, { urlencoded } from 'express';
import pkg from 'body-parser';
import cors from 'cors'; // Install cors middleware: npm install cors
import fetch from 'node-fetch';
import compression from 'compression';
import fsrw from "fs/promises";
import { randomBytes, randomInt } from 'crypto';

const { json } = pkg;
const app = express();
app.use( compression());
app.use(cors({
  origin: ['http://localhost:4200' ],

  // origin: ['https://nasa.trium-veritas.com', 'https://nasa.3rdwind.net' ],
  methods: ['GET', 'POST'], // Adjust as needed
  headers: ['Content-Type', 'Authorization', 'X-Custom-Header', 'Accept', 'Accept-Encoding' ], // Adjust as needed
  credentials: true
}));


app.use(json()); 
app.use(urlencoded( {extended: true}));
const PORT = 3000;
let openInfo={};
let delimiter = "♽";
let sectionID;
let method = "post";


//!FETCH-FIELDS
app.post('/htmx_fetch_fields', async (req, res) => {
  try {
          let prefix ="";
          let suffix ="";
          let URL ="";
          let agency    = req.body.agency;
          let agencyURL = req.body.outerSpace;   //.agencyFields;
          let info = extractAPI(agency);
          let html ="";
          prefix= info.ROOT
          const isSpecialType = "NO"; // = req.body.specialTypeAgency;
          sectionID = req.body.sectionID;
              if(agency==="DVA"){
                    const bearerToken = "Bearer 0oau8p8n6nWLAEv9g2p7";
                    URL =   'https://sandbox-api.va.gov/services/fhir/v0/r4/';
                    const bearer ={ headers: { 'Authorization': bearerToken,     'accept': 'application/fhir+json' }};
              }
                        
              method = req.body.method;
          const specialType = getSpecialTypeCase(agencyURL.toUpperCase()); 
          if(specialType.length===0)
          {
            suffix="?page[number]=1&page[size]=1";
            // URL = (prefix + agencyURL + suffix).replaceAll("//", "/") + info.KEY;

            URL = agencyURL ;
            html = await fetchSpecialType(URL,"getDataFields");
          }
          else 
          {
            html = specialType;
          }
          res.status(200).send(html); 
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
app.post('/htmx_fetch_data', async (req, res) => {
  try {
    let endPoint = req.body.endPoint??""; 
    if(req.body.method!="") method=req.body.method;
      const info = extractAPI(req.body.agency);
      // endPoint = info.ROOT + endPoint;
      if(info.KEY!="") 
      {
        endPoint += req.body.outerSpace.replaceAll("_METEORITES_", "");
        // endPoint += (endPoint.includes("?") ? "&" : "?") + info.KEY; 
      }
      else {
        endPoint = req.body.outerSpace;
        if(req.body.agency==="DVA"){
              html = await fetchSpecialType(endPoint, "" );
        }
      }
   
      endPoint = endPoint.replace("&&", "&").replace("?&", "?");
    let html = await fetchSpecialType(endPoint, "toHTMLTable" );
    if( html.indexOf("-root></api-root")>=0 || html==="")  
    html="<h1 class='text-4xl bg-red-400 p-6 text-white'>NO RECORD FOUND.</h1>"
    res.status(200).send( html ); 
  }
  catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

//! FETCH-PROTO
app.post('/htmx_fetch_proto', async (req, res) => {
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
    return ["Veteran Identifier", "Claims", "5103 Waiver", "Intent To File", "Disability Compensation", "Power of Attorney"]

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

let specialPrefix;

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
      const temp =  specialTypeObject.replaceAll("_VERSION_", kv[1]).replaceAll("_ENTITY_", entity);
      const PL = temp.split("filter=");
      specialPrefix = PL[0]
      payLoad=PL[1];
    }
    result = `<button-nav (click)="showInfo('${payLoad}')">${kv[0]}</button-nav>`;
  } else {
    const params =  (agencyURL + kv[1]??"" + "|" + kv[0]).replaceAll("undefined","");
    const id = "id='" + sanitizeString(params + kv[0] ).replaceAll("|","").replaceAll(" ","") +  "'";
    result = "<button-nav class='categorySelect' " + id +  " title='" + params + "' (click)='this.svc.setFilter(this)'>" + kv[0] + "</button-nav>";
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
          result = data; 
        } catch (error) 
        {
              if (error.code === 'ENOENT') {
                console.clear();
                console.log(`File '${jsonFile}' does not exist.`);
                    const newURL = (URL.indexOf("https:")>=0 || URL.indexOf("http:")>=0) ? URL : _ROOT_KEY.ROOT + URL + _ROOT_KEY.KEY;
                    console.clear();
                    console.warn("newURL",newURL)
                    const response = await fetch(newURL);
                    const fetchedData=  await response.json();
                    if(status=="toHTMLTable"){
                      return toHTMLTable(fetchedData)
                    }
                    else
                    return fetchedData;
                    //! TODO: If I wanted to send raw data...
                    //!! comment out the ff code block
                    // let processedData = fetchedData;
                          // if (status === "getDataFields") {
                          //   processedData = getDataFields(fetchedData);
                          // } else if (status === "toHTMLTable") {
                          //   processedData = toHTMLTable(fetchedData);
                          // } else {
                          //   throw new Error('Invalid status provided.'); // Handle invalid status
                          // }
                      //  const fileContents = JSON.stringify(processedData);
                      
                      //! Ignore these for testing so it won't save 
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

let _ROOT_KEY; 

function extractAPI(agencyName){
  let API_OBJECT = [];
  API_OBJECT.push( {"agencyName": "NASA",       "ROOT": "https://api.nasa.gov/", "KEY" : "api_key=vbLbGfNJGHnixVbFnZ4qthBgHYQfzO2bmaXk9PFR" } );
  API_OBJECT.push( {"agencyName": "DVA",        "ROOT": "https://sandbox-api.va.gov/services/", "KEY" : "" } );
  API_OBJECT.push( {"agencyName": "DHS",        "ROOT": "https://api.dhsprogram.com/rest/dhs/", "KEY" : "" } );
  API_OBJECT.push( {"agencyName": "TREASURY",   "ROOT": "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/", "KEY" : "" } );
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
      return "<htmx>"+ item +"</htmx>";
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


app.listen(PORT, () => {
  console.warn(`[2] Server started and listening on port ${PORT}`);
});