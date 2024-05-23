import { CUSTOM_ELEMENTS_SCHEMA, Component,   ElementRef, Input, SecurityContext, Signal, SimpleChanges, ViewChild, signal, ɵunwrapSafeValue } from '@angular/core';
import { OpenAPIService } from '../services/open-api.service';
import { CommonModule } from '@angular/common';
import { FederalModelComponent } from '../../agencies/MODEL/federal-model.component';

@Component({
  selector: 'agency-section',
  standalone: true,
  imports: [CommonModule, FederalModelComponent],
  templateUrl: './agency-sections.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgencySectionsComponent {
  constructor(public svc:OpenAPIService){
  this.SectionsList = this.svc.getSectionsList(this.svc.selectedAgency());
  }
  
 @Input() sectionName: string = ""; 
 outerSpace!: FederalModelComponent;
 @ViewChild(FederalModelComponent)  alienModel!: FederalModelComponent;
  
 
 SectionsList : Array<string> = [];
 SubSectionsList : Array<string> = [];
 SectionsList2 : Array<any> = [];
  isReady: boolean = false;
  id: string = "";
  selectedSection: string = "";
 relayMessage: string ="";

  sectionAbstract: Array<string> =[];
  sectionReference: Array<string> =[];
  sectionURL:Array<string>=[];
  loadingPanel =`<span class="loading loading-ring text-warning loading-5xl"></span>`;
   


  ngOnInit(): void {  
    this.isReady = true;
    this.SectionsList = this.svc.getSectionsList(this.sectionName);
  }


  async selectNextLevel(section:string=""){
    if(sessionStorage.getItem("CHATTER")+ "" !="")
      {
        this.svc.chatMessage.set( "" );
        this.svc.cursorY.set(`top-[10px]`);
        const chat = (sessionStorage.getItem("CHATTER")+ "").split("|");
        const cursorLocation = (sessionStorage.getItem("cursorLocation")+ "").split("|");
        this.svc.cursorY.set(`${cursorLocation[1]}`);
              sessionStorage.setItem("CHATTER" , "");
              return
      }                 
    this.selectedSection = section;
    this.id = this.svc.idFormat(section);
    const paneNumber =  this.svc.openSections.indexOf(this.id)>=0 ? 1: 0; // isEmpty ? 0 : 1;
        //! If already exists, then why waste your time.
        this.svc.toastNotify(`Fetching API Data....`) ;
        const fireElement: string = await this.fireWhenReady(this.selectedSection,paneNumber);
        if(fireElement!=="FAILURE"){
                this.svc.openSections.push(this.id);
                this.svc.toastNotify("Added to list: " + this.id);
        }
        else {
        }
  }

 
  // async spaceShake(sectionName: string=""){
  //     const  message = (sessionStorage.getItem("OuterSpaceSession")+"").split("|||");
  //     const agency  = message[0]
  //     const action  = message[1]
  //     const baggage = message[2];
  //     sessionStorage.removeItem("OuterSpaceSession")
  //     sessionStorage.setItem("isReady", "false");
      
  //     switch(action){
  //       case "fireWhenReady":
  //         // this.svc.northernLights.set("<h1 class='w-full bg-green-300 text-6xl'>LOADING...</h1>")
  //         const obj: any ={};
  //         obj.sectionID =  sectionName??agency;
  //         obj.agency =    agency;  
  //         obj.outerSpace =     baggage + "_METEORITES_" ;
  //         const html=await this.svc.spaceFetch(obj, 1);
  //         alert("DONE")
  //         // sessionStorage.setItem("isReady", "true");
  //         this.svc.northernLights.set(html);
  //         break;
  //       case "proxy":
  //         this.alienModel.unlock();
  //         break;        
  //       default: break;
  //     }
  //     return 
  //   }


    sendHome( html: string, panelDestination: string){
      if(html!="error"){
        document.querySelector("#"+ panelDestination )!.innerHTML = `<div>${html}</div>`;
        return "SUCCESS";
     }
        return "FAILURE"
    }

   
    async fireWhenReady(sectionChosen:string, paneNumber: number=0): Promise<any>{
            const ID =  this.svc.idFormat(sectionChosen);
                        let obj: any = {};
                        const info = sectionChosen.split(this.svc.delimiter + ",");
                        obj.sectionID =       ID;
                        obj.agency =          this.sectionName;  // trust me, this is the name of the Agency that houses the component. 
                        obj.agencyFields =   (info[1]===undefined) ?info[0]: info[1] ;
                        obj.specialAgency =  "NO";
                        obj.attachment =  sessionStorage.getItem("ATTACHMENT")
                        let html: any =  await this.svc.spaceFetch(obj, paneNumber, this.id);
                        const currentPanel = this.sectionName + ID + this.svc.panelType[paneNumber];
                        return this.sendHome(html, currentPanel);
    }


}
