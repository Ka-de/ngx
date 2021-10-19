import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ColorTypes, Point, RGBA } from './color-picker.models';
import { ColorPickerService } from './color-picker.service';
import { faCopy, faTimes, faAngleUp, faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'bin-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerComponent implements OnInit, AfterContentInit {

  @Input() value!: string;
  @Input() defaultColors!: string[];
  @Input() systemColors!: string[];

  @Output() colorChange = new EventEmitter<string>();
  @Output() close = new EventEmitter();

  element!: HTMLElement;

  selectCanvas!: HTMLCanvasElement;
  selectContext!: CanvasRenderingContext2D;
  selectIndicator!: HTMLElement;
  selectIndicatorPoint: Point = { x: 0, y: 0 };
  isSelectActive = false;

  mainCanvas!: HTMLCanvasElement;
  mainContext!: CanvasRenderingContext2D;
  mainIndicator!: HTMLElement;
  mainIndicatorPoint: Point = { x: 0, y: 0 };
  isMainActive = false;

  opacityCanvas!: HTMLCanvasElement;
  opacityContext!: CanvasRenderingContext2D;
  opacityIndicator!: HTMLElement;
  opacityIndicatorPoint: Point = { x: 0, y: 0 };
  isOpacityActive = false;

  type: ColorTypes = ColorTypes.HEX;

  pickedColor: RGBA = { r: 0, b: 0, g: 0, a: 1 };
  show = false;
  light!: boolean;

  showDefaults = true;
  showSystems = true;

  faCopy = faCopy;
  faTimes = faTimes;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;

  constructor(
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private colorPickerService: ColorPickerService
  ) { }

  ngOnInit(): void {
    this.value = this.colorPickerService.nameToHex(this.value);
    this.light = this.colorPickerService.isLight(this.value);

    if (this.defaultColors) this.colorPickerService.defaultColors = this.defaultColors;
    if (this.systemColors) this.colorPickerService.systemColors = this.systemColors;

    this.defaultColors = this.colorPickerService.defaultColors as string[];
    this.systemColors = this.colorPickerService.systemColors as string[];
  }

  ngAfterContentInit(): void {
    this.element = this.el.nativeElement;
    this.changeDetector.detectChanges();

    this.selectCanvas = this.element.querySelector('.color-picker-window-select-canvas') as HTMLCanvasElement;
    this.selectContext = this.selectCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.selectIndicator = this.element.querySelector('.color-picker-window-select-indicator') as HTMLElement;
    this.calibrateSelect();
    this.monitorSelect();

    this.mainCanvas = this.element.querySelector('.color-picker-window-main-canvas') as HTMLCanvasElement;
    this.mainContext = this.mainCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.mainIndicator = this.element.querySelector('.color-picker-window-main-indicator') as HTMLElement;
    this.calibrateMain();
    this.monitorMain();

    this.opacityCanvas = this.element.querySelector('.color-picker-window-opacity-canvas') as HTMLCanvasElement;
    this.opacityContext = this.opacityCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.opacityIndicator = this.element.querySelector('.color-picker-window-opacity-indicator') as HTMLElement;
    this.calibrateOpacity();
    this.monitorOpacity();

    this.element.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target == this.element) this.removePicker();
    });

    this.selectColor(this.value);
  }

  calibrateSelect() {
    let selectGradient = this.selectContext.createLinearGradient(0, 0, this.selectCanvas.width, this.selectCanvas.height);

    //color stops
    selectGradient.addColorStop(0, "rgb(255, 0, 0)");
    selectGradient.addColorStop(0.15, "rgb(255, 0, 255)");
    selectGradient.addColorStop(0.33, "rgb(0, 0, 255)");
    selectGradient.addColorStop(0.49, "rgb(0, 255, 255)");
    selectGradient.addColorStop(0.67, "rgb(0, 255, 0)");
    selectGradient.addColorStop(0.87, "rgb(255, 255, 0)");
    selectGradient.addColorStop(1, "rgb(255, 0, 0)");

    this.selectContext.fillStyle = selectGradient;
    this.selectContext.fillRect(0, 0, this.selectCanvas.width, this.selectCanvas.height);
  }

  calibrateMain() {
    let mainGradient = this.mainContext.createLinearGradient(0, 0, this.mainCanvas.width, 0);

    //color stops
    mainGradient.addColorStop(0, "rgb(255, 255, 255)");
    mainGradient.addColorStop(1, `rgb(${this.pickedColor.r}, ${this.pickedColor.g}, ${this.pickedColor.b})`);

    this.mainContext.fillStyle = mainGradient;
    this.mainContext.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

    //add black and white stops
    mainGradient = this.mainContext.createLinearGradient(0, 0, 0, this.mainCanvas.height);
    mainGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    mainGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    this.mainContext.fillStyle = mainGradient;
    this.mainContext.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
  }

  calibrateOpacity() {
    let rgba;

    this.opacityContext.clearRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
    let opacityGradient = this.opacityContext.createLinearGradient(0, 0, this.opacityCanvas.width, 0);

    for (let i = 100; i >= 0; i--) {
      rgba = `rgba(${this.pickedColor.r},${this.pickedColor.g},${this.pickedColor.b},${i / 100})`
      opacityGradient.addColorStop(i / 100, rgba);
    }

    this.opacityContext.fillStyle = opacityGradient;
    this.opacityContext.clearRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
    this.opacityContext.fillRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
  }

  monitorSelect() {
    const select = (event: MouseEvent) => {
      this.selectIndicatorPoint = this.getPoint(this.selectCanvas, event)
      this.selectIndicator.style.left = this.selectIndicatorPoint.x + 'px';

      this.pickedColor = this.getPickedColor(this.selectContext, this.selectIndicatorPoint);
      this.calibrateMain();
      this.calibrateOpacity();

      this.changed();
      this.isSelectActive = event.type != 'click';
    };

    this.selectCanvas.onmousedown = (event) => {
      this.isSelectActive = true;
    };

    this.selectCanvas.onmousemove = (event: MouseEvent) => {
      if (this.isSelectActive) select(event);
    };

    this.selectCanvas.onclick = select;
  }

  monitorMain() {
    const select = (event: MouseEvent) => {
      this.mainIndicatorPoint = this.getPoint(this.mainCanvas, event)
      this.mainIndicator.style.top = this.mainIndicatorPoint.y + 'px';
      this.mainIndicator.style.left = this.mainIndicatorPoint.x + 'px';

      this.pickedColor = this.getPickedColor(this.mainContext, this.mainIndicatorPoint);
      this.calibrateOpacity();

      this.changed();
      this.isMainActive = event.type != 'click';
    };

    this.mainCanvas.onmousedown = (event) => {
      this.isMainActive = true;
    };

    this.mainCanvas.onmousemove = (event: MouseEvent) => {
      if (this.isMainActive) select(event);
    };

    this.mainCanvas.onclick = select;
  }

  monitorOpacity() {
    const select = (event: MouseEvent) => {
      this.opacityIndicatorPoint = this.getPoint(this.opacityCanvas, event)
      this.opacityIndicator.style.left = this.opacityIndicatorPoint.x + 'px';

      this.pickedColor = this.getPickedColor(this.opacityContext, this.opacityIndicatorPoint);

      this.changed();
      this.isOpacityActive = event.type != 'click';
    };

    this.opacityCanvas.onmousedown = (event) => {
      this.isOpacityActive = true;
    };

    this.opacityCanvas.onmousemove = (event: MouseEvent) => {
      if (this.isOpacityActive) select(event);
    };

    this.opacityCanvas.onclick = select;
  }

  getPickedColor(context: CanvasRenderingContext2D, point: { x: number, y: number }) {
    let imageData = context.getImageData(point.x, point.y, 1, 1);

    let alpha = Math.ceil(((imageData.data[3] / 255) * 100)) / 100;
    return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2], a: alpha } as RGBA;
  }

  getPoint(canvas: HTMLCanvasElement, event: MouseEvent) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    return { x, y } as Point;
  }

  removePicker = () => {
    this.isMainActive = false;
    this.isSelectActive = false;
    this.isOpacityActive = false;
    this.close.emit();
  }

  selectColor(color: string) {
    const [r, g, b, a] = this.colorPickerService.extractRGB(this.colorPickerService.nameToRGB(color)).split(',');
    this.pickedColor = { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) }

    this.calibrateMain();
    this.calibrateOpacity();
    this.changed();
  }

  changed() {
    this.value = `rgba(${this.pickedColor.r}, ${this.pickedColor.g}, ${this.pickedColor.b}, ${this.pickedColor.a})`;

    if (this.type == ColorTypes.HEX) this.value = this.colorPickerService.rgbToHex(this.value, true);
    this.light = this.colorPickerService.isLight(this.value);

    this.colorChange.emit(this.value);

    this.isMainActive = false;
    this.isSelectActive = false;
    this.isOpacityActive = false;
  }

  switchType(inc: number) {
    const list = Object.values(ColorTypes);
    let use = list.indexOf(this.type) + inc;

    use = use < 0 ? list.length - 1 : use;
    use = use >= list.length ? 0 : use;

    this.type = list[use];
    this.changed();
  }

  setRGBA(name: keyof RGBA, event: Event) {
    const element = event.target as HTMLInputElement
    this.pickedColor[name] = parseFloat(element.value);

    this.calibrateMain();
    this.calibrateOpacity();
    this.changed();
  }

  setHex(event: Event) {
    const element = event.target as HTMLInputElement;
    const [r, g, b, a] = this.colorPickerService.extractRGB(this.colorPickerService.toRGB(element.value)).split(',');
    this.pickedColor = { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) }

    this.calibrateMain();
    this.calibrateOpacity();
    this.changed();
  }

  copyColor(input: HTMLInputElement) {
    input.select();
    input.setSelectionRange(0, 99999999);

    navigator.clipboard.writeText(input.value);
    this.faCopy = faCheck;
    setTimeout(() => {
      this.faCopy = faCopy;
    }, 2000);
  }

}
