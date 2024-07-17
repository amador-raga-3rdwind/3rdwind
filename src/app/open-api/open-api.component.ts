import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, SimpleChanges, ViewChild, signal } from '@angular/core';
import { OpenAPIService } from '../services/open-api.service';
import { AgencySectionsComponent } from './agency-sections.component';
import { createCssSelectorFromNode } from '@angular/compiler';
import {StaticComponent} from "../static.component";

@Component({
    selector: 'app-open-api',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    templateUrl: './open-api.component.html',
    imports: [CommonModule, AgencySectionsComponent, StaticComponent]
})
export class OpenApiComponent {
constructor(  public svc: OpenAPIService){}

  selectedAgency:string = "";
  isOff: boolean = false;
  AGENCIES : Array<string> = ["NASA", "DVA" , "TREASURY", "DHS", "DHA"];; 



  @ViewChild(AgencySectionsComponent, {static: false}) child!: AgencySectionsComponent;

  activatePage(agencyName: string){
    this.selectedAgency = agencyName;
    this.svc.allButOne("agencyGroup",    agencyName +"agency", "selectedItem");
    this.svc.toastNotify2("You are now on " + agencyName + " Open API.");
    this.svc.chatMessage.set("");
    

  }

  
  toggleFront(){
    this.isOff = !this.isOff;
    this.svc.toastMessage.set("Front page of " + this.selectedAgency + " is now turned " + (this.isOff ? "OFF": "ON") );
  }


}
