import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerService, ColorPickerServiceConfig } from './color-picker.service';



@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    ColorPickerComponent
  ]
})
export class ColorPickerModule {
  constructor(
    @Optional() @SkipSelf() parentModule?: ColorPickerModule
  ) {
    if (parentModule) {
      throw new Error(`${ColorPickerModule.name} is already loaded. Import it in the AppModule only`);
    }
  }

  static forRoot(
    config: ColorPickerServiceConfig
  ): ModuleWithProviders<ColorPickerModule> {
    return {
      ngModule: ColorPickerModule,
      providers: [
        {
          provide: ColorPickerService,
          useValue: config
        }
      ]
    }
  }
}
