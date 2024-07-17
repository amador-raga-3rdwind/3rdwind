import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { UtilsService } from '../../../app/services/UtilsService';
import { DomSanitizer } from '@angular/platform-browser';

interface alienObj  {info: string, tags:string, paths:string};
interface JsonObject {[key: string]: any;}
@Component({
  selector: 'dummy-space-station',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space-station.component.html',
  styleUrl: './space-station.component.css'
})
export class SpaceStationComponent {
  constructor( public  utils: UtilsService, public sanitizer: DomSanitizer)
 {}

portal: { key: string; values: {info:any, tags:any, expo: string}; }[] = [];
expo = signal("");
infoToggle = true ;
info = signal<any>({"title":"", "version":"", "description":""});
tags = signal<any>([{"name":"", "description":""}]);
PortalReadyMessage = signal("");
isSystemReady = false;
alienInfo: Array<JsonObject>  = [];
isHoverMode = signal(true);
agencyVault = signal("");



async scanPayload(destination:string){
  if(this.isSystemReady) this.utils.messageNorthStar(this.utils.loading)
  try {
        const result:any = Object.values(this.portal).find( (item) =>  item.key === destination );
        const obj = result!.values
        this.agencyVault.set(result.vault);
        if(Array.isArray(obj.expo))
          this.expo.set(this.utils._SECTION(obj.expo[0], this.isHoverMode()?'':'hidden') +
          this.utils._SECTION(obj.expo[1], this.isHoverMode()?'hidden':'')) ;
        else this.expo.set(obj.expo);
        this.tags.set(obj.tags);
        this.info.set(obj.info);
  } catch(err){

  }
  this.isSystemReady = true;
  this.utils.messageNorthStar("")
}



ngOnInit(): void {

}

ngAfterViewInit(): void {
}




}
