import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { IToast } from './models/toast.interface';
import { ToastTypes } from './toast.class';

import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;
  let subscriptions: Subscription;
  let data: IToast = { title: 'Sample Toast', type: ToastTypes.ACTION }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [ToastService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ToastService);
    fixture.detectChanges();

    subscriptions = new Subscription();
  });

  afterEach(() => {
    subscriptions.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a single toast item', () => {
    const toast = service.add(data);
    component.remove(toast.id);
    subscriptions.add(
      service.toasts.subscribe(t => {      
        expect(t.length).toEqual(0);
      })
    );
  });

  it('should not remove a single toast item when id is not found', () => {
    service.add(data);
    component.remove('Hello');
    subscriptions.add(
      service.toasts.subscribe(t => {      
        expect(t.length).toEqual(1);
      })
    );
  });
});
