import { Injectable } from '@angular/core';
import { PopUpComponent } from './pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private popups: PopUpComponent[] = [];

  constructor() { }

  add(popup: PopUpComponent) {
    /**
     * @remark
     * This is used to add a pop-up 
     * Should fail if @param popup doesn't have an id, or id already in use
     * 
     * @param {PopUpComponent} popup - This is the pop-up component
     */

    if (popup.id) {
      if (this.popups.find(m => m.id == popup.id)) {
        console.error(`${popup.id} is already taken by another pop-up`);
        return;
      }

      this.popups.push(popup);
    }
    else {
      console.error(`id is required in popup`);
    }
  }

  remove(id: string) {
    /**
     * @remark
     * This is used to remove a pop-up 
     * 
     * @param {string} id - This is the id of the pop-up component
     */

    this.popups = this.popups.filter(x => x.id !== id);
  }

  open(id: string, data?: any) {
    /**
     * @remark
     * This is used to open a pop-up 
     * 
     * @param {string} id - This is the id of the pop-up component
     * @param {any} data - This is the new state of the embedded compoents input
     */

    const popup = this.popups.find(x => x.id === id) as PopUpComponent;
    popup.open(data);
  }

  close(id: string) {
    /**
     * @remark
     * This is used to close a pop-up 
     * 
     * @param {string} id - This is the id of the pop-up component
     */

    const popup = this.popups.find(x => x.id === id) as PopUpComponent;
    popup.close();
  }

  delete(id: string) {
    /**
     * @remark
     * This is used to delete a pop-up 
     * 
     * @param {string} id - This is the id of the pop-up component
     */

    this.close(id);
    this.remove(id);
  }

  getpopups() {
    /**
     * @remark
     * This is used to get all pop-ups
     */

    return this.popups;
  }
}
