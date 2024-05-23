// import { trigger } from '@angular/animations';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { is } from 'cheerio/lib/api/traversing';


type flexible = Iterable<any> | undefined| Array<string>;
interface KV { [key:string] : any};

@Injectable({
  providedIn: 'root'
})
export class OpenAPIService {
  constructor(  ) {  }



  

  baseSections: Array<any> =  
          [
            /*
            .##....##.......###........######........###...
            .###...##......##.##......##....##......##.##..
            .####..##.....##...##.....##...........##...##.
            .##.##.##....##.....##.....######.....##.....##
            .##..####....#########..........##....#########
            .##...###....##.....##....##....##....##.....##
            .##....##....##.....##.....######.....##.....##
            */
            { "NASA":
              [
                {"APOD":"planetary/apod/"},
                {"DB of Notifications, Knowledge, Information":"DONKI/"},
                {"Asteroids Neo":"neo/rest/v1/"},
                {"Earth Imagery":"earth/imagery/"},
                {"EPIC":"epic/api/natural/"},
                {"OSDR":"https://osdr.nasa.gov/osdr/data/osd/files/"},
              ]
            },

            /*
            .########.....##.....##.....######.
            .##.....##....##.....##....##....##
            .##.....##....##.....##....##......
            .##.....##....#########.....######.
            .##.....##....##.....##..........##
            .##.....##....##.....##....##....##
            .########.....##.....##.....######.
            */
            { "DHS":
              [
                {"National Terrorism Advisory System":"*"},
                {"FEMA":"FEMA"},
                {"TSA Web Service":"*"},
              ]
            },

            /*
            .########.....##.....##.......###...
            .##.....##....##.....##......##.##..
            .##.....##....##.....##.....##...##.
            .##.....##....##.....##....##.....##
            .##.....##.....##...##.....#########
            .##.....##......##.##......##.....##
            .########........###.......##.....##
            */
            { "DVA":
              [
                {"Patient Health":"fhir/v0/r4/"},
                {"Benefits Claims":"claims/v2/"},
                {"Service History and Eligibility":"veteran_verification/v2/"},
              ]
            },

            /*
            .########....########.....########.......###........######.....##.....##....########.....##....##
            ....##.......##.....##....##............##.##......##....##....##.....##....##.....##.....##..##.
            ....##.......##.....##....##...........##...##.....##..........##.....##....##.....##......####..
            ....##.......########.....######......##.....##.....######.....##.....##....########........##...
            ....##.......##...##......##..........#########..........##....##.....##....##...##.........##...
            ....##.......##....##.....##..........##.....##....##....##....##.....##....##....##........##...
            ....##.......##.....##....########....##.....##.....######......#######.....##.....##.......##...
            */
            { "TREASURY": 
              [
                {"120 Day Delinquent Debt Referral Compliance Report":"/v2/debt/tror/data_act_compliance"},
                {"Redemption Tables":"/v2/accounting/od/redemption_tables"},
                {"Unemployment Funds (Social Security Act Title XII":"/v2/accounting/od/title_xii"},
                {"Average Interest Rates on U.S. Treasury Securities":"v2/accounting/od/avg_interest_rates"},
              ]
            }
          ]

          Agencies:   Array<string> =["NASA", "DVA" , "TREASURY", "DHS", "DHA"];
          Divisions:  flexible =[] ;
          Sections:   flexible =[];
          
          loop:number =0;
          delimiter:string="♽";
          agencyName:string="";
          
          selectedAgency:   WritableSignal<string> = signal("");
          ___semaphore:     WritableSignal<string> = signal("This is the current value of semaphore....");
          toastMessage:     WritableSignal<string> = signal("");
          toastMessage2:    WritableSignal<string> = signal("");
          agencyAbstract:   WritableSignal<string> = signal("");
          _satelliteMessage:       WritableSignal<string> = signal("");
          

          chatMessage  = signal("");
          addendum     = signal("");
          cursorX = signal("");
          cursorY = signal("");
          northernLights = signal("")
          
          openSections :    Array<string> =[];
          baseAPI : string =         "http://localhost:3000";
          panelType =       ["fields", "data", "proto"]; 
          
          htmxObject: Array<{ "key": string, "value": Object}>=[]; 
          KVsignal = signal(< KV | null>null);

          

// ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
// ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
// ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
// ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
// ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
// ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
// ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  







getHTMXValue(id: string){
  const index =  this.htmxObject.findIndex( i => { i.key===id  } )    
  return index;
}

//! Get the List of Sections under a selected Agency
      getList(root: string) {
        // if(source.length===0) source=this.baseSections;
        for (const section of this.baseSections) {
          if (Object.keys(section)[0] === root) {
            if (Array.isArray(section[root])) {
              const sections = section[root].map( (section: {}) => section );
              return  sections; 
            }
          }
        }
        return  [];
      }



      getSectionsList(root: string=''){
        let menusections =[];
                        if(root==="") return [];
                        const sections =  this.getList(root);
                        for( this.loop=0; this.loop<sections.length; this.loop++)
                        {
                          const section = sections[this.loop]; 
                          let kv: Array<string> = [];
                          let value:string  = Object.values(section)[0] +"" ;
                          kv.push( Object.keys(section)[0] + (value===""?"": this.delimiter ));
                          kv.push(value);
                          menusections.push(kv.toString())
                        }
                        return menusections
                        // return this.getList(rootID, menusections);
        }


        async spaceFetch(obj: object, paneNumber: number, id: string =""){
         
          const headerDict = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Accept-Encoding': 'deflate, gzip;q=1.0, *;q=0.5' }
          let temp =  await fetch(this.baseAPI +  "/htmx_fetch_" + this.panelType[paneNumber], 
                    {
                    method: 'POST',
                    headers: new Headers( headerDict ),
                    body: JSON.stringify(obj),
                    } 
          )
          if (temp.ok) {
                    let  dataFields =  paneNumber==0 ? await temp.json() : await temp.text();
                    let result = paneNumber===0 ? this.formatDataFields(dataFields, id) : dataFields;
                    result = result.replaceAll('"',"'");
                    this.northernLights.set(result);
                    return result;
          } else {
                    console.error('Error:', temp.status, temp.statusText);
                    console.error(temp.statusText + "", JSON.stringify(obj));
                    return "error";
          }
        }

 
      

      idFormat(id:string){
        let result = id.replaceAll(" ", "-").replace("|","").replace("\/","").replaceAll("*","").replaceAll("http\:\/", "NET").replaceAll(":", "").replaceAll(this.delimiter,"_");
        result = result.substring(0,15);
        result = result.replaceAll(",","");
        return  result;
      }

      allButOne(allClass: string, oneID: string, action: string="hidden"){
        const elements = document.querySelectorAll("." + allClass.replace(".", "") );
        const flip: boolean = (action === "hidden");
        for(let x=0; x< elements.length; x++){
          elements[x].classList[ flip ? "add" : "remove"](action);
        }
          document.querySelector("#" + oneID.replace("#",""))?.classList[ flip ? "remove" : "add"](action);   
      }
      
      
      toastNotify(message: string){
        this.toastMessage.set(message);
        if (message=="") this.negateItem("#toastNotify")
        else this.affirmItem(".toastNotify")
      }

      writeAbstract(info:string){
        this.agencyAbstract.set(info); 
      }

      toastNotify2(message: string){
        this.toastMessage2.set(message);
        if (message=="") this.negateItem("#toastNotify2")
        else this.affirmItem(".toastNotify2")
      }

      negateItem(id:string, action: string="hidden"){
        let flip : boolean = (action ==="hidden");
        if(action ===""){
          action="hidden";
          flip = false;
        }
        const firstChar = id.substring(0,1);
        if( !"*.".includes(firstChar) ) {
          this.toastNotify("The item should be labelled with the [# or .] selector"); return;
        }
        if(firstChar===".") {
          const elements = document.querySelectorAll(id);
          for(let x=0; x<elements.length ; x++) {
            elements[x].classList[ flip ? "add" : "remove" ](action);
          } return;
        }
          document.querySelector(id)?.classList[ flip ? "add" : "remove" ](action);
      }

      affirmItem(id: string,action:string="")
      {
        this.negateItem(id, action);
      }



      getSectionID(parm = "sectionID"){
        let x =  JSON.parse(sessionStorage.getItem("OPENAPI-OBJ")??"");
        return x[parm];
      }  



_DIVHEAD(item: string, option: string=""){
return `<api-header class='w-full'><b class='px-4 w-full ${option}'>${item}</b></api-header>`;
}

_LINKNAV(item: string, option:string=""){
return `<a class='${option}'>${item}</a>`;
}

_DIVISION(item: string, option: string=""){
  return `<api-div ${option}>${item}</api-div>`;
  }


_HTMX(item: string){
return "<htmx>"+ item +"</htmx>";
}

_SECTION(item: string){
return "<api-section>"+ item +"</api-section>";
} 

_ARRAY(item: string){
return "<api-array>"+ item +"</api-array>";
} 

_OBJECT(item: string){
return "<api-object>"+ item +"</api-object>";
} 

_VALUE(item: string){
return "<api-value>"+ item +"</api-value>";
} 
_KEY(item: string){
return "<api-key>"+ item +"</api-key>";
} 
_ROOT(item: string){
return "<api-root>"+ item +"</api-root>";
} 
_NODE(item: string){
return "<api-node>"+ item +"</api-node>";
}
_COMP(item: string){
return "<api-component>"+ item +"</api-component>";
}
_UI(item: string){
return "<api-ui>"+ item +"</api-ui>";
}


isLinkable( item: string ){
if(typeof item!="string") return "No assigned value";
if(item.indexOf("http") >=0 )
{
const isPhoto = item.indexOf("jpg") >=0 || item.indexOf("png") >=0 || item.indexOf("gif") >=0 || item.indexOf("bmp") >=0; 
return "<span class='urlMedia' onclick='apiPop(`" + item + "`)'>" + (isPhoto? "⎗":"⎆") + "</span>";
}
else
return item;
}
nodeInteract(item: string, level: number){
const id = "btn" + new Date().getTime();
const nodeBtnExpand =   `<button class='nodeButton hidden' (click)="nodeCollapse('`+ id  + `')"  title='Collapse'> + </button>`;
const nodeBtnCollapse = `<button class='nodeButton' (click)="nodeExpand('`+ id  +`')" title='Expand'> - </button>`;
return  (level>=9) ? "..." : item ;
}
//!==================================================

//! Shortcut the structure 
isObject(element: any){
return (element!= null && element!= undefined && typeof element==="object");
}
isArray(element : any){
return Array.isArray(element);
}
//!==================================================

sanitizeString(item: string){
const unwantedChars = "\/!`,][:#&}{*$\"\'";
for(let x=0; x<unwantedChars.length; x++){
  item = item.replaceAll(unwantedChars.substr(x,1), "");
}
item = item.replaceAll("=", "EQ");
item = item.replaceAll("?", "QQ");
return item;
}
    
    
    
    
    
    iterateObject(obj: any, agencyURL: any) : any{
      let result="";
      if(typeof obj!=="object") result = this.specialTypeParser( obj, agencyURL);   
      else {
              if(Array.isArray(obj)){
                    for(let x=0; x<obj.length; x++)
                    {
                      if(typeof obj[x]==="object"){
                              for (const [key, value] of Object.entries(obj[x]))
                                {
                                  if(typeof value==="object"){
                                      result  += this._DIVISION(this._DIVHEAD(key) + this._SECTION(this.iterateObject(value, agencyURL)));
                                  } 
                                  else {
                                      result += this.specialTypeParser( value, agencyURL, true );
                                  }
                                }
                      }
                      else {
                        console.log("RESULT 1", result)
                        result  +=  this.specialTypeParser( obj[x], agencyURL);
                      }
                    }
              }
              else {
                  console.log("RESULT 2", result)
                  for (const [key, value] of Object.entries(obj))
                    {
                      if(typeof value==="object"){
                          result  += this._DIVISION(this._DIVHEAD(key) + this._SECTION(this.iterateObject(value, agencyURL)));
                      } 
                      else {
                          result += this.specialTypeParser( value, agencyURL, true );
                      }
                    }
              }
       
      }
      console.log("RESULT", result)
      return result;    
    }





     specialTypeParser( item: any, agencyURL: any, isSpecialType=false ){
      let kv = item.split(":");  
      let result;
      let specialPrefix ="";
      if(isSpecialType){
        console.log("SPECIAL TYPE: " +item)
        //!!! TO DO SECTION
            const openInfo: any = {};
            openInfo.RECORDS=`https://www.fema.gov/api/open/_VERSION/_ENTITY_`
            openInfo.META=`https://www.fema.gov/api/open/_VERSION_/OpenFemaDataSets?$filter=name_EQUALS_|_ENTITY_|`;
            const specialTypeObject = openInfo.META;// + delimiter + openInfo["RECORDS"];  
            const entity = kv[0].replaceAll(" ","");
            let payLoad;
            if(kv[1]!==undefined)
              {
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
              }
            result = `<button-nav (click)="showInfo('${payLoad}')">${kv[0]}</button-nav>`;
      } 
      else {
        console.log("NOT A SPECIAL TYPE: " +item)
              const id = `id='${this.currentID}---${(kv[1]??kv[0]).replaceAll(' ','').replaceAll(',','')}'`;
              result = `<div class='dataFields ${this.currentID}Group text-lg' ${id}  onclick='submitFilter(this)' >${kv[0]}</div>`;
      }
    
      if(kv[1]!== undefined){
              const opt = kv[1].split(this.delimiter);
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
                optionsCtrl= "<table class='px-3 py-[2px] w-full hidden' id='extraFilter'>" + optionsCtrl +  "</table>"; 
                result = result +  optionsCtrl  ;
              }
            }
      
      return result;
    }
    
    runAction(action: Array<string>) {
      try {
        action.forEach( item => eval(item));
        
      } catch (e) {
        console.error('Error executing action:', e);``;
        return false;
      }
      return true;
    }


  formatSpecial(specialType: any, rnd: string){
     let html : string ="";
     rnd = this.idFormat(rnd);
     const vipStatus: boolean = (typeof specialType ==="object")??false; 
              console.table("special Type " + vipStatus , specialType)
              for(let x=0; x<specialType.length; x++) {
                  if(!vipStatus) { 
                    const  rnd = this.idFormat(specialType[x])    
                    if( specialType[x].includes(">") ){
                            const parm = specialType[x].split(">");
                            let  extra=""
                            if(parm.length==3) extra = this.classRange(parm[2]); 
                            const id = parm[0].replaceAll(" ","")
                            html+= `<div class='grid grid-cols-2 mx-2 text-start'>${parm[0].toUpperCase()}: <input id="${id}${rnd}" ${extra}  ${this.classType(parm[1])}  /></div>`;
                        }
                  }
                  html+= this.iterateObject(specialType[x], rnd);
              }
 
            const today = new Date();
            const defaultDate= "pattern='[0-9]{4}-[0-1][0-9]-[0-3][0-9]' value='" + today.toISOString().slice(0, 10) +"'";
            const thirtyDaysAgo = new Date(today.setDate(new Date().getDate() -30));
            const defaultDate30= "pattern='[0-9]{4}-[0-1][0-9]-[0-3][0-9]' value='" + thirtyDaysAgo.toISOString().slice(0, 10) +"'";
            let baseFilter = "<div class='grid grid-cols-2'><div>Start Date:</div><input class='mb-1' type='date' "+ defaultDate30 
              +" id='start_date'/><div>End Date:</div><input type='date' "+ defaultDate 
              +" id='end_date'/></div>";
            const urlSubmit = `onclick='submitNow(this)'`;
            baseFilter += ` <button id='submitNow${this.currentID}' class='submitNow' ${urlSubmit}>Submit</button>`;
            return html = this._HTMX(`${html}<hr><div id='result${this.currentID}' class='my-2 text-center'>${baseFilter}</div>
            <hr><div id='selectedFilters${this.currentID}' class='text-xs'></div>
            `);
  }

  currentSection = "";
  currentID = "";

 //! Only TREASURY use this     ????  
 formatDataFields(JSON: any,  sectionName: string){  
  const sectionID: string = this.idFormat(sectionName);
  let filterFields=[];
  this.currentID = sectionID;
  this.currentSection = sectionID + Math.random().toString().replace(".", "");
  const rnd =  sectionID;
  let newJSON = [];

  let meta = JSON.meta;
  if(meta===undefined){
    return this.formatSpecial(JSON, rnd)
  }

  for(let key in meta.dataTypes) {
    filterFields.push(key)
    let fieldName = key;
    let caption =  meta.labels[fieldName];
    let dataType = meta.dataTypes[fieldName];
    let pattern = meta.dataFormats[fieldName];
    const component = `<api-caption>${caption}</api-caption><api-ctrl id='${fieldName}' title='${pattern}' class='${dataType}'></api-ctrl>`; 
    newJSON.push(component);
  }

  console.table(newJSON);

  return newJSON.map(field => 
    {
      const apiCaption = field.match(/<api-caption>(.*?)<\/api-caption>/)![1];
      const apiCtrlId = field.match(/id='(.*?)'/)![1];
      const apiTitle = field.match(/title='(.*?)'/)![1];
      const apiCtrlClass = field.match(/class='(.*?)'/)![1];
      return  `<div class='dataFields ${this.currentID}  text-center mx-4 hover:font-bold grid grid-cols-2'>
              <div class='flex min-w-[200px]  max-w-[350px] text-xs'><input type='checkbox' class='checkbox mr-4 cb_${apiCtrlId} ' id='cb_${apiCtrlId}_${rnd}' checked='checked'/>${apiCaption}:</div>
              <div class='flex ml-2'>  <div class='w-24 opr_${apiCtrlId}' id='opr_${apiCtrlId}_${rnd}'></div>
              <input class='${apiCtrlClass} field${rnd}' title='${apiTitle}' onchange='showOpr(\"searchField${rnd}\")' ${this.classType(apiCtrlClass)} id='${apiCtrlId}_${rnd}' ></div>
              </div>`
    }).join('').replaceAll("\n","") 
              +  `<div class='mt-2 text-center'><hr><button class='mt-5 submitSearchFilter' id='submitSearchFilter${rnd}' title='just an example'  onclick='submitSearchFilter(this)'>Search</button></div>`; 
}

classType(type: string){
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

classRange(type: string){
  if(!(type.indexOf("|")>=0) ) return "";
      const vals = type.split("|");
      let result = `type='range' class='range' min='${vals[0]}'   max='${vals[1]}'`;
      if(type.length==3) result+= `  step='vals[2]'`;
      return result
}

  

}
