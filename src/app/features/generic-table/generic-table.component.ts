import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import TableColDefinition from "../table/table-col-definition";
import {TableService} from "../table/table-service";
import * as _ from "lodash";
import {HttpClient} from "@angular/common/http";
import {MenuItem} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {Table} from "primeng/table";

@Component({
    selector: 'app-generic-table',
    templateUrl: './generic-table.component.html',
    styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {

    @ViewChild("dt") dt: Table;
    @Input("colunas") set colunas(colunas: TableColDefinition[]){
        this._colunas = colunas;
        this.ngOnInit();
    }
    _colunas: TableColDefinition[] = [];
    colunasAtivas: TableColDefinition[] = [];
    _dados: any[] = [];
    @Input("dados") set dados(dados: any){
        this._dados = dados;
        this.ngOnInit();
    }
    @Input("enableRowExpansion") enableRowExpansion: boolean = false;
    @Input("showRowOptions") showRowOptions: boolean = false;
    @Input("rest") rest: string = "";
    @Input("itemsMenu") itemsMenu: MenuItem[];
    @Input("loading") loading: boolean = false;
    @Input("pageSize") pageSize: number = 1000;
    totalRecords: number = 0;
    @Output("dadosFiltrados") dadosFiltrados = new EventEmitter<any>();
    @Input("showCheckboxSelection") showCheckboxSelection: boolean = false;
    @Input("selections") selections: any = [];

    constructor(public tableService: TableService, private http: HttpClient, private dialogService: DialogService) {

    }

    ngOnInit(): void {
        this._colunas = this._colunas.map(value => {
            if((!value.filterOptions || !value.filterOptions.length) && (value.filterType == 'equals' || value.filterType == 'in')){
                value.filterOptions = [...new Set(this._dados.map(val => {return value.name.includes('.') ? this.at(val, value.name) : val[value.name]}))].map(val => {return {value: val, label: val}}).sort((a, b) => {
                    if (a.label > b.label)
                        return 1;
                    if (a.label < b.label)
                        return -1;
                    return 0;
                });
            }
            return value;
        });
        this.colunasAtivas = this._colunas.filter(value => {return value.display});
        this.totalRecords = this._dados.length;
    }

    removeMask(value: string, mask: string) {
        let characters = mask.replace(new RegExp("[0-9]", "g"), "");
        for (let i = 0; i < characters.length; i++) {
            value = value.replace(characters.charAt(i), "");
        }
        return value;
    }

    at(object: any, property: string) {
        return _.at(object, property)[0];
    }

    callbackFiltro(event: any) {
        this.dadosFiltrados.emit(event.filteredValue)
    }

    mudarSelecao(event: any) {
        this.tableService.selecaoAtual.emit(event);
    }

}
