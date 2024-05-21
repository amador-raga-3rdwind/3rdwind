import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, SimpleChanges } from '@angular/core';
import { NasaPageComponent } from '../pages/nasa-page/nasa-page.component';
import { TreasuryPageComponent } from "../pages/treasury-page/treasury-page.component";
import { DvaPageComponent } from "../pages/dva-page/dva-page.component";
import { DhsPageComponent } from "../pages/dhs-page/dhs-page.component";
import { DhaPageComponent } from '../pages/dha-page/dha-page.component';

@Component({
    selector: 'app-open-api',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    templateUrl: './open-api.component.html',
    styleUrl: './open-api.component.css',
    imports: [CommonModule, NasaPageComponent, TreasuryPageComponent, DvaPageComponent, DhsPageComponent,DhaPageComponent]
})
export class OpenApiComponent {
constructor(){}
  currentAgency= "";
  agencyPages: any;

  ngOnInit(): void {
   this.hidePages();
  }

  hidePages(){
    this.agencyPages = document.querySelectorAll(".page-tab") ;
    for(let x=0; x<this.agencyPages.length; x++){
      (this.agencyPages[x] as HTMLDivElement).classList.add("hidden");
    }
  }

  activatePage(agencyName: string){
    this.hidePages();
    this.currentAgency = agencyName;
    (document.getElementById(agencyName.toLocaleLowerCase() + "Tab") as HTMLDivElement).classList.remove("hidden");
  }



}
