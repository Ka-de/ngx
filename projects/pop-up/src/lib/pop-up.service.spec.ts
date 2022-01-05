import { ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpComponent } from './pop-up.component';

import { PopUpService } from './pop-up.service';

describe('PopUpService', () => {
  let service: PopUpService;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpService);
  });

  beforeEach(() => {
    component = {
      id: "Hello world"
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a component to modal list', () => {
    service.add(component);
    const modals = service.getModals();
    expect(modals.length).toBe(1);
  });

  it('should fail to add if component does not have an id', () => {
    delete component.id;
    service.add(component);
    expect(service.getModals().length).toBe(0);
  });

  it('should remove a component from modal list', () => {
    service.add(component);
    service.remove(component.id);
    const modals = service.getModals();
    expect(modals.length).toBe(0);
  });

  it('should fail to remove a component from modal list if id does not exist', () => {
    service.add(component);
    service.remove('component.id');
    const modals = service.getModals();
    expect(modals.length).toBe(1);
  });

});
