import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SignatureEditorComponent } from './signature-editor.component';



@NgModule({
  declarations: [
    SignatureEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SignatureEditorComponent
  ]
})
export class SignatureEditorModule { }
