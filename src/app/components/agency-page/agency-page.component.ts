import { Component, Input } from '@angular/core';
import { AgencySectionsComponent } from "../agency-sections/agency-sections.component";
import { CommonModule } from '@angular/common';
import { OpenAPIService } from '../../services/open-api.service';


@Component({
    selector: 'agency-page',
    standalone: true,
    templateUrl: './agency-page.component.html',
    styleUrl: './agency-page.component.css',
    imports: [CommonModule,   AgencySectionsComponent]
})
export class AgencyPageComponent {
  constructor (private svc: OpenAPIService){}
@Input()  agencyName:string ="";
isOff: boolean = false;
isReady: boolean = false;
    toggleFront(){
      this.isOff = !this.isOff;
      this.svc.toastMessage.set("Front page of " + this.agencyName + " is now turned " + (this.isOff ? "OFF": "ON") );
    }

    ngOnInit(): void {
      this.isReady = this.agencyName.length>0
    }

}
