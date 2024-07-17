import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, signal } from '@angular/core';
import moment, { isMoment } from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../../app/services/UtilsService';
import { DataInputService } from '../../app/services/DataInputService';
import { GlobalExpose } from '../../app/decorators/global.decorator';
import { SpacePortalComponent } from '../DUMMIES/space-station/space-portal.component';
import * as dataFlow from './SDMX/UNdataFlow.json' ;
import * as dataStructure from './SDMX/UNDataStructure.json' ;
import * as codeList from './SDMX/UNCodeList.json' ;





interface dataFlowObject { Name: string, RefID: string, agencyID: string, ID: string, version:string, isFinal?:boolean}

type queryParameters= { key: string, values: { type:string, caption:string, description: string, required: boolean, value:Array<string>}};
type agencyAPI = { apiName: string, endPoint: string, subTitle?:string, summary: string } ;
interface JsonObject {[key: string]: any;}
interface KVpair { key: string, value: string };
interface FieldAttributes  { FieldName: string, Caption: string, Type: string };
interface portalPack { key: number, caption:string, values: {summary:any, details:any, expo: string}};
interface MetaInfo {
  rows?: number;
  size?: number;
  // Add other relevant meta info properties here
}
interface agencyMeta {agencyID: string, id:string, isFinal?: boolean, version: string,
                      elementGroupName?: string, elementGroupDescription?: string, elements?: agencyElement[] };
interface agencyElement  {id: string, type:string, text: string  };

@Component({
    selector: 'un-api',
    standalone: true,
    styleUrl: '../../3rdwind.css',
    templateUrl: 'UN.component.html',
    imports: [CommonModule, SpacePortalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UNComponent {
  constructor( public sanitizer: DomSanitizer, public utils:UtilsService, public input:DataInputService){}
@ViewChild(SpacePortalComponent) dummy_SS!: SpacePortalComponent;
queryParameters : Array<queryParameters> = [];
agencyAPI : Array<agencyAPI> =[];
portalData: Array<any> = [];
susi = "WiQ4Fc5eMlhNoEOSrv8j7+rBPKlxbSZs1WwAI085Hm0=";

USAjobs: {summary:object, details: object }[] = [];
summary = signal("");
details = signal("");
jobSummmaries: Array<any> = [];
jobDetails: Array<any> = [];

tabs: Array<string> = [];
individualJobs: Array<any> = [];




fetchXMLData(endPoint: string){
      return dataFlow.Structure.Structures.Dataflows;
}


globalStructure: Array<agencyMeta>=[];


traverseUNdata(data: Array<object>){



  try {
    data.forEach( (item: any) => {
      const metaObj: any = {};
      const elementsArrayObj: agencyElement[] = [];
      const meta = item.attributes;
      const elements = item.elements;
      if(meta.agencyID){
        metaObj.agencyID = meta.agencyID;
        metaObj.id = meta.id;
        metaObj.isFinal = meta.isFinal;
        metaObj.version = meta.version;
        metaObj.elementGroupName = elements[0].elements[0].text; //item.name.split(":")[1];
        metaObj.elementGroupDescription = elements[1].elements[0].text;
            for(let x=2; x<elements.length; x++){
              const elementObj: any = {};
              const item = elements[x];
              elementObj.id =  item.attributes.id;
              const child = item.elements[0].elements[0];
              elementObj.text = child.text;
              elementObj.type = child.type;
              elementsArrayObj.push(elementObj);
            }
            metaObj.elements = elementsArrayObj;
      }
          this.globalStructure.push(metaObj);
    });
  }
  catch (err){
    console.log(err);
  }

}


ngOnInit(): void {
}


FilterChoices = "Less Than|lt,Greater Than|gt,Less Than or Equal|lte,Greater Than or Equal|gte,Equal|eq,In|in";
SortChoices = "Ascending|asc,Descending|desc";
sortSelector: string  ="";
filterSelector: string  ="";
dropdownID =1;


fieldNames: Array<string> = [];
multiSelectFields:{ key: string, value: any }[] = [];
widgetData: { widgetName: string, widget: string }[] = [];
agencyList:any= [];


async extractMoreInfo(data:  object | any) {
  const result : { count: number, countAll: number, ResultItems: Array<object> } =
  { count: data.SearchResultCount, countAll: data.SearchResultCountAll, ResultItems: data.SearchResult.Items };
  data.SearchResult.SearchResultItems.forEach((item: any) => {
    this.individualJobs.push( item.MatchedObjectDescriptor) ;
  });
 }



async ngAfterViewInit(): Promise<void> {
      let data:any = dataFlow.Structure.Structures.Dataflows.Dataflow;
      const UNdataFlow: dataFlowObject[] = [];
          data.forEach((flow:any)=>{
            const obj:any = {};
            obj.Name = flow.Name.__text;
            obj.ID = flow._id;
            obj.RefID = flow.Structure.Ref._id;
            obj.agencyID = flow._agencyID;
            obj.isFinal = flow._isFinal;
            obj.version = flow._version;
            UNdataFlow.push(obj);
          });
          // data = dataStructure.Structure.Structures.DataStructures.DataStructure;

          this.agencyList = (new Set(UNdataFlow.map( (obj: any) => obj.agencyID)));

      this.dummy_SS.portalPackArray = [];
      let index =0;
      for(let item of this.agencyList ){
        const temp : { key: string, values:any, caption: string} | any = { };
        temp.key = index++;
        temp.caption = item;
        temp.values = UNdataFlow.filter( (obj: any) => obj.agencyID===item);
        this.dummy_SS.portalPackArray.push(temp);
      }


      this.dummy_SS.portalMessage.set("BON VOYAGE");

      // this.showJob(0);
}


filterNestedObjects<T>(data: T[], keysToExclude: Array<string>, exclude:boolean = true): T[] {
  return data.map((obj) => {
    const filteredObject: any = {};
    keysToExclude = keysToExclude.map((key) => key.toUpperCase());
    for (const key in obj) {
      if ((exclude && keysToExclude.indexOf(key.toUpperCase()) < 0) || (!exclude && keysToExclude.indexOf(key.toUpperCase()) >= 0)) {
        const result =  typeof obj[key]==='object' ? this.filterNestedObjects([obj[key]], keysToExclude, exclude)[0] : obj[key];
        filteredObject[key] = result;
      }
    }
    return filteredObject;
  });
}




}

