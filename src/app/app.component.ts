import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { XlsToJsonComponent } from "./TOOLS/xls-to-json/xls-to-json.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: '../3rdwind.css',
    imports: [RouterOutlet, XlsToJsonComponent]
})
export class AppComponent {
  title = '3rdwind';
}
