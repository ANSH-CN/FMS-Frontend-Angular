import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RmResourcesComponent } from '../modal/rm-resources.component';



const routes: Routes = [
  { path: '', component: RmResourcesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmResourcesRoutingModule { }
