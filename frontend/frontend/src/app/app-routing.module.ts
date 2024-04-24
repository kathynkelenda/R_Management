import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,RouterOutlet,Routes } from '@angular/router';

const routes: Routes = [
  {path:'/', pathMatch: 'full', redirectTo: ''}
]
  
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    RouterOutlet
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
