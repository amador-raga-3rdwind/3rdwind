import { Injectable, signal } from '@angular/core';
import moment from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlobalExpose } from '../decorators/global.decorator';
import { _makeDomArray } from 'cheerio/lib/api/manipulation';
import { DataInputService } from './DataInputService';


interface JsonObject {[key: string]: any;}
interface KVpair { key: string, value: string };

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor( public sanitizer: DomSanitizer, public input: DataInputService) {
    (
      UtilsService.prototype as any).instance = this;
   }


  smartData: any;
  isSmartRotate = false;
  _date = new Date();
  _todayStr = this._date.toUTCString();
  _month = this._date.getMonth() + 1;
  _week = this._date.getDay();
  _year = this._date.getFullYear();
  _day = this._date.getDate();
  _today = this._date;
  public _vault = "";
  northernStar = signal("");



  allButOne(allClass: string, oneID: string, action: string = "hidden") {
    const elements = document.querySelectorAll("." + allClass.replace(".", ""));
    const flip: boolean = (action === "hidden");
    for (let x = 0; x < elements.length; x++) {
      elements[x].classList[flip ? "add" : "remove"](action);
    }
    document.querySelector("#" + oneID.replace("#", ""))?.classList[flip ? "remove" : "add"](action);
  }


  DOMString(HTMLstring: string, tag:string="dom"){
    const insert = tag=="dom" ? tag : "b";
    let temp = new DOMParser().parseFromString(`<${insert}>` + HTMLstring + `</${insert}>`, "text/html");
    return temp.querySelector(tag)?.innerHTML;
  }


  hideStyle: string = "m-0 mb-1 w-full rounded-none outline-none bg-transparent";;
  seekStyle: string = "m-0 mb-1 w-full outline-1 outline-slate-500 rounded-t-md bg-stone-300 sections";;
  qSelectClass(className: string){ return document.querySelectorAll("." + className)};
  qSelectID(id: string){ return document.querySelector("#" + id)};

  @GlobalExpose("_hideAndSeek")
  hideAndSeek(hide: string, seek: string=""){
      const button = "submitButton" + hide;
      const section = "section" + hide;
      if(seek==="") {seek='divisions' + hide; hide="divisions"}
      this.qSelectClass(hide).forEach( (item) => { item.classList.add("hidden")});
      this.qSelectID(seek)?.classList.remove("hidden");
      this.qSelectClass("submitButton").forEach( (item) => { item.classList.add("hidden")});
      this.qSelectID(button)?.classList.remove("hidden");
      this.qSelectClass("sections").forEach( (item) => item.className="sections");
      this.seekStyle!.split(/\s+/).forEach( (x) => this.qSelectID(section)?.classList.add(x) );
  }




modNo = signal(0);
loading = `<div class='font-extrabold text-center text-slate-500 text-5xl'>Reaching out...<hr><span class="loading text-red-400 loading-bars loading-7xl"></span></div>`;

  @GlobalExpose("_interactiveInput")
  interactiveInput(val: string, id: string){
      const items = id.split("_");
      const method = items[0].toLowerCase();
      const fieldName = items[1];
      const ID = items[2];
      const selector = (`#${method=='path'? 'label_' + fieldName : 'querySlot'}_${ID}`);
      const element = document.querySelector(selector);
      const pattern: RegExp = <RegExp>JSON.parse(element?.getAttribute("pattern") as string);
      if(pattern && !pattern.test(val)){
        alert("NOT ALLOWED")
        element!.innerHTML = val.slice(0,-1);
        return
      }
      if(val===""){
        if(method=="path") element!.innerHTML = "{" + fieldName + "}";
        else setTimeout(()=> { element!.innerHTML = element!.innerHTML.replace(fieldName +"=", "");}, 200);
      }
      else {
        if(method==="path") element!.innerHTML = val;
        else element!.innerHTML =  fieldName + "=" + val;
      }
  }

  messageNorthStar(message: string="  "){
    const northernStar = document.querySelector("#apiResult");
    if(northernStar) northernStar!.innerHTML = "" + message;
  }




@GlobalExpose("_setURL")
async setURL(url: string='', ver:number=1){
      const baseURL = `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v${ver}/accounting/od/`;
      let result:any;
      try {
            let  URL =   ((url.indexOf("/v")==0) ? "https://api.fiscaldata.treasury.gov/services/api/fiscal_service": baseURL) + url;
            // if( typeof initial === "object") URL += "?format=json&page[number]=1&page[size]=1"
            const response = await fetch(URL);
            result = await response.json();
            result = this.smartTable(result.data, "");
            this.PopUp(result, true);
      }
      catch(err){
            console.log(err);
            if(ver<3) await this.setURL(url, ver+1);
            else return [];
      }
      return;
}



  @GlobalExpose("_PopUp")
  async PopUp( message: string, topLeft: boolean = false, thisArg?: any){
        const loc = sessionStorage.getItem("cursorLocation")!.split("|");
        if(topLeft) { loc[0] = "50"; loc[1]="50" };
        const flyer =  (document.querySelector("#flyer" + this.modNo()) as HTMLDialogElement);
        if(document.querySelector("#moonShadow" + this.modNo())!.innerHTML== message) {
          message= message.replace("Reaching Out", "A little turbulence");
          flyer.showModal();
        }
        else flyer?.classList.remove("rotate-3");
        if(this.isSubstringAny(message.toUpperCase(), ".JPG,.PNG,.GIF,.BMP")
        && !message.includes("<hr></h3><div"))
        document.querySelector("#moonShadow" + this.modNo())!.innerHTML = `<img width=110% src='${message}'>`;
        else {
          if(message.trim().indexOf("http")==0) { return  await this.PopUpRef(message, event as MouseEvent) }
          document.querySelector("#moonShadow" + this.modNo())!.innerHTML = message;
        }
        flyer.showModal();
            const w=flyer.clientWidth;
            const h=flyer.clientHeight;
            const margin=20;
            let top = (parseInt(loc[1]) - h)/2
            let left = (parseInt(loc[0]) - w)/2
            if(top<=margin)   top =margin;
            if(left<=margin)  left =margin;
            if( (top + h) > (window.innerHeight-100) )  top = window.innerHeight/2 - top/2 - 150;
            if( (left + w) > (window.innerWidth-100) )  left = window.innerWidth/2 - left/2 ;
            flyer.style.top = top + "px" ;
            flyer.style.left =left + "px";
            if(this.isSubstringAny(message.toUpperCase(), ".JPG,.PNG,.GIF,.BMP")
              && !message.includes("<hr></h3><div")) {
                document.querySelector("#moonShadow" + this.modNo())!.innerHTML = `<img width=100% src='${message}'>`;
                flyer?.classList.add("rotate-3");
              }
  }


  @GlobalExpose("_mutiSelectAll")
  async mutiSelectAll(element: string = "input"){
    let status = document.querySelector("#_multi" + element);
    const selection: any = document.querySelectorAll(".multi-list");
    for(let item of selection){
        item.checked = status?.innerHTML==="Select All";
    }
    document.querySelector("#selectedfields")!.innerHTML = (status?.innerHTML==="Select All" ? "All": "");
    status!.innerHTML = ( status?.innerHTML==="Select All" ? "Uncheck All" : "Select All");
  }

  @GlobalExpose("_enableSubmit")
  async enableSubmit (ID:string, currentValue: string){
    const operator = document.querySelector(`#submitBlock${ID}`);
    operator?.classList.add("hidden");
    document.querySelector(`#footerBlock${ID}`)?.classList.remove("hidden");
    if(currentValue=="" ) return;
    operator?.classList.remove("hidden");
  }



  @GlobalExpose("_OperationSubmit")
  async _OperationSubmit (ID:string){
    if(document.querySelector(`#operation${ID}`)!.innerHTML==="Add"){
      document.querySelector(`#selected${ID}`)!.innerHTML += "<div class='m-1 py-0 h-4 drop-shadow-md btn-accent'>" +
      document.querySelector(`#${ID}Value`)?.innerHTML +
      "<button class='btn-sm btn-circle btn-warning font-extrabold text-red-800'>"
      + document.querySelector(`#${ID}Choice`)?.innerHTML + "</button>" +
      (document.querySelector(`#${ID}EntryChoice`) as HTMLInputElement)?.value + "</div>"
      document.querySelector(`#operation${ID}`)!.innerHTML = "Submit";
      this.getSelectedInputValues("", ID);
      // document.querySelector(`#footerBlock${ID}`)?.classList.remove("hidden");
    }

  }


  @GlobalExpose("_cancelEnableSubmit")
  async cancelEnableSubmit (ID:string){
    const operator = document.querySelector(`#submitBlock${ID}`);
    operator?.classList.add("hidden");
    document.querySelectorAll(`.labelGroup${ID}`).forEach( item => item.classList.remove(this.activeEffect));
    document.querySelectorAll(`.labelGroup${ID}Choice`).forEach( item => item.classList.remove(this.activeEffect));

    if(ID.includes("dropdown")){
      document.querySelector("#_multifields")!.innerHTML= "Uncheck All" ;
      (document.querySelector("#_multifields") as HTMLButtonElement).click();
    }
    document.querySelector(`#footerBlock${ID}`)?.classList.add("hidden");
  }

  activeEffect = 'text-red-700';
  defaultInput = `<input class='text-lg drop-shadow-md h-8' id="ID_HERE" onchange="_enableSubmit('Filter',this.value)" onkeyup="_enableSubmit('Filter',this.value)" >`

    @GlobalExpose("_getSelectedInputValues")
    async getSelectedInputValues(element: string, mode:string=""){
      if(!isNaN(parseInt(mode))){
        const summary=  document.querySelector("#selectedfields")
        const selection: any = document.querySelectorAll(".multi-list");
        let result: Array<string>=[];
        for (let item of selection) if(item.checked) result.push(item.id);
        else item.classList.remove("selectedItem");
        summary!.innerHTML = result.toString().replaceAll(",", ", ");
        this.enableSubmit( "dropdown" + mode, result.toString());
      }
      else {
        if(mode=="Filter" || mode=="Sort") {
          document.querySelector(`#${mode}Value`)!.innerHTML = element;
          document.querySelector(`#footerBlock${mode}`)?.classList.remove("hidden");
          if(mode=="Filter" || mode=="Sort") {
            document.querySelector(`#${mode}Choice`)!.innerHTML = "";
            let entry = (document.querySelector(`#${mode}EntryChoice`) as HTMLInputElement);
            entry.outerHTML = this.defaultInput.replace("ID_HERE", `${mode}EntryChoice`);
            const replacement = this.getFieldInput(element).split("|");
            entry = (document.querySelector(`#${mode}EntryChoice`) as HTMLInputElement);
            entry.setAttribute("type", replacement[0]);
            for(let x=1; x<replacement.length; x++){
          const attr = replacement[x].split("=");
          entry.setAttribute(attr[0], attr[1]);
            }
            if(replacement[0]=="number") entry.classList.add("range")
          else entry.classList.remove("range");
            document.querySelector(`#operation${mode}`)!.innerHTML = "Add";
            document.querySelectorAll(`.labelGroup${mode}Choice`).forEach( item => item.classList.remove(this.activeEffect));
            if(document.querySelector(`#${mode}Choice`)?.innerHTML=="")
          document.querySelector(`#${mode}Choice`)!.innerHTML="eq";
          }
        }
        if(mode=="FilterChoice") {
          document.querySelector("#" +mode)!.innerHTML = element;
        }
        if(mode==="SortChoice") {
          this.enableSubmit( mode.replace("Choice",""), element);
        }
        // if(!isNaN(parseInt(mode))){
        //   this.enableSubmit("dropdown" + mode, element);

        // }
        this.allButOne("labelGroup" + mode, "label"+element+mode, this.activeEffect);
      }
    }


  // processAction
  @GlobalExpose("_processAction")
  async processAction(element: string, actionValue:  string ){
    if(element=="Sort") return;
    if(element=="Filter") {
        const content = document.querySelector(".actionConditionFilter")?.innerHTML;
        document.querySelectorAll(".actionConditionFilter").forEach(item => item!.innerHTML =  actionValue);
      }
    else {
        // document.querySelectorAll(".actionAnchor")?.forEach( item => item.classList.add("hidden"));
        document.querySelectorAll(".actionConditionFilter").forEach(item => item!.innerHTML = element);
    }


  }

  @GlobalExpose("_modUp")
  async modUp(){ let x = this.modNo()+1; this.modNo.set(x==6? 0: x)  }


  @GlobalExpose("_PopUpRef")
  async PopUpRef( ref: string, event?:MouseEvent){
    this.PopUp(this.loading);
    if(event) event.preventDefault();
    ref = ref.replace("DEMO_KEY", "j3ODw8lMFfFTaAnYDeDywx24cfyBNRLNpe4Xjkgy");
    // if(!ref.includes("http")) ref= "https://api.nasa.gov" + ref;
    let result: any;

      let temp: any ;
      try {
          temp = await fetch(ref);
          result  = await temp.json();
          if(typeof result =="object") result = this.convertToHTML(result);
      }
      catch (err){
          result = await this.globalFetchData( { serverAgency:"NASA", serverMethod: "get", serverPayload: ref, serverSesame:"" }, true )
      }
        const first = ref.indexOf("&api_key");
        const second = ref.indexOf("?api_key");
        if(first>=0) ref = ref.substring(0,first);
        if(second>=0) ref = ref.substring(0,second);

    this.PopUp( "<h3 class='text-teal-600'>"+ ref.replace("&&", "&") +"<hr></h3><div class='h-full overflow-auto w-full'>" + result + "</div>" )  ;
  }


  @GlobalExpose("_interactiveSubmit")
  async interactiveSubmit(id: string, vault:string, agencyMethod: string="VA|get"){
    const element = document.querySelector("#section" + id);
    let result = element?.textContent?.replace("Launch","").trim().replace(" ", "?")!;
        const obj: any ={};
        obj.serverAgency =  agencyMethod.split("|")[0];
        obj.serverMethod = agencyMethod.split("|")[1];
        obj.serverSesame =  vault.split("|")[1]??"";
        vault = vault.split("|")[0];
        const temp = vault.split("-")
        if(!isNaN(parseInt(temp[temp.length-1])))
          vault = vault.replace("-" + temp[temp.length-1], "/v" + temp[temp.length-1]);
        obj.serverPayload = vault + result??"";
    let jsonResult = await this.globalFetchData(obj);
  }

tabulateResult(items:any){
    let result ="";
    if(typeof items[0]!=="object" )
      {
        for(let item of items){
          result += "<tr><td>" + item + "</td></tr>";
        }
        return "<table>"+ result +"</table>";

      }
      return  "";
  }

@GlobalExpose("_smartRotate")
async smartRotate(rotate:boolean=true){
  alert(rotate);
    const  table = document.querySelector("#smartTable") as HTMLTableElement;
    const options = table.getAttribute("data-smart")+"";
    this.isSmartRotate =!this.isSmartRotate;
    document.querySelector("#moonShadow" + this.modNo())!.innerHTML = this.formatResult('API Result',this.smartTable( [] , options , this.isSmartRotate));
  }



@GlobalExpose("_smartTable")
smartTable(items:object | any = [], options:string="", rotate:boolean = false){
    if(!items.length) items = items.items;
    if(items.length===0) items=this.smartData;
        else this.isSmartRotate = rotate;
    const proceed = this.tabulateResult(items);
    if(proceed!=="") return proceed;
    document.querySelector("#smartTable")?.remove();
    const columnNames = Object.keys(items[0])
    let result = ""
    if(!rotate){
      result+= "<tr class='sticky top-0'>"
      for(let lead of columnNames) result+=`<td class='th'>${lead}</td>`
      result+= "</tr><tbody>"
      items.forEach( (row:object) => {
        result+= "<tr>"
          for(let val of Object.values(row)) result+="<td>" + val + "</td>"
          result+= "<tr>"
      });
      result += "</tbody>"
    }
    else {
      result=""
      for(let x=0; x<columnNames.length; x++){
        result += "<tr><td class='th'>" + columnNames[x] + "</td>";
            for(let y=0; y<items.length; y++)
              result += "<td>" + items[y][columnNames[x]] + "</td>";
        result += "<tr>";
      }
    }
    if(items.length===0) return result;
    this.smartData = items;
    result=  `<table id='smartTable' data-smart='${options}' class='${options}'>${result}</table></div>`;
    return result;
  }


  paramSignal = signal<object>({});
  northernLights = signal("")
  // baseURL = `https://3rdwind.net;  ////api`;
  baseURL ="" //localhost:5000/api"

@GlobalExpose("_globalFetchData")
async globalFetchData( obj: any, isRef: boolean=false)
{
        const headerDict: any = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Accept-Encoding': 'deflate, gzip;q=1.0, *;q=0.5' };
        const method =obj.serverMethod;
        let url: string = "";
              try {
                this.PopUp(this.loading);

                if(obj.serverAgency=="VA") {
                    let padLock = obj.serverSesame.split(".");
                    if(padLock[0]=="bea") {
                      headerDict.authorization = "Bearer " + "0oau8p8n6nWLAEv9g2p7";
                      headerDict.accept = 'application/fhir+json'
                          }
                    else  {
                      headerDict.apiKey = padLock[1];
                      headerDict.accept ='application/json';
                    }
                    url= "https://sandbox-api.va.gov/services/" + obj.serverPayload;
                }

                if(obj.serverAgency=="NASA") url = obj.serverPayload
                const options: any = { headers: new Headers(headerDict), method: method.toUpperCase() } ;
                const response = await fetch(url,  options);

                let jsonResult = await response.json();
                this._vault = "";
                if(jsonResult.items)     this._vault = this.smartTable(jsonResult);
                                          else  this._vault = this.convertToHTML(jsonResult);
                this._vault = this.formatResult('API Result',this._vault,"bg-slate-300");
                if(isRef) return this._vault;
                this.messageNorthStar("");
                this.northernLights.set(this._vault);
                this.PopUp(this._vault);
                return;
              }
              catch(error)  {
                console.error('Error:', error);
                this.PopUp(this.loading.replace("Reaching Out", "<h4>Due to API owner restrictions, <u>we can only open in a separate tab/window.</u></h4>"));
                window.open(url);
                return "<h4>Due to API owner restrictions, we can only open in a separate tab/window.</h4><h1>Thank you.</h1>";
                throw error; // Re-throw error for handling in caller
              };
  }



DataFormats: any ={
  "account_name": "text",
  "account_number_tas": "text",
  "date_range": "text",
  "interest_inflation_earnings": "number|min=0|step=.01",
  "memo_no": "text",
  "premium_discount_recognized": "number|min=0|step=.01",
  "principal_inflation_comp": "number|min=0|step=.01",
  "record_calendar_day": "number|min=1|max=31",
  "record_calendar_month": "number|min=1|max=12",
  "record_calendar_quarter": "number|min=1|max=4",
  "record_calendar_year": "number|min=1980|max=2024",
  "record_date": "date|value=YYYY-MM-DD",
  "record_fiscal_quarter": "number|min=1|max=4",
  "record_fiscal_year": "number|min=1980|max=2024",
  "src_line_nbr": "number|min=1|max=9999",
  "sub_category": "'text'",
  "total_inflation_purchased_sold": "number|min=0|step=.01",
  "total_investments": "number|min=0 step=.01",
  "total_redemptions": "number|min=0 step=.01",
  "trans_date": "date|value=YYYY-MM-DD",
  "unrealized_discount": "number|min=0|step=.01"
}

getFieldInput(field: string){
  const obj = Object.entries(this.DataFormats);
  const result: any = obj.find( (item: any)=> item[0]==field);
  return result[1];
}













  isObject(element: any) {
    return (element != null && element != undefined && typeof element === "object");
  }
  isArray(element: any) {
    return Array.isArray(element);
  }


  convertToHTML(JSON: any, level = 0) {
    let result = "";
    if (this.isObject(JSON)) {
      level++;
      if (this.isArray(JSON)) {
        for (let value of JSON) {
          result += (level <= 1 ? this._ROOT : this._ARRAY)(this.convertToHTML(value, level));
        }
      }
      else {
        for (const [key, value] of Object.entries(JSON)) {
          const label = this._KEY(this.keyStyle(key));
          const item = this.isObject(value) ? this._NODE(this.nodeInteract(this.convertToHTML(value, level), level))
            : this._VALUE(this.isLinkable(value + ''));
          result += this._OBJECT(label + item);
        }
      }
    }
    return result;//.replaceAll(`'`, `"`);
  }




  keyStyle(item: string) {
    item =  item.replaceAll("_", "  ");
    return this.parseUpperCase(item);
  }

  parseUpperCase(str: string): string {
    return str.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 '); // Lookahead assertion
  }


  isLinkable(item: string) {
    if (typeof item != "string") return "No assigned value";
    if (item.indexOf("http") >= 0) {
      let isPhoto = item.indexOf("jpg") >= 0 || item.indexOf("png") >= 0 || item.indexOf("gif") >= 0 || item.indexOf("bmp") >= 0;
      let char = isPhoto ? "📷":"☷";
      return `<span class="urlMedia text-xl" onclick="_modUp();_PopUp('${item}')">${char}</span>`;
    }
    else
      return item;
  }

  nodeInteract(item: string, level: number) {
    const id = "btn" + new Date().getTime();
    const nodeBtnExpand = `<button class='nodeButton hidden' (click)="nodeCollapse('` + id + `')"  title='Collapse'> + </button>`;
    const nodeBtnCollapse = `<button class='nodeButton' (click)="nodeExpand('` + id + `')" title='Expand'> - </button>`;
    return (level >= 9) ? "..." : item;
  }



getInputType(type:string){
  if(this.isSubstringAny(type.toLowerCase(),"string,text")) return "text";
  if(this.isSubstringAny(type.toLowerCase(),"integer,int")) return "number";
  else return "text";
}

setParamComponent(param:string, id:number): string{
  console.log("ParamComponent:", param);
  const paramObjects = (new DOMParser().parseFromString(param, "text/html")).querySelectorAll("api-object");
    const keyValuePairs: KVpair[] = [];
    paramObjects.forEach(obj => {
        const apiKey = obj.querySelector('api-key')?.textContent;
        const apiValue = obj.querySelector('api-value')?.textContent;
        if (apiKey && apiValue) {
            keyValuePairs.push({ key: apiKey, value: apiValue });
        }
    });
    const KV: JsonObject = this.setKV(keyValuePairs);
    const signalName:string = KV["name"];
    const method= KV["in"];
    const uniqueID = signalName + "_" + this.paramCounter;


    let inputStyle =  this._KEY(signalName, 'min-w-32') +  this._VALUE(`<input id='${method}_${uniqueID}' onchange='_interactiveInput(this.value, this.id)' onkeyup='_interactiveInput(this.value, this.id)' type='${this.getInputType(KV["type"])}' placeholder='${KV["example"]??''}'
    pattern='${KV["pattern"]}'
    title='${KV["description"]}'  id='${KV["name"]}'>`) ;
    const backColor =  (method=="query") ? "bg-teal-100" : "bg-orange-100";
    inputStyle = this._SECTION(this._OBJECT(inputStyle) , backColor + " p-4 pb-2 mx-0 rounded-lg");
    return  param +  inputStyle;
  }

setKV(obj:KVpair[]){
  const KV: { [key: string]: string } = {};
      obj.map(pair => {
      KV[pair.key] = pair.value;
      });
      return KV;
}

extractKeyValuePairs(obj: JsonObject, excludeKeys: string[]): JsonObject {
  let result: JsonObject = {};
  for (const key in obj) {
    if (excludeKeys.includes(key)) continue;
    if (typeof obj[key] === 'object' && obj[key] !== null ) {
        const temp = this.extractKeyValuePairs(obj[key], excludeKeys);
          result[key] = temp;
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}



  //! To easily/clearly enclose items per hierarchy
  _DIVHEAD(item: string) {
    return "<api-header><b class='p-4'>" + item + "</b></api-header>";
  }

  _LINKNAV(item: string, option = "") {
    return "<a class='" + option + "'>" + item + "</a>";
  }

  _DIVISION(item: string) {
    return "<api-div>" + item + "</api-div>";
  }

  _HTMX(item: string) {
    return "<htmx>" + item + "</htmx>";
  }

  _SECTION(item: string, option: string="", extra:string="") {
    return `<api-section ${extra} class='${option}'>` + item + "</api-section>";
  }

  _TABLE(item: string, option: string="") {
    return `<table><tr><td class='${option}'>` + item + "</td></tr></table>";
  }

  _ARRAY(item: string) {
    return "<api-array>" + item + "</api-array>";
  }

  _CONTAINER(item: string) {
    return "<div class='orbiter'><upper-container>" + item + "</upper-container></div>";
  }

  _OBJECT(item: string, option:string="") {
    return `<api-object class='${option}'>` + item + "</api-object>";
  }

  _VALUE(item: string, option:string="") {
    return `<api-value class='${option}'>` + item + "</api-value>";
  }
  _KEY(item: string, option:string="") {
    return `<api-key class='${option}'>` + item + "</api-key>";
  }
  _ROOT(item: string) {
    return "<api-root>" + item + "</api-root>";
  }
  _NODE(item: string) {
    return "<api-node>" + item + "</api-node>";
  }
  _COMP(item: string) {
    return "<api-component>" + item + "</api-component>";
  }
  _UI(item: string) {
    return "<api-ui>" + item + "</api-ui>";
  }

paramCounter =0;
jsonToHtml(obj: JsonObject): string {
  let html = '';
  let lastKey ="";
  for (const key in obj) {
    const childCount = Object.keys(obj[key]).length;
    if ( typeof obj[key] === 'object' && obj[key] !== null   && childCount ) {
          if(key==="parameters"){
            let params="";
            for(let x=0; x<childCount; x++) params +=  this.setParamComponent(this._VALUE(this.jsonToHtml(obj[key][x])),x);
            html +=  this.formatResult(key, this._TABLE(params, "mx-4 px-4 bg-slate-200"));
          }
          else
          {
            const temp = this._VALUE(this.jsonToHtml(obj[key]));
            if(key==="tags"){
              let tags="";
              for(let x=0; x<childCount; x++)  tags+= `<button class='mx-1 btn-xs btn btn-primary'>${obj[key][x]}</button>`;
              html+= this._OBJECT(this._KEY(key,'min-w-32') + this._VALUE(tags));
            }
            else if(!this.isSubstringAny(key,"get,post,schema")) {
              if(key==="schema") html += this._KEY(key);
              else {
                let newKey = key;
                const temp = key.split("{");
                this.paramCounter++;
                if(temp.length>1){
                    for(let x=1; x<temp.length; x++){
                      const label = temp[x].split("}")[0];
                      const replacement = `<u id='label_${label}_${this.paramCounter}' class='font-extrabold'>{${label}}</u>`
                      newKey = newKey.replace(`{${label}}`, replacement );
                    }
                }
                const querySlot = `<b class='p-2 text-blue-400' id='querySlot_${this.paramCounter}'></b>`;
                const submitButton = `<button id='submitButton${this.paramCounter}'  class='btn ml-20  btn-warning divisions btn-xs absolute top-2  right-20 hidden'  onclick='_interactiveSubmit(${this.paramCounter},"${this._vault}")'>Launch</button>`;
                html+= this._SECTION(`<div id='section${this.paramCounter}' onclick='_hideAndSeek(${this.paramCounter})' class='text-xl text-teal-800 cursor-pointer hover:bg-amber-100  sections' >${newKey} ${querySlot} ${submitButton}</div>`
                + this._SECTION(this.jsonToHtml(obj[key]),'divisions hidden', `id='divisions${this.paramCounter}'`), 'sections' )  ;

              }

            }
            else html+=  temp;
          }
    } else {
      if(obj[key]!==null  && Object.keys(obj[key]).length!==0)
        html += this._OBJECT(this._KEY(isNaN(parseInt(key)) ? key: "", 'min-w-32') + this._VALUE(obj[key]));
    }
    lastKey = key;
  }
  return html ;
}

globalDelimiter = "(|)";

formatResult(header: string, table:string, options=''){
  try { header = header.split(">")[1].split("<")[0];} catch(err){}
  if(header.trim()=="")  header= "Query Parameters";
  const caption=`<caption class='sticky top-0'>${header}</caption`;
  if(table.includes("<thead>")) table=table.replace("<header>", caption + "<header>")
  else if(table.includes("<tbody>")) table=table.replace("<tbody>", caption + "<tbody>")
  else if(table.includes("<tr>")) table=table.replace("<tr>", caption + "<tr>")
  return "<div class='w-fit max-w-[1000px] h-fit overflow-y-auto " + options + " max-h-[600px]'>" + table + "</div>";
}

isSubstringAny(left: string | Array<string>, right: string | Array<string>) {
      // Handle empty strings
      if (left === "" && right === "") {
        return true;
      }
      // Handle type mismatch
      if (typeof left !== typeof right) {
        return false;
      }
      // Convert strings to arrays for subset check
      if (typeof left === "string") {
        left = left.split(",");
      }
      if (typeof right === "string") {
        right = right.split(",");
      }

      for(let item of right){
        if(left.toString().includes(item)) return true;
      }
      for(let item of left){
        if(right.toString().includes(item)) return true;
      }
        return false;
}

formatInput( givenType: string= "", givenValue: string="", dateID: string="", givenPattern: string='')
{
            let insert =""
            const VALID_CHECKBOXES   = `bool|boolean|checkbox|radio|options|toggle|swap`;
            const VALID_DATES   = `mm-dd-yyyy|mm/dd/yyyy|yyyy-mm-dd|date`;
            const VALID_NUMBERS = `currency|quarter|week|month|amount|quantity|number|range|integer|int|float|double`;
            let   isValidType: string   = givenType.toLowerCase();
            let   isValidValue: string  = givenValue.toLowerCase();
            givenType =  VALID_CHECKBOXES.includes(isValidType) ? "checkbox" :
                        (
                            VALID_DATES.includes(isValidType) ? "date" : (VALID_NUMBERS.includes(isValidType) ? "number": "text")
                        );

            if("none|".includes(isValidValue) &&  givenType!=="date") isValidValue=  "";
            let value = 'value='
            switch(givenType.toLowerCase())
            {
              case `number`:
                      let max='max-value=';
                      let min='min-value=';
                      if(isValidType=="month") { max += `'12''`;    min+=`'1'`; value+=`'${isValidValue??this._month}'`};
                      if(isValidType==="week")  { max += `'7'`;     min+=`'1'`; value+=`'${isValidValue??this._week}'`};
                      if(isValidType==="week")  { max += `'4'`;     min+=`'1'`; value+=`'${isValidValue??1}'`};
                      if(isValidType==="range") { const maxmin= givenPattern.split("-");
                                                  max += `${maxmin[1]}`;     min+=`${maxmin[0]}`;
                                                  value+=`${isValidValue??(Math.floor( parseInt(maxmin[0])*parseInt(maxmin[1])/2)) }`};  //!crazy???

                      if(isValidValue==="") isValidValue="0";
                      if(isValidType.substring(0,3)==="int")  { isValidType=`number`;  max = ``;   min =``; value+=`'${isValidValue??''}'`};

                      if("float|double".includes(isValidType)) { isValidType=`float`;  max = ``;     min =``; value+=`'${isValidValue??0.00}'`};
                      if(isValidType==="currency")  { max = ``;     min=``;  value+=`${isValidValue??0.00}`};

                      insert=` type='${isValidType}' ${max}  ${min}   ${value}  `;
                    break;

              case `checkbox`:
                    if("TRUE|YES|1|T|Y".includes(isValidValue.toUpperCase())){ value += `'checked'`; }
                    if("FALSE|NO|0|F|N".includes(isValidValue.toUpperCase())){ value = ``; }
                    insert=` type='checkbox' class='checkbox'  ${value}  `;
                    break;

              case "date":
                    if("today|none".includes(isValidValue) || isValidValue=="") isValidValue = this._todayStr;
                    const isDate =  moment(isValidValue, isValidType, true).isValid();
                    if(!isDate){
                        const skinIt = isValidValue.split(" day");
                        if(skinIt.length>1){
                          let adjuster = skinIt[1].replace("s ", "").split(" ");
                          let refDate = sessionStorage.getItem("DATE_" + adjuster[1]) +"";
                          if(refDate==="") refDate= this._todayStr;
                          if(adjuster[0]!=""){
                            if("prior|before".includes(adjuster[0]))
                              isValidValue =  this.addDays(refDate, -parseInt(skinIt[0]) ).toUTCString() ;
                            else if("after".includes(adjuster[0]))
                              isValidValue =  this.addDays(refDate, parseInt(skinIt[0]) ).toUTCString() ;
                          }
                          if(skinIt[0].includes("beginning of"))
                            {
                              skinIt[0] = skinIt[0].replace("beginning of", "").trim();
                              isValidValue =  this.addDays(refDate, -parseInt(skinIt[0]) ).toUTCString() ;
                            }
                        }
                        else
                          isValidValue = this._todayStr;
                    }
                    isValidValue = moment(isValidValue).format("YYYY-MM-DD");
                    sessionStorage.setItem("DATE_" + dateID, isValidValue);
                    value +=`'${isValidValue}'`;
                    insert=` type='date'   ${value} pattern="(?:19|20)(?:[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:29|30))|(?:(?:0[13578]|1[02])-31))|(?:[13579][26]|[02468][048])-02-29)" `;
                    break;

              default:
                    if(isValidType.includes("dropdown")){
                      const vals = isValidType.split("|")[1].split(",");
                      for(let x=0; x<vals.length; x++){
                        insert +=   ` <option value="${vals[x]}">${vals[x].toUpperCase()}</option>`
                      }
                      return `<select title='${dateID.trim()}' class='${this.IDR}  min-w-32'  ${isValidType.includes("_multi")?'multiple':''}>${insert}</select>`;

                    }
                    else
                    insert=` type='text'   value='' `;
                    break;
            }
            return `<input ${insert} class='${this.IDR}'  title='${dateID}'>`;
}

IDR="";

_idGenerator(){
  this.IDR = "Entry" +  (Math.floor( Math.random() * 10000000 ) )  ;
}

addDays(myDate: string, days: number) {
  const result = new Date();
  result.setDate ( new Date(myDate).getDate() + days);
  return result;
}



specialTraverse(divElement: Element, elements: string = "H3,P", excluded: string = ""){
  let pair = "";
  elements= elements.toUpperCase();
  const element = elements.split(",");
    for (const child of Array.from(divElement.children)) {
        if (this._$IN(child.tagName, element[0])) {
                  let parent = `${ this._$IN(element[0], "H1") ?"":child.outerHTML}` ;
                  let nextSibling = child.nextElementSibling;
            console.log(element[0], element[1], parent);
            if(nextSibling?.tagName==="TABLE"  && child.tagName==="P" ) parent="<p></p>";
                if((nextSibling?.tagName!=="TABLE") ){
                  console.error("ALREADY EXISTED..", parent)
                }
                else{

                  while (nextSibling && element[1].includes(nextSibling.tagName)  ) {
                      const newPair = parent + nextSibling.outerHTML;
                      parent="";
                      if(pair==="" || !pair.includes(nextSibling.outerHTML)){
                        pair += newPair;
                        console.log("#################### INSERTED", newPair);
                      }
                        nextSibling = nextSibling!.nextElementSibling;
                    }
                }

        }
      }
   return pair;
}

_$IN(left: string| Array<string> , right:string | Array<string>){
  return left.includes(right.toString())  || right.includes(left.toString());
}




}
