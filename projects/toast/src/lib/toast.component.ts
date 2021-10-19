import { Component, OnDestroy, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Toast, ToastTypes } from './toast.models';
import { ToastService } from './toast.service';


@Component({
  selector: 'bin-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts!: Toast[];
  subscriptions = new Subscription();

  faTimes = faTimes;

  constructor(
    private toastServices: ToastService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.toastServices.toasts.subscribe(toasts => {
        this.toasts = toasts.slice(0, 3);

        for (let toast of this.toasts) {
          let time = setTimeout(() => {
            console.log(toast);
            
            if(!toast.sticky) this.remove(toast.id);
            clearTimeout(time);
          }, 5 * 1000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  remove(id: string) {
    this.toastServices.remove(id);
  }

  retry(toast: Toast){
    if(toast.retry) toast.retry();
  }
}
