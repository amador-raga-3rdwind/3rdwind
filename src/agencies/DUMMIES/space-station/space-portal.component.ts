import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { UtilsService } from '../../../app/services/UtilsService';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalExpose } from '../../../app/decorators/global.decorator';


interface alienObj  {info: string, tags:string, paths:string};
interface JsonObject {[key: string]: any;}
interface portalPack { key: number, caption:string, values: {summary:any, details:any, expo: string}};

@Component({
  selector: 'dummy-space-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space-portal.component.html',
  styleUrls: ['../../../3rdwind.css'], // Update the path to the correct location of the CSS file
})
export class SpacePortalComponent {
  constructor( public  utils: UtilsService, public sanitizer: DomSanitizer)
 {}


isHoverMode = signal(true);
portalMessage = signal("");
isPortalReady = false;
portalPackArray: Array<portalPack> = [];
nowShowingContainer1 = signal("");
summary="";
details="";
headerCaption = ""
currentMode ="";
previousMode="";



async selectItem(itemKey: number=0){
    this.nowShowingContainer1.set("<h1>LOADING.....></h1>");
    const portalKey = this.portalPackArray[itemKey].values;
    this.currentMode = "Generic";
    if(!portalKey.details || !portalKey.summary) return this.nowShowingContainer1.set(this.utils._SECTION(this.convertToHTML(portalKey)));

    this.summary = this.utils._SECTION(this.convertToHTML(portalKey.summary));
    this.details = this.utils._SECTION(this.convertToHTML(portalKey.details));
    const positionTitle = portalKey.summary.PositionTitle;
    this.headerCaption = `<b class='text-${positionTitle.length<=25 ?3: ( positionTitle.length>=50 ?'':2 )}xl font-extrabold'>${positionTitle}</b>`+ `<p class='text-lg  mt-0'>${portalKey.summary.DepartmentName},  ${portalKey.summary.OrganizationName}</p>`;
    this.currentMode = "Details";
    this.bigBang();
  }

bigBang(){
  this.previousMode = this.currentMode;
  this.currentMode = (this.currentMode==="Details")? "Summary" : "Details";
  this.nowShowingContainer1.set(this.currentMode=='Summary'?this.summary:this.details);
}


parseUpperCase(text: string): string {
  const regex = /([A-Z][a-z]*)(?=[A-Z]|$)|([A-Z]+)/g;
  const words = text.match(regex);
          let currentLength =1;
  if (words)
    for (let i = 0; i < words.length-1; i++) {
          if(words[i].length==currentLength && words[i+1].length==1) {
          words[i] = words[i] + words[i+1];
          words.splice(i+1,1);
          currentLength++;
            i--;
          }
          else currentLength=1;
    }
      return words ? words.join(' ') : '';
  }



  convertToHTML(JSON: any, level = 0, insert: string = '') {
    let result = "";
    if (this.utils.isObject(JSON)) {
      level++;
      if (this.utils.isArray(JSON)) {
        for (let value of JSON) {
          result += (level <= 1 ? this.utils._ROOT : this.utils._ARRAY)(this.convertToHTML(value, level));
        }
      }
      else {
        for (const [key, value] of Object.entries(JSON)) {
          const k = this.parseUpperCase(key);
          let label =  this.utils._KEY(k);
          if(this.utils.isObject(value)) {
                result+= `<b class='text-indigo-500 font-extrabold shadow-sm shadow-indigo-100  mt-2'>${ (key.length>2) ? this.parseUpperCase(key.replace("0","")).toUpperCase() : ""}</b>`+
                this.convertToHTML(value, level,  !isNaN(parseInt(key)) ? "<b class='text-red-400 px-2'>" + "✦" + "</b>"  : "" );
          }
          else
          if("" + value!=="")   result += this.utils._OBJECT(this.utils._KEY(insert + label) +  this.utils._VALUE(this.isLinkable(value + '')));
        }
      }
    }
    return result;//.replaceAll(`"`,`'`);
  }


  isLinkable(item: string) {
    if (typeof item != "string") return "No assigned value";
    if (item.indexOf("http") === 0) {
      item = item.replace("http://", "https://");
      let isPhoto = item.indexOf("jpg") >= 0 || item.indexOf("png") >= 0 || item.indexOf("gif") >= 0 || item.indexOf("bmp") >= 0;
      let char = isPhoto ? "📷":"☷";
      if(!isPhoto) return `<a class='urlMedia text-sm text-blue-700' target='_blank' href='${item}' >${item}</a>`;
      else
      return `<span class="urlMedia text-2xl" onclick="_modUp();_PopUp('${item}')">${char}</span>`;
    }
    return `<span class='urlMedia text-sm text-slate-600 text-ellipsis'>${item}</span>`;;
  }


ngOnInit(): void {

}

ngAfterViewInit(): void {
}




}
