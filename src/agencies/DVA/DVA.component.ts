import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, signal } from '@angular/core';
import moment from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../../app/services/UtilsService';
import { SpaceStationComponent } from '../DUMMIES/space-station/space-station.component';

@Component({
    selector: 'dva-api',
    standalone: true,
    styleUrl: '../../3rdwind.css',
    templateUrl: 'DVA.component.html',
    imports: [CommonModule, SpaceStationComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DVAComponent {
  constructor( public sanitizer: DomSanitizer, public utils:UtilsService){}
@ViewChild(SpaceStationComponent) dummy_SS!: SpaceStationComponent;
portalData:Array<any> = [];
agency = "DVA";
ngOnInit(): void {
}


async powerUpPortal(){
  for(let api of this.agencyAPI) {
    const items = api.split("|");
    const obj: any = {};
    obj.key = items[0];
    obj.vault = items[1];
    obj.scribe = items[2] + "|" + items[3];
    if(items[4]) obj.scribe += "|" + items[4];
    this.portalData.push(await this.checkReadiness(obj));
  }
  this.dummy_SS.portal = this.portalData;
}

ngAfterViewInit(): void {
  this.powerUpPortal()
  this.dummy_SS.PortalReadyMessage.set("BON VOYAGE");
}

  provision!: { key: string; values: object; };

async checkReadiness(destination: { key: string, vault: string, scribe: string}){
  try {
    const response = await fetch(`assets/JSON/${destination.vault}.json`);
    const json =  await response.json();
    if(destination.vault=="fhir-4") destination.vault = "fhir/v0/r4/";
    this.utils._vault = destination.vault + "|"  +  destination.scribe.split("|")[1];;
    const excludeKeys = ['responses', 'requestBody', 'security', 'length'];
    const extractedData = this.utils.extractKeyValuePairs(json.paths, excludeKeys);
    const htmlOutput = this.utils.jsonToHtml(extractedData);
    return { key: destination.key, vault: destination.vault , values:{info:json.info, tags:json.tags, expo: htmlOutput}};
  }
  catch (err){
    console.log(err);
    return {};
  }
}

// referencecheck@thomas-and-company.com


agencyAPI =
[
"Address Validation API|address-validation-3|Provides methods to standardize and validate addresses.|restricted access,verification|key.ux5mwDP9Z2ulCT3xt3QPS25Yo9t1ca4J",

"Appeals Status API|appeals-status-1|Allows retrieval of all decision review request statuses (both legacy and AMA). Statuses are read only.|restricted access,va benefits|",

"Benefits Claims API|benefits-claims-2|Find and submit Veteran benefits claims.|va benefits,authorization code grant,client credentials grant|key.0oavwa8onzEHS0r4r2p7",

"Benefits Documents API|benefits-documents-1|Submit or retrieve a list of supporting claim documents from the Veterans Benefits Management System.|restricted access,va benefits,client credentials grant|key.0oavwac65jPvp6HQo2p7",

"Benefits Intake API|benefits-intake-1|Upload and get the status of VA benefits documents.|va benefits|oat.EeeCEgpWKgryJhkst5pOq3R5CkuHaWDc",

"Benefits Reference Data API|benefits-reference-data-1|Look up data and codes that help with VA benefits claims.|va benefits,open data|oat.LONAljmqZAAZToEGjpZUDwbF9M1WT05h",

"Clinical Health API (FHIR)|fhir-clinical-health-0|Use to develop clinical-facing applications that improve access to and management of patient health data.|restricted access,health,authorization code grant|",

"Community Care Eligibility API|community-care-eligibility-0|VA's Community Care Eligibility API utilizes VA's Facility API, VA's Enrollment & Eligibility system and others to satisfy requirements found in the VA's MISSION Act of 2018.|health,authorization code grant,client credentials grant|oat.0oavt7yrhqVsy1gJP2p7",

// "Decision Reviews API|appeals-decision-reviews-2|Allows submission, management, and retrieval of decision review requests and details such as statuses in accordance with the AMA.|restricted access,va benefits|",

"Direct Deposit Management API|direct-deposit-management-1|Manage direct deposit information for payments from the VA.|restricted access,va benefits,client credentials grant|",

"Education Benefits API|benefits-education-1|Determine Veteran eligibility for the Post-9/11 GI Bill’s education benefits.|restricted access,va benefits,client credentials grant|",

"Guaranty Remittance API|lgy-remittance-0|Lets lenders automate parts of the mortgage post-closing process|restricted access,loan guaranty,client credentials grant|",

"Loan Guaranty API|loan_guaranty_property-1|Use the Loan Guaranty API to Manage VA Home Loans.|restricted access,loan guaranty|",

"Loan Review API|loan-review-1|Transmit post-close Loan Guaranty documents.|restricted access,loan guaranty,client credentials grant|",

"Patient Health API (FHIR)|fhir-4|Use the OpenID Connect and SMART on FHIR standards to allow VA patients to authorize third-party applications to access data on their behalf.|health,authorization code grant,client credentials grant|bea.0oavt7phclhrBzY5b2p7",

"Provider Directory API|provider-directory-r4-0|Use this API to return lists of VA providers and their information, such as locations, specialties, office hours, and more.|health,open data|",

"VA Facilities API|facilities-1|Find VA facilities, including their addresses, available services, and hours of operation.|facilities,open data|",

"VA Forms API|forms-0|Look up VA forms and check for new versions.|forms,open data|",

"VA Letter Generator API|va-letter-generator-1|Generate documents and letters for proof of existing VA benefits and status.|restricted access,verification,client credentials grant|"
// ,

// "Veteran Confirmation API|confirmation|Confirm Veteran status for a given person with an API key.|verification",

// "Veteran Service History and Eligibility API|veteran-verification|Confirm Veteran status for a given person, or get a Veteran’s service history or disability rating.|verification,authorization code grant,client credentials grant"
];






}
