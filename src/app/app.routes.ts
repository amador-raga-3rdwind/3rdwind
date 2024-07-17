
import { Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import { XlsToJsonComponent } from './TOOLS/xls-to-json/xls-to-json.component';








export const routes: Routes = [

// { path: "",           component: AppComponent },
{ path: "",           component: OpenApiComponent },
{ path: "xls-json" , component: XlsToJsonComponent},
];
