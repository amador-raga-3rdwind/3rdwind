
import { Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import {StaticComponent} from "./static.component";


export const routes: Routes = [

{ path: "",           component: OpenApiComponent },
{ path: "open-api",           component: OpenApiComponent },
{ path: "static", component: StaticComponent },
];
