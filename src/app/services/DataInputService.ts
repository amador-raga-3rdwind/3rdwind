import { Injectable, WritableSignal, signal } from '@angular/core';
// import { UtilsService } from './UtilsService';
// import { GlobalExpose } from '../decorators/global.decorator';


@Injectable({
  providedIn: 'root'
})
export class DataInputService {
  constructor( ) {}

InputTypes: any ={
  "STRING": "'text'",
  "CURRENCY": "'number' min='0' step='.01'",
  "CURRENCY0": "'number' min='0' max='100000000' step='1'",
  "DATE": "'date' value='YYYY-MM-DD'",
  "DAY": "'number' min='1' max='31'",
  "MONTH": "'number' min='1' max='12'",
  "QUARTER": "'number' min='1' max='4'",
  "YEAR":  "'number' min='1980' max='2024'",
  "PERCENTAGE": "'number' min='0' max='100.00' step='.01'"
}

spliceFieldsAttributes(obj: { Labels: any; Types: any}){
  const labels:any = obj.Labels;
  const types:any = obj.Types;
  const Attributes: {FieldName: string, Caption:string, Type: string}[] = [];
  Object.keys(labels).forEach((key) => {
    Attributes.push({FieldName:key, Caption: labels[key], Type: types[key]});
  });
  return Attributes;
}


formatUsingGlobalInput(fieldList?: Array<string>){
  let result = "";
  fieldList!.forEach( (item)=> {
      const format = this.getInputFormat(item);
      result += format + "<br>";
  })
  return result;
}


getInputFormat(inputFieldName: string) {
    return "";
}


async getChoicesFields(url: string='', multiSelect: Array<object>, ver:number=1){
  const baseURL = `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v${ver}/accounting/od/`;
  try {
        let  URL =   ((url.indexOf("/v")==0) ? "https://api.fiscaldata.treasury.gov/services/api/fiscal_service": baseURL) + url;
        URL += "?format=json&page[number]=1&page[size]=1"
        const response = await fetch(URL);
        let result:any = await response.json();
        let meta = result.meta;
        const Labels = meta.labels;
        const Types = meta.dataTypes;
        const obj = {Labels: Labels, Types: Types};
        const fieldsAttributes = this.spliceFieldsAttributes(obj);
        multiSelect.push( {key: url, values: fieldsAttributes});
        return;
  }
  catch(err){
        console.log(err);
        if(ver<3) this.getChoicesFields(url, multiSelect, ver+1);
  }
  return;
}

}
