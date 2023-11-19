import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    selected: EventEmitter<any> = new EventEmitter<any>();
    reload: EventEmitter<any> = new EventEmitter<any>();
    forceReload: EventEmitter<any> = new EventEmitter<any>();
    lastCriteria: string;
    allData: EventEmitter<any> = new EventEmitter<any>();
    totalData: EventEmitter<number> = new EventEmitter<number>();
    selecaoAtual: EventEmitter<any[]> = new EventEmitter<any[]>();
    specialFilters: EventEmitter<{ mode: string, field: string, value: any }[]> = new EventEmitter<{ mode: string, field: string, value: any }[]>();
    constructor() {

    }

}
