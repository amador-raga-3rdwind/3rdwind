import { Component } from '@angular/core';
import readXlsxFile from 'read-excel-file'

@Component({
  selector: 'app-xls-to-json',
  standalone: true,
  imports: [],
  templateUrl: './xls-to-json.component.html',
  styleUrl: './xls-to-json.component.css'
})
export class XlsToJsonComponent {



jsonData:any = [];
fileName = ""

  convertToJson(){
        const input = document.getElementById("excel_file") as HTMLInputElement;
        const xlsFile = input!.files;
        this.fileName = input.files!.item.name;
        readXlsxFile(xlsFile![0] ).then((data:any) => {
          const headers = data[0];
          for (let i = 1; i < data.length; i++) {
              const temp:any = {};
              for (let j = 0; j < headers.length; j++) {
                  temp[headers[j]] = data[i][j];
              }
              this.jsonData.push(temp);
          }
        const el = document.querySelector("json_data")
        el!.setAttribute("value", JSON.stringify(this.jsonData) );
        }   );
  }



downloadObjectAsJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.jsonData);
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", this.fileName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}



}
