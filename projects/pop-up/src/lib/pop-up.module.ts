import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopUpComponent } from './pop-up.component';



@NgModule({
  declarations: [
    PopUpComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    PopUpComponent
  ]
})
export class PopUpModule { }
