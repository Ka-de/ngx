import { ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpComponent } from './pop-up.component';

import { PopUpService } from './pop-up.service';

describe('PopUpService', () => {
  let service: PopUpService;
  let component: PopUpComponent;
  let fixture: ComponentFixture<PopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpComponent);
    component = fixture.componentInstance;
    component.id = "Hello world";
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add if component is a PopUpComponent', () => {
    service.add(component);    
    expect(service.getModals().find(m => m.id.includes('Hello world'))).toBeTruthy();
  });

  it('should not add if component does not have an id', () => {
    delete (component as any).id;
    service.add(component);
    expect(service.getModals().length).toBe(1);
  });

});
