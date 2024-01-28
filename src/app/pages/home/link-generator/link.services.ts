import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { TableNaac } from './datatable.model';
import { SortColumnNaac, SortDirection } from './datatable-sortableNaac.directive';
import { naacData } from './linkData';


interface SearchResult {
    NaacTotal: number;
    tableNaac: TableNaac[];
}


interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortDirection: SortDirection;
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    sortColumn: SortColumnNaac;
    searchTermPay: string;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

/**
 * Sort the table data
 * @param Table field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(tables: TableNaac[], column: SortColumnNaac, direction: string): TableNaac[] {

    if (direction === '' || column === '') {
        return tables;
    } else {
        return [...tables].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}
/**
 * Sort the table data
 * @param TableNaac field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */


/**
 * Table Data Match with Search input
 * @param  Table field value fetch
 * @param term Search the value
 */
function matches(table: TableNaac, term: string, pipe: PipeTransform) {

    return pipe.transform(table.srNo).includes(term)
        || table.criteria.toLowerCase().includes(term.toLowerCase())
        || table.subMenu.toLowerCase().includes(term.toLowerCase())
        || table.subToSub.toLowerCase().includes(term.toLowerCase())
        || table.linkName.toLowerCase().includes(term.toLowerCase())
        || table.link.toLowerCase().includes(term.toLowerCase())
        || table.createddate.toLocaleLowerCase().includes(term.toLowerCase())

}

@Injectable({
    providedIn: 'root'
})

export class DataTableNaacService {
    // tslint:disable-next-line: variable-name
    private _loading$ = new BehaviorSubject<boolean>(true);
    // tslint:disable-next-line: variable-name
    private _search$ = new Subject<void>();
    // tslint:disable-next-line: variable-name
    private _table$ = new BehaviorSubject<TableNaac[]>([]);
    // tslint:disable-next-line: variable-name
    private _totals$ = new BehaviorSubject<number>(0);
    // tslint:disable-next-line: variable-name
    private _state: State = {
        page: 1,
        pageSize: 35,
        searchTerm: '',
        searchTermPay: '',
        sortDirection: '',
        startIndex: 0,
        endIndex: 9,
        totalRecords: 0,
        sortColumn: ''
    };


    constructor(private pipe: DecimalPipe) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {

            this._table$.next(result.tableNaac);
            this._totals$.next(result.NaacTotal);
        });
        this._search$.next();
    }

    /**
     * Returns the value
     */
    get table$() { return this._table$.asObservable(); }
    get totals$() { return this._totals$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }

    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }


    get startIndex() { return this._state.startIndex; }
    get endIndex() { return this._state.endIndex; }
    get totalRecords() { return this._state.totalRecords; }

    /**
     * set the value
     */
    // tslint:disable-next-line: adjacent-overload-signatures
    set page(page: number) { this._set({ page }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    // tslint:disable-next-line: adjacent-overload-signatures
    set startIndex(startIndex: number) { this._set({ startIndex }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set endIndex(endIndex: number) { this._set({ endIndex }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }

    set sortColumn(sortColumn: SortColumnNaac) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
        // this._searchPayment$.next();
    }
    /**
     * Search Method
     */
    private _search(): Observable<SearchResult> {

        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
        // 1. sort
        let tableNaac = sort(naacData, sortColumn, sortDirection);
        // 2. filter
        tableNaac = tableNaac.filter(tableNaac => matches(tableNaac, searchTerm, this.pipe));
        const NaacTotal = tableNaac.length;
        // 3. paginate
        this.totalRecords = tableNaac.length;
        this._state.startIndex = (page - 1) * this.pageSize + 1;
        this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
        if (this.endIndex > this.totalRecords) {
            this.endIndex = this.totalRecords;
        }
        tableNaac = tableNaac.slice(this._state.startIndex - 1, this._state.endIndex);
        return of(
            { tableNaac, NaacTotal }
        );
    }

}
