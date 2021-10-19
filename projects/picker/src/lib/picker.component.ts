import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { faAngleDown, faAngleUp, faCheck, faCheckSquare, faSquare, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bin-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PickerComponent implements OnInit {
  @Input() input!: any[];
  @Output() output = new EventEmitter<string | string[]>();
  @Input() multi!: boolean;
  @Input() value!: string | string[];
  @Input() pairs!: { key: string, value: string };
  @Input() icon!: string;

  text = '';
  result: { key: string, value: string }[] = [];
  items: string[] = [];
  showItems = false;
  element!: HTMLElement;

  faTimes = faTimes;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;

  get list() {
    const l: { key: string, value: string }[] = [];
    if(this.pairs){
      for (let i of this.input) {
        l.push({key: i[this.pairs.key], value: i[this.pairs.value]})
      }
    }

    return l;
  }

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.value = this.value ? this.value : this.multi ? [] : '';
    this.items = this.value as string[];

    if (this.list) {
      this.changed(this.list.find(l => l.key == this.value)?.value || '');
    }

    this.element = this.el.nativeElement;
    document.addEventListener('click', event => {
      if (!(event as any).path.includes(this.element)) this.showItems = false;
    });
  }

  changed(value: string) {
    this.result = this.list.filter(p => p.value.toLowerCase().includes(value.toLowerCase())).filter(t => !this.items.includes(t.key));
    this.text = value;
  }

  removeItem(item: string) {
    this.items = this.items.filter(t => t != item);
    this.changed(this.text);
  }

  getItemValue(item: string) {
    return this.list.find(l => l.key == item)?.value as string;
  }

  pick(key: string) {
    if (this.multi) {
      this.items = Array.from(new Set([...this.items, key]));
      this.changed(this.text);
    }
    else {
      this.value = key;
      this.text = this.list.find(l => l.key == key)?.value as string;

      this.output.emit(this.value);
      this.showItems = false;
    }
  }
}
