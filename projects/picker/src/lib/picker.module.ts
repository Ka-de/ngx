import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PickerComponent } from './picker.component';



@NgModule({
  declarations: [
    PickerComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    PickerComponent
  ]
})
export class PickerModule { }
