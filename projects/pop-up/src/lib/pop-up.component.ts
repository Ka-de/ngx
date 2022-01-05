import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Input, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { PopUpService } from './pop-up.service';
import { faTimes, faWindowMinimize, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { PopUpPosition } from './models/pop-up.position';

@Component({
  selector: 'bin-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopUpComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * @remarks
   * This is the pop-up component
   * It manages the all the visible pop-ups in the browser
   * 
   * @param {string} id - This is the unique id of the pop-up
   * @param {Type<any>} component - This is the to be embedded in the pop-up window
   * @param {string} heading - This is the title of the pop-up
   * @param {any} data - This is the data to be feed into the component
   * @param {any} full - This is the flag to decide width of pop-up
   * @param {PopUpPosition} position - This is the position of the pop-up on the browser
   */

  @Input() id!: string;
  @Input() component!: Type<any>;
  @Input() heading!: string;
  @Input() data!: any;
  @Input() full = false;
  @Input() position = PopUpPosition.LEFT;

  componentHolder!: ComponentRef<any>;
  element!: HTMLElement;

  faTimes = faTimes;
  faWindowMinimize = faWindowMinimize;
  faWindowMaximize = faWindowMaximize;

  PopUpPosition = PopUpPosition;
  @ViewChild("body", { read: ViewContainerRef }) bodyRef!: ViewContainerRef;

  constructor(
    private popupService: PopUpService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
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
    /**
     * @remark
     * This is used to remove a pop-up window
     * 
     * @param {Event} event - This is the event (click) that triggered it
     */

    const clicked = event.target as HTMLElement;
    if (this.element == clicked) {
      this.popupService.close(this.id);
    }
  }

  open(data: any = {}) {
    /**
     * @remark
     * This is used to open a pop-up window
     * 
     * @param {any} data - This is the current state of the component's data
     */

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
    /**
     * @remark
     * This is used to close a pop-up window
     */

    this.element.style.display = "none";
    document.body.classList.remove("popup-open");
    if (this.componentHolder) {
      this.componentHolder.destroy();
    }

    this.element.removeEventListener("click", this.removeWindow, false);
  }

  toggleFull() {
    /**
     * @remark
     * This is used to toggle full-width of a pop-up window
     */

    this.full = !this.full;
    if(this.componentHolder){
      this.componentHolder.instance.data = { ...this.data, full: this.full };
    }
  }
}
