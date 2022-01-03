import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { IToast } from './models/toast.interface';
import { Toast } from './toast.class';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /**
   * @remarks
   * This is used to manange all the toasts in the browser
   * 
   * @param {Array<Toast>} items - This is the list of toasts in the browser
   * @param {Subscriber<Array<Toast>>} subscriber - This is the subscriber to the changes in the @param items
   * @param {Observable<Array<Toast>>} toasts - This is the observer to the @param subscriber
   */

  private items: Toast[] = [];
  private subscriber!: Subscriber<Toast[]>;

  toasts = new Observable<Toast[]>((subscriber) => {
    this.subscriber = subscriber;
    this.subscriber?.next(this.items);

    return {
      unsubscribe() { }
    };
  });

  constructor() { }

  add(item: IToast) {
    /**
     * @remarks
     * This is used to add a toast to the toast items
     * 
     * @param {IToast} item - This is item to be added into the toast items
     * 
     * @return {Toast} - Returns the added toast
     */

    const toast = new Toast(item);
    this.items.push(toast);
    this.subscriber?.next(this.items);

    return toast;
  }

  update(id: string, update: Partial<IToast>) {
    /**
     * @remarks
     * This is used to update a toast in the toast items
     * 
     * @param {string} id - This is id of the toast to be updated
     * @param {Partial<IToast>} update - This is the new attribute to update with
     */

    this.items = this.items.map((item) => {
      if (item.id == id) return { ...item, ...update };
      return item;
    });

    this.subscriber?.next(this.items);
  }

  remove(id: string) {
    /**
     * @remarks
     * This is used to remove a toast from the toast items
     * 
     * @param {string} id - This is id of the toast to be updated
     */

    this.items = this.items.filter((item) => item.id != id);
    this.subscriber?.next(this.items);
  }
}