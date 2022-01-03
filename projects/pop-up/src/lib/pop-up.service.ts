import { Injectable } from '@angular/core';
import { PopUpComponent } from './pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private modals: PopUpComponent[] = [];

  constructor() { }

  add(modal: PopUpComponent) {        
    if (modal.id) {
      this.modals.push(modal);
    }
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string, data?: any) {
    const modal = this.modals.find(x => x.id === id) as PopUpComponent;
    modal.open(data);
  }

  close(id: string) {
    const modal = this.modals.find(x => x.id === id) as PopUpComponent;
    modal.close();
  }

  delete(id: string) {
    this.close(id);
    this.remove(id);
  }

  getModals() {
    return this.modals;
  }
}
