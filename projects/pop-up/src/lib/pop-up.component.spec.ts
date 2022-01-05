import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpComponent } from './pop-up.component';

describe('PopUpComponent', () => {
  let component: PopUpComponent;
  let fixture: ComponentFixture<PopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open', () => {
    component.open({ state: 'stateless' });
    expect(component.data.state).toBe('stateless');
    expect(component.element.style.display).toBe('block');
    expect(document.body.classList).toContain('popup-open');
  });

  it('should close', () => {
    component.close();
    expect(component.element.style.display).toBe('none');
    expect(document.body.classList).not.toContain('popup-open');
  });

  it('should toggle', () => {
    component.toggleFull();
    expect(component.full).toBe(true);

    component.toggleFull();
    expect(component.full).toBe(false);
  });
});
