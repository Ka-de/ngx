import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { IToast } from './models/toast.interface';
import { Toast, ToastTypes } from './toast.class';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let toast: Toast;
  let data: IToast = { title: 'Sample Toast', type: ToastTypes.ACTION }
  let subscriptions: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    toast = service.add(data);

    subscriptions = new Subscription();
  });

  afterEach(() => {
    subscriptions.unsubscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a toast to list of toast items', () => {
    expect(toast.id).toBeDefined();
    subscriptions.add(
      service.toasts.subscribe(t => {
        expect(t.length).toEqual(1);
        expect(t[0].title).toContain('Sample Toast');
      })
    );
  });

  it('should update a toast in toast items', () => {
    service.update(toast.id, { title: "Updated", type: ToastTypes.SUCCESS });
    subscriptions.add(
      service.toasts.subscribe(items => {
        const item = items.find(t => t.id == toast.id);
        expect(item?.title).toContain('Updated');
        expect(item?.type).toContain(ToastTypes.SUCCESS);
      })
    );
  });

  it('should remove a toast from toast items', () => {
    service.remove(toast.id);
    subscriptions.add(
      service.toasts.subscribe(t => {
        expect(t.length).toEqual(0);
      })
    );
  });
});
