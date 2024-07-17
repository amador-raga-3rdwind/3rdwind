import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, signal } from '@angular/core';
import moment, { isMoment } from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../../app/services/UtilsService';
import { DataInputService } from '../../app/services/DataInputService';
import { GlobalExpose } from '../../app/decorators/global.decorator';
import { SpacePortalComponent } from '../DUMMIES/space-station/space-portal.component';

type queryParameters= { key: string, values: { type:string, caption:string, description: string, required: boolean, value:Array<string>}};
type agencyAPI = { apiName: string, endPoint: string, subTitle?:string, summary: string } ;
interface JsonObject {[key: string]: any;}
interface KVpair { key: string, value: string };
interface FieldAttributes  { FieldName: string, Caption: string, Type: string };
interface portalPack { key: number, caption:string, values: {summary:any, details:any, expo: string}};

@Component({
    selector: 'opm-api',
    standalone: true,
    styleUrl: '../../3rdwind.css',
    templateUrl: 'OPM.component.html',
    imports: [CommonModule, SpacePortalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OPMComponent {
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



async getJobs(jobCategoryCode: string): Promise<any> {
  const url = 'https://data.usajobs.gov/api/search';
  const options = {
    method: 'GET',
    headers: {
      'Host': 'data.usajobs.gov',
      'User-Agent': "amador.raga@alumni.harvard.edu",
      'Authorization-Key': this.susi,
    },
    params: {
      JobCategoryCode: jobCategoryCode,
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error; // Re-throw for caller to handle
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


async extractMoreInfo(data:  object | any) {
  const result : { count: number, countAll: number, ResultItems: Array<object> } =
  { count: data.SearchResultCount, countAll: data.SearchResultCountAll, ResultItems: data.SearchResult.Items };
  data.SearchResult.SearchResultItems.forEach((item: any) => {
    this.individualJobs.push( item.MatchedObjectDescriptor) ;
  });
 }




async ngAfterViewInit(): Promise<void> {
      const data = await this.getJobs("2210")
      await this.extractMoreInfo(data);
      this.individualJobs.sort((a, b) => a.PositionTitle.localeCompare(b.PositionTitle));
      this.individualJobs.forEach( (item) => this.jobDetails.push(item.UserArea.Details));
      this.jobSummmaries = this.filterNestedObjects(this.individualJobs, ["ApplyURI","CountrySubDivisionCode","CityName","CountryCode", "PositionFormattedDescription", "USERAREA", "LATITUDE", "LONGITUDE", "PositionOfferingType"]);
      let counter=0
      const temp: Array<portalPack> = [];
      this.tabs = [];
      for(let item of this.individualJobs){
          temp.push({key: counter, caption:`${item.PositionTitle}`, values: {summary: this.jobSummmaries[counter], details: this.jobDetails[counter], expo: ""}});
          counter++
        }
      this.dummy_SS.portalPackArray = temp;
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

