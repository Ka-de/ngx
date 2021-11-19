import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

export interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'bin-signature-editor',
  templateUrl: './signature-editor.component.html',
  styleUrls: ['./signature-editor.component.scss']
})
export class SignatureEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() image!: string;
  @Input() width = 500;
  @Input() hieght = 300;
  @Output() signature = new EventEmitter<string>();

  context!: CanvasRenderingContext2D;
  trackMouse = false;

  lastPoint!: Point;
  
  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(){

  }

  ngAfterViewInit(){
    const element = this.elementRef.nativeElement as HTMLElement;
    const canvas = element.querySelector('#canvas') as HTMLCanvasElement;
    
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.context.canvas.width = this.width;
    this.context.canvas.height = this.hieght;

    this.draw();
  }

  draw(){    
    this.context.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      this.trackMouse = true;
      this.lastPoint = this.getPoint(event);

      this.context.canvas.addEventListener("mousemove", this.drawTracks, false);
    });

    this.context.canvas.addEventListener("mouseup",  (event: MouseEvent) => {
      this.trackMouse = false;
      this.context.canvas.removeEventListener("mousemove", this.drawTracks, false);
    });
  } 

  drawTracks  = (event: MouseEvent) => {
    if(!this.trackMouse) return;
    
    this.context.beginPath();
    this.context.moveTo(this.lastPoint.x, this.lastPoint.y);

    const point = this.getPoint(event);
    this.context.lineTo(point.x, point.y);

    this.context.closePath();
    this.context.stroke();

    this.lastPoint = point;
  }

  getPoint(event: MouseEvent) {
    const x = event.clientX - this.context.canvas.getBoundingClientRect().left;
    const y = event.clientY - this.context.canvas.getBoundingClientRect().top;

    return { x, y } as Point;
  }

  getImage(){
   this.image = this.context.canvas.toDataURL();  
   
   this.signature.emit(this.image);
  }

  setStrokeStyle(value: Event){    
    this.context.strokeStyle = (event?.target as HTMLInputElement).value as string;
  }

  setLineWidth(value: Event){
    this.context.lineWidth = +((event?.target as HTMLInputElement).value as string);
  }

  setCap(value: Event){
    this.context.lineCap = (event?.target as HTMLInputElement).value as CanvasLineCap;;
  }

}
