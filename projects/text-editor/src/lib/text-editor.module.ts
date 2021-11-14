import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColorPickerModule } from '@black-ink/color-picker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TextEditorComponent } from './text-editor.component';



@NgModule({
  declarations: [
    TextEditorComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ColorPickerModule
  ],
  exports: [
    TextEditorComponent
  ]
})
export class TextEditorModule { }
