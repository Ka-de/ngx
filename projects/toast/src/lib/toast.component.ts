import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faTimes, faRedo, faCheckCircle, faTimesCircle, faBrain, faInfo } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ToastPosition, ToastTypes } from '../public-api';
import { ToastSize } from './models/toast.size';
import { Toast } from './toast.class';
import { ToastService } from './toast.service';


@Component({
  selector: 'bin-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {

  /**
   * @remarks
   * This is the toast component
   * It manages the all the visible toasts in the browser
   * By default only 3 top toasts are displayed by that can be changed by passing an input variable @param {number} nVisible
   * 
   * @param {number} nVisible - This is the max-number of visible toasts at every moment 
   * @param {Array<Toast>} toasts - This is the list of toasts in the system currently
   * @param {Subscription} subscriptions - This is the container for all the subscriptions in the component
   * @param {IconDefinition} faTimes - This is the close icon for each particular toast item
   */

  @Input() nVisible = 3;
  @Input() timeout = 5000;
  @Input() size = ToastSize.FULL;
  @Input() position = ToastPosition.BOTTOMRIGHT;

  private subscriptions = new Subscription();

  toasts!: Toast[];
  ToastSize = ToastSize;
  ToastPosition = ToastPosition;
  ToastTypes = ToastTypes;

  faTimes = faTimes;
  faRedo = faRedo;

  constructor(
    private toastServices: ToastService
  ) { }

  ngOnInit(): void {
    /**
     * @remarks
     * Subscribe to @type {ToastService} and get all the toasts
     * Select to top visible toasts
     * Set a timeout for each toast then remove the toast if required(not sticky)
     */

    this.subscriptions.add(
      this.toastServices.toasts.subscribe(toasts => {
        this.toasts = toasts.slice(0, this.nVisible);

        for (let toast of this.toasts) {
          let time = setTimeout(() => {
            if (!toast.sticky) this.remove(toast.id);
            clearTimeout(time);
          }, this.timeout);
        }
      })
    );
  }

  ngOnDestroy(): void {
    /**
     * @remarks
     * Unsuscribe all the subscriptions in the component
     */

    this.subscriptions.unsubscribe();
  }

  remove(id: string) {
    /**
     * @remarks
     * This is used to remove a toast from the toast items
     * 
     * @param {string} id - This is the id of the toast to be removed
     */

    this.toastServices.remove(id);
  }

  retry(toast: Toast) {
    /**
     * @remarks
     * This is used to retry the failed action performed by a toast
     * The toast is removed immediately this action is triggered
     * 
     * @param {Toast} toast - This is the toast to retry it's action
     */
    
    if (toast.retry) toast.retry();
    this.toastServices.remove(toast.id);
  }

  getBarge(type: ToastTypes) {
    /**
     * @remarks
     * This is used to get the icon for the toast depending on the @param type
     * 
     * @param {ToastTypes} type - This is the type of the the toast 
     */

    let barge = faInfo;
    if (type == ToastTypes.SUCCESS) barge = faCheckCircle;
    else if (type == ToastTypes.ERROR) barge = faTimesCircle;
    else if (type == ToastTypes.ACTION) barge = faBrain;
    else if (type == ToastTypes.INFO) barge = faInfo;

    return barge;
  }

  getColor(type: ToastTypes) {
    /**
     * @remarks
     * This is used to get the color for the toast depending on the @param type
     * 
     * @param {ToastTypes} type - This is the type of the the toast 
     */

    let color = 'black';
    if (type == ToastTypes.SUCCESS) color = 'green';
    else if (type == ToastTypes.ERROR) color = 'red';
    else if (type == ToastTypes.ACTION) color = 'yellow';
    else if (type == ToastTypes.INFO) color = 'blue';

    return color;
  }
}
