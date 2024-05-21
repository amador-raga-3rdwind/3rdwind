import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RangeValueAccessor } from '@angular/forms';


type flexible = Iterable<any> | undefined;


@Component({
  selector: 'app-api-proto',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './api-proto.component.html',
  styleUrl: './api-proto.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApiProtoComponent {
  constructor()
  {}
  menuItems: Array<any> =  
          [
            /*
            .##....##.......###........######........###...
            .###...##......##.##......##....##......##.##..
            .####..##.....##...##.....##...........##...##.
            .##.##.##....##.....##.....######.....##.....##
            .##..####....#########..........##....#########
            .##...###....##.....##....##....##....##.....##
            .##....##....##.....##.....######.....##.....##
            */
            { "NASA":
              [
                {"APOD":"planetary/apod/"},
                {"DB of Notifications, Knowledge, Information":"DONKI/"},
                {"Asteroids Neo":"neo/rest/v1/"},
                {"Earth Imagery":"earth/imagery/"},
                {"EPIC":"epic/api/natural/"},
                {"OSDR":"https://osdr.nasa.gov/osdr/data/osd/files/"},
              ]
            },

            /*
            .########.....##.....##.....######.
            .##.....##....##.....##....##....##
            .##.....##....##.....##....##......
            .##.....##....#########.....######.
            .##.....##....##.....##..........##
            .##.....##....##.....##....##....##
            .########.....##.....##.....######.
            */
            { "DHS":
              [
                {"National Terrorism Advisory System":"*"},
                {"FEMA":"FEMA"},
                {"TSA Web Service":"*"},
              ]
            },

            /*
            .########.....##.....##.......###...
            .##.....##....##.....##......##.##..
            .##.....##....##.....##.....##...##.
            .##.....##....##.....##....##.....##
            .##.....##.....##...##.....#########
            .##.....##......##.##......##.....##
            .########........###.......##.....##
            */
            { "DVA":
              [
                {"Patient Health":"fhir/v0/r4/"},
                {"Benefits Claims":"claims/v2/"},
                {"Service History anc Eligibility":"veteran_verification/v2/"},
              ]
            },

            /*
            .########....########.....########.......###........######.....##.....##....########.....##....##
            ....##.......##.....##....##............##.##......##....##....##.....##....##.....##.....##..##.
            ....##.......##.....##....##...........##...##.....##..........##.....##....##.....##......####..
            ....##.......########.....######......##.....##.....######.....##.....##....########........##...
            ....##.......##...##......##..........#########..........##....##.....##....##...##.........##...
            ....##.......##....##.....##..........##.....##....##....##....##.....##....##....##........##...
            ....##.......##.....##....########....##.....##.....######......#######.....##.....##.......##...
            */
            { "TREASURY": 
              [
                {"120 Day Delinquent Debt Referral Compliance Report":"/v2/debt/tror/data_act_compliance"},
                {"Redemption Tables":"/v2/accounting/od/redemption_tables"},
                {"Unemployment Funds (Social Security Act Title XII":"/v2/accounting/od/title_xii"},
                {"Average Interest Rates on U.S. Treasury Securities":"v2/accounting/od/avg_interest_rates"},
              ]
            }
          ]



  Agencies:   flexible =["NASA", "DVA" , "TREASURY", "DHS", "DHA"];
  Divisions:  flexible =[] ;
  Sections:   flexible =[];
  
  loop:number =0;
  isReady: boolean = false;
  serverExpress = "http://localhost:3000/";


      // ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
      // ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
      // ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
      // ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
      // ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
      // ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
      // ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  

  ngOnInit(): void {
  }

  getSubMenuItems(menuData: any, selectedMenu: string) {
    for (const menuItem of menuData) {
      if (Object.keys(menuItem)[0] === selectedMenu) {
        if (Array.isArray(menuItem[selectedMenu])) {
          const result = menuItem[selectedMenu].map( (item: {}) => item );
          return result; 
        }
      }
    }
    return [];
  }



  delimiter:string="|";
  agencyName:string="";
  selectMenuLevel(sourceMenu: flexible, menuItem:string, fire:boolean=false): any{
    console.clear();
    const triggerElement = document.querySelector("#htmxTrigger")!; 
    if(fire){
      (document.querySelector("#outputPanel1") as HTMLElement).innerHTML = "<h1>L O A D I N G ....</h1>";  
      const info = menuItem.split(this.delimiter + ",");
      document.querySelector("#agency")?.setAttribute("value",this.agencyName);
      document.querySelector("#agencyFields")?.setAttribute("value", (info[1]===undefined) ?info[0]: info[1] );
      document.querySelector("#specialAgency")?.setAttribute("value", "NO");
      console.table(triggerElement);
      console.log(this.agencyName, info, "NO");
      (triggerElement as HTMLButtonElement).click(); 
      return;
    }
    if(menuItem.includes(this.delimiter + ",")) {
      // triggerElement.setAttribute("hx-post", "http://localhost:3000/htmx-fetch-fields");
      // triggerElement.setAttribute("hx-target", "#outputPanel1");
      // console.table(triggerElement);
      this.selectMenuLevel(sourceMenu, menuItem, true);
    }

    let menuResult =[];
    const result =  this.getSubMenuItems(sourceMenu,menuItem);
      for( this.loop=0; this.loop<result.length; this.loop++)
        {
          const item = result[this.loop]; 
          let kv: Array<string> = [];
          let value:string  = Object.values(item)[0] +"" ;
          kv.push( Object.keys(item)[0] + (value===""?"": this.delimiter ));
          kv.push(value);
          menuResult.push(kv.toString())
        }
    return menuResult;
  }

  ngAfterViewInit(): void {
    this.isReady = true;
  }


}
