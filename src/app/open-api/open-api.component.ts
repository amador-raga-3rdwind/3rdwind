import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, SimpleChanges, signal } from '@angular/core';
import { AgencyPageComponent } from '../components/agency-page/agency-page.component';
import { OpenAPIService } from '../services/open-api.service';

@Component({
    selector: 'app-open-api',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    templateUrl: './open-api.component.html',
    styleUrl: './open-api.component.css',
    imports: [CommonModule, AgencyPageComponent]
})
export class OpenApiComponent {
constructor(  public svc: OpenAPIService){}
  selectedAgency:string = "";
  agencyPages: any;

  ngOnInit(): void {
    this.svc.toastNotify("");
    this.svc.toastNotify2("Welcome!!!");
  }
  
  activatePage(agencyName: string){
    this.svc.toastMessage.set("You are now on " + agencyName + " Open API.");
    this.selectedAgency = agencyName;
    this.svc.allButOne("agency-button", agencyName, "selectedItem");
    }
}
