import { Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import { ApiProtoComponent } from './api-proto/api-proto.component';
    
export const routes: Routes = [
{ path: "open-api",     component: OpenApiComponent },
{ path: "open-proto",   component: ApiProtoComponent }

];
