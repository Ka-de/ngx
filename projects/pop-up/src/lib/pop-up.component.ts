import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Input, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { PopUpService } from './pop-up.service';
import { faTimes, faWindowMinimize, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'bin-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopUpComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id!: string;
  @Input() component!: Type<any>;
  @Input() heading!: string;
  @Input() data!: any;
  @Input() full = false;

  componentHolder!: ComponentRef<any>;
  element!: HTMLElement;

  faTimes = faTimes;
  faWindowMinimize = faWindowMinimize;
  faWindowMaximize = faWindowMaximize;

  @ViewChild("body", { read: ViewContainerRef }) bodyRef!: ViewContainerRef;

  constructor(
    private popupService: PopUpService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    if (!this.id) {
      console.log('Modal must have an id')
      return;
    }

    this.popupService.add(this);
  }

  ngAfterViewInit() {
    this.element = this.el.nativeElement;
  }

  ngOnDestroy(): void {
    this.popupService.remove(this.id);
    this.element.remove();
  }

  removeWindow = (event: Event) => {
    const clicked = event.target as HTMLElement;
    if (this.element == clicked) {
      this.popupService.close(this.id);
    }
  }

  open(data: any = {}) {
    this.element.style.display = "block";
    document.body.classList.add("popup-open");
    this.data = { ...this.data, ...data };

    if (this.component) {
      const c = this.componentFactoryResolver.resolveComponentFactory(this.component);
      this.componentHolder = this.bodyRef.createComponent(c);
      this.componentHolder.instance.data = { ...this.data, full: this.full };
    }

    this.element.addEventListener('click', this.removeWindow, false);
  }

  close() {
    this.element.style.display = "none";
    document.body.classList.remove("popup-open");
    if (this.componentHolder) {
      this.componentHolder.destroy();
    }

    this.element.removeEventListener("click", this.removeWindow, false);
  }

  toggleFull() {
    this.full = !this.full;
    this.componentHolder.instance.data = { ...this.data, full: this.full };
  }
}
