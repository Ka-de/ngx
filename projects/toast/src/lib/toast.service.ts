import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { Toast } from './toast.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  items: Toast[] = [];
  observer!: Subscriber<Toast[]>;

  toasts = new Observable<Toast[]>((observer) => {
    this.observer = observer;
    this.observer.next(this.items);

    return {
      unsubscribe() { }
    };
  });

  constructor() { }

  add(item: Partial<Toast>) {
    const toast = new Toast(item);
    this.items.push(toast);
    this.observer.next(this.items);

    return toast;
  }

  update(id: string, update: Partial<Toast>) {
    this.items = this.items.map((item) => {
      if (item.id == id) return { ...item, ...update };
      return item;
    });
    this.observer.next(this.items);
  }

  remove(id: string) {
    this.items = this.items.filter((item) => item.id != id);
    this.observer.next(this.items);
  }
}