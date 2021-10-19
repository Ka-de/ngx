import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'bin-object-selector',
  templateUrl: './object-selector.component.html',
  styleUrls: ['./object-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObjectSelectorComponent implements OnInit {
  @Input() input!: any[];
  @Output() output!: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
