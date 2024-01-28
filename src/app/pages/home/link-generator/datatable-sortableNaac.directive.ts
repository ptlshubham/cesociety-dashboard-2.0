import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { TableNaac } from './datatable.model';

export type SortColumnNaac = keyof TableNaac | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEventNaac {
  column: SortColumnNaac;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'th[sortableNaac]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class SortableNaacDirective {

  constructor() {
    
   }

  @Input() sortableNaac: SortColumnNaac = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEventNaac>();
 
  rotate() {
     
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableNaac, direction: this.direction });
  }
}
