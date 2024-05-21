import { Injectable, WritableSignal, signal } from '@angular/core';

type flexible = Iterable<any> | undefined| Array<string>;
@Injectable({
  providedIn: 'root'
})
export class OpenAPIService {
  constructor() { }

  baseSections: Array<any> =  
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
            { "Treasury": 
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
          delimiter:string="|";
          agencyName:string="";
          

          

// ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
// ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
// ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
// ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
// ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
// ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
// ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  

//! Get the List of Sections under a selected Agency
      getSubSections(selectedAgency: string) {
        for (const section of this.baseSections) {
          if (Object.keys(section)[0] === selectedAgency) {
            if (Array.isArray(section[selectedAgency])) {
              const sections = section[selectedAgency].map( (section: {}) => section );
              return  sections; 
            }
          }
        }
        return  [];
      }
    
      toastMessage: WritableSignal<string> = signal("");
      toastMessage2: WritableSignal<string> = signal("");
      openSections : Array<string> =[];
  
    
      selectSectionLevel(section:string, agencyName:string="", fire:boolean=false): any{
        const sectionID  = this.idFormat(section);
        this.allButOne("panelGroup","panel" + sectionID);
        //! IMPORTANT:  target is assigned before it is fired. DO not move this.
        const triggerElement = document.querySelector("#triggerCategory")!; 
        triggerElement?.setAttribute("hx-target", "#output" + sectionID + "1");
        if(fire){
          const panel1 = document.querySelector("#output" + sectionID + "1")
          panel1?.classList.remove("hidden")
          const info = section.split(this.delimiter + ",");
          document.querySelector("#agency")?.setAttribute("value", agencyName);
          document.querySelector("#sectionID")?.setAttribute("value", sectionID);
          document.querySelector("#agencyFields")?.setAttribute("value", (info[1]===undefined) ?info[0]: info[1] );
          document.querySelector("#specialAgency")?.setAttribute("value", "NO");
          //! Make sure that target is ready, as declared on first iteration
          (triggerElement as HTMLButtonElement).click();
          this.toastNotify(`Fetching API Data (${info[0]})`) ;
          return
        }

        if(section.includes(this.delimiter + ",")) {
          //! 3rd paramter true means "FIRE"
//! todo: Avoid fetching the API fields again when there is already one.
          if(document.querySelector("#output" + sectionID + "1")?.innerHTML !=""){
            this.toastNotify("Getting current values to ease network traffic");
            return;
          }
          this.selectSectionLevel(section, agencyName, true);

        }
    
        let menusections =[];
        const sections =  this.getSubSections(section);
          for( this.loop=0; this.loop<sections.length; this.loop++)
            {
              const section = sections[this.loop]; 
              let kv: Array<string> = [];
              let value:string  = Object.values(section)[0] +"" ;
              kv.push( Object.keys(section)[0] + (value===""?"": this.delimiter ));
              kv.push(value);
              menusections.push(kv.toString())
            }
        return menusections;
      }

      idFormat(id:string){
        let result = id.replaceAll(" ", "").replace("|","").replace("\/","");
        result = result.substring(0,15);
        result = result.replaceAll(",","");
        return result;
      }

      allButOne(allClass: string, oneID: string, action: string="hidden"){
        const elements = document.querySelectorAll("." + allClass );
        const flip: boolean = (action === "hidden");
        for(let x=0; x< elements.length; x++){
          elements[x].classList[ flip ? "add" : "remove"](action);
        }
          document.querySelector("#" + oneID)?.classList[ flip ? "remove" : "add"](action);   
      }
      
      
      toastNotify(message: string){
        this.toastMessage.set(message);
        if (message=="") this.negateItem("#toastNotify")
        else this.affirmItem(".toastNotify")
      }

      toastNotify2(message: string){
        this.toastMessage2.set(message);
        if (message=="") this.negateItem("#toastNotify2")
        else this.affirmItem(".toastNotify2")
      }

      negateItem(id:string, action: string="hidden"){
        let flip : boolean = (action ==="hidden");
        if(action ===""){
          action="hidden";
          flip = false;
        }
        const firstChar = id.substring(0,1);
        if( !"*.".includes(firstChar) ) {
          this.toastNotify("The item should be labelled with the [# or .] selector"); return;
        }
        if(firstChar===".") {
          const elements = document.querySelectorAll(id);
          for(let x=0; x<elements.length ; x++) {
            elements[x].classList[ flip ? "add" : "remove" ](action);
          } return;
        }
          document.querySelector(id)?.classList[ flip ? "add" : "remove" ](action);
      }

      affirmItem(id: string,action:string="")
      {
        this.negateItem(id, action);
      }

}
