import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, Signal, SimpleChanges, ViewChild, signal } from '@angular/core';
import { OpenAPIService } from '../../services/open-api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'agency-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agency-sections.component.html',
  styleUrl: './agency-sections.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgencySectionsComponent {
  constructor(public svc:OpenAPIService){
    // this.selectNext(this.currentPanel.replace("panel",""));
  }
  
  @Input() agencyName: string = ""; 
 SectionsList : Array<string> = [];
  isReady: boolean = false;
  id: string = "";
  currentPanel = ""
 
  ngOnInit(): void {
    this.svc.toastNotify2("Current Panel:" + this.currentPanel);
    if(this.svc.openSections.length===0) {
      this.SectionsList = this.svc.selectSectionLevel(this.agencyName);
    } 
    this.isReady = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const section =  this.currentPanel.replace("panel","")
    this.svc.toastNotify2("Changed Section Panel:  " + this.agencyName + " >> "+ this.currentPanel);
    this.isAlreadyOpen(section);
  }

  isAlreadyOpen(id: string){
    if(this.svc.openSections.includes(this.id)) {
      //! Select section and show corresponding panel
      this.svc.allButOne("section-tab-" + this.agencyName, "section_" + id, "selectedSection");
      this.svc.allButOne("panelGroup",  "panel" + id);
      this.svc.toastNotify("Re-opened Section:" + this.agencyName + "==>" +  id);
      return true;
    }  
    return false;
  }

  selectNext(section:string){
      this.id = this.svc.idFormat(section);
      if(!this.isAlreadyOpen(this.id)) 
      {
        this.svc.selectSectionLevel(section, this.agencyName);
        this.svc.allButOne("section-tab-" + this.agencyName, "section_" + this.id, "selectedSection");
        this.svc.openSections.push(this.id);
        this.svc.toastNotify("Added to list: " + this.id);
      }
        this.currentPanel = "panel" + this.id;
        this.svc.toastNotify2("Current Panel: " + this.agencyName + " >> "+ this.currentPanel);
    }

  

}
