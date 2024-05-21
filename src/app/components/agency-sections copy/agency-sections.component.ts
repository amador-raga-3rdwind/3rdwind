import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, ViewChild } from '@angular/core';
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

  }
  @Input() agencyName: string = ""; 
  @ViewChild('parentContainer', { static: true }) parentContainer!: ElementRef;

  SectionsList : Array<string> = [];
  SubSectionsList : Array<string> = [];
  isReady: boolean = false;
  rootLevel : number = 0;

  ngOnInit(): void {
    this.selectNext(this.agencyName);
  }

  selectNext(section:string, level:number=0){
    if(this.rootLevel>0){
      const elements = document.querySelectorAll(".section-tab-"+ this.agencyName);
      for(let x=0;  x< elements.length; x++){
          elements[x].classList.remove("selectedItem");
      }
      document.querySelector("#" + this.agencyName + "_section" + level)?.classList.add("selectedItem");
      this.SubSectionsList    = this.svc.selectSectionLevel("root", section.toUpperCase(), this.agencyName.toUpperCase());

    }
    else
    {
      this.SectionsList    = this.svc.selectSectionLevel("root", section.toUpperCase(), this.agencyName.toUpperCase());
     } 
    this.rootLevel++;
    this.isReady = true;
  }


  ngAfterViewInit(): void {
    this.isReady = true;
    const elements = this.parentContainer.nativeElement.querySelectorAll('.dummy');
    elements.forEach((element: HTMLElement) => {
      element.id += "_" + this.agencyName.toUpperCase(); 
      element.setAttribute("hx-target", element.getAttribute("hx-target") + "_" + this.agencyName.toUpperCase() );
    });

  }

}
