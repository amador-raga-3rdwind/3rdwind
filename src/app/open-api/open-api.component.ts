import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, SimpleChanges, signal } from '@angular/core';
import { createCssSelectorFromNode } from '@angular/compiler';
import { UtilsService } from '../services/UtilsService';
import { NASAComponent } from '../../agencies/NASA/NASA.component';
import { DVAComponent } from '../../agencies/DVA/DVA.component';
import { TREASURYComponent } from '../../agencies/TREASURY/TREASURY.component';
import { OPMComponent } from '../../agencies/OPM/OPM.component';
import { UNComponent } from '../../agencies/UN DATA/UN.component';


@Component({
    selector: 'app-open-api',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    templateUrl: './open-api.component.html',
    imports: [CommonModule, NASAComponent, DVAComponent, TREASURYComponent, OPMComponent, UNComponent]
})
export class OpenApiComponent {
constructor(  public utils: UtilsService){}

  selectedAgency:string = "";
  isOff: boolean = false;
  AGENCIES : Array<string> = ["NASA", "DVA" , "TREASURY", "OPM", "UN"];;


  activatePage(agencyName: string){
    this.selectedAgency = agencyName;
    this.utils.allButOne("agencyGroup",    agencyName +"agency", "selectedItem");
  }


  toggleFront(){
    this.isOff = !this.isOff;
  }


}
