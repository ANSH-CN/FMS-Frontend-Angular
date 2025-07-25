import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GenerateRequestsComponent } from '../modal/generate-requests.component';

const routes: Routes = [
        { path: '', component: GenerateRequestsComponent }
];

@NgModule({
        imports: [
                CommonModule,
                RouterModule.forChild(routes)
        ],
        exports: [
                RouterModule
        ],
        declarations: []
})
export class GenerateRequestsRoutingModule { }
