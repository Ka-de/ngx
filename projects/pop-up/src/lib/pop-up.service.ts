import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private modals: any[] = [];

  constructor() { }

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string, data?: any) {
    const modal = this.modals.find(x => x.id === id);
    modal.open(data);
  }

  close(id: string) {
    const modal = this.modals.find(x => x.id === id);    
    modal.close();
  }

  delete(id: string) {
    this.close(id);
    this.remove(id);
  }
}
