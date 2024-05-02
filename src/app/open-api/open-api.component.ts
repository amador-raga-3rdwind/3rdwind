import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-open-api',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './open-api.component.html',
  styleUrl: './open-api.component.css'
})
export class OpenApiComponent {
constructor(){

}
  isLoading:boolean = false;

  API_arguments: Array<Object>=[];
  URL: string="1";
  agencyName = "NASA";
  paramObject = "startDate=2017-01-03&endDate=2017-01-03";
  apiArea = "DONKI/CME/";


  triggerAgency(agencyName:string){
    this.agencyName = agencyName;
    document.getElementById("triggerFinger")?.click();
  }

  nodeExpand(id: string){
    document.getElementById(id)?.classList.remove("hidden");
  }

  nodeCollapse(id: string){
    document.getElementById(id)?.classList.add("hidden");
  }


  ngOnInit(): void {
}


}
