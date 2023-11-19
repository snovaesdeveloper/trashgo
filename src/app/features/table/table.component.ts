import {AfterViewInit, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import TableColDefinition, {ControlType} from "./table-col-definition";
import {MenuItem, MessageService} from "primeng/api";
import {TableService} from "./table-service";
import * as _ from "lodash";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UsuarioService} from "../../services/usuario.service";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import * as moment from "moment";
import {UtilService} from "../../services/util.service";
import {Table} from 'primeng/table';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    providers: [MessageService],
})
export class TableComponent implements AfterViewInit {

    @ViewChild("table") tableDOM: Table;
    @Input("enableRowExpansion") enableRowExpansion: boolean = false;
    @Input("globalFilterFields") globalFilterFields: string[];
    @Input("columns") columns: TableColDefinition[] = [];
    @Input("dados") dados: any = [];
    totalRecords: number = 0;
    @Input("loading") loading: boolean = true;
    @Input("sortField") sortField: string;
    @Input("sortOrder") sortOrder: number;
    @Input("pageSize") pageSize: number = 5;
    columnsActive: TableColDefinition[]= [];
    @Input("itemsMenu") itemsMenu: MenuItem[];
    @Input("showRowOptions") showRowOptions: boolean = false;
    @Input("showCheckboxSelection") showCheckboxSelection: boolean = false;
    @Input("showEditRow") showEditRow: boolean = false;
    @Input("rest") rest: string;
    @Input("dataFormatter") dataFormatter: Function;

    lastEvent: any;
    @Input("specialFilters") specialFilters: { mode: string, field: string, value: any }[] = [];
    dadosClone: any = [];
    form: UntypedFormGroup = this.formBuilder.group({});
    alreadyEditing: Boolean = false;
    ControlType = ControlType;

    @Input("multipleSortField") multipleSortField: {field: string, order: number}[] = [];
    columnsActivePrime: any[] = [];
    counter: number = 0;
    JSON = JSON;
    @Input() sortMode: string = "multiple";
    selections: any = [];
    firstRun: boolean = true;

    constructor(public tableService: TableService, private http: HttpClient, private usuarioService: UsuarioService, private formBuilder: UntypedFormBuilder, private utilService: UtilService) {

        if(this.sortField){
            this.multipleSortField.push({order: this.sortOrder, field: this.sortField});
        }

    }

    async ngAfterViewInit(){

        this.selections = [];

        this.columnsActive = this.columns.filter(value => {return value.display;});

        this.tableService.forceReload.subscribe((value: any) => {
            this.counter = 0;
            this.load(this.lastEvent);
        });

        this.tableService.reload.subscribe((value: any) => {
            this.load(this.lastEvent);
        });

        this.tableService.specialFilters.subscribe(value => {
            this.specialFilters = value;
        });

        this.usuarioService.changed.subscribe(value => {
            this.load(this.lastEvent);
        });

    }

    async recount(event: any){

        let criteria = "";

        let filters = Object.keys(event.filters);

        for(let filter of filters){
            let filterData = event.filters[filter][0];
            if(filterData.value != null){
                criteria += `&${(this.columns.find(value => value.name == filter) || this.columns.find(value => value.filterField == filter))?.filterField || filter}.${filterData.matchMode}=${filterData.value}`;
            }
        }

        this.totalRecords = await this.http.get(`${environment.urlBackend}/${this.rest}/count?${criteria}`).toPromise().then((value: number) => {return value});

        this.tableService.totalData.emit(this.totalRecords);

    }

    async load(event: { first: number, rows: number, sortField: any, sortOrder: number, globalFilter: string, filters: any[], multiSortMeta: {field: string, order: number}[ ] }) {

        this.columnsActive = this.columns.filter(value => {return value.display;});

        for(let filter of this.specialFilters){
            event.filters[filter.field] = [{value: filter.value, matchMode: filter.mode, operator: 'and'}];
        }

        this.lastEvent = event;

        let recarregarFiltros = false;

        if(this.sortMode == 'single' && event.sortField){
            this.multipleSortField = [];
            this.multipleSortField.push({field: event.sortField, order: event.sortOrder});
        }else if(event.multiSortMeta && event.multiSortMeta.length){
            if(this.multipleSortField.find(value => {return value.field == event.multiSortMeta[0].field})){
                if(this.multipleSortField.find(value => {return value.field == event.multiSortMeta[0].field}).order != event.multiSortMeta[0].order){
                    this.multipleSortField.find(value => {return value.field == event.multiSortMeta[0].field}).order = event.multiSortMeta[0].order;
                    recarregarFiltros = true;
                }
            }else{
                this.multipleSortField.push({field: event.multiSortMeta[0].field, order: event.multiSortMeta[0].order});
                recarregarFiltros = true;
            }
        }

        this.loading = true;

        let criteria = "";

        criteria += `size=${event.rows}&page=${event.first/event.rows}`;
        for(let sort of this.multipleSortField){
            criteria += `&sort=${sort.field},${sort.order > 0 ? 'asc' : 'desc'}`;
        }
        let filters = Object.keys(event.filters);
        for(let filter of filters){
            let filterData = event.filters[filter][0];
            if((filterData.value != null && !Array.isArray(filterData?.value)) || (Array.isArray(filterData?.value) && filterData?.value?.length)){
                criteria += `&${(this.columns.find(value => value.name == filter) || this.columns.find(value => value.filterField == filter))?.filterField || filter}.${filterData.matchMode}=${filterData.value}`;
            }
        }

        // @ts-ignore
        this.dados = (await this.http.get(`${environment.urlBackend}/${this.rest}?${criteria}`).toPromise().then((value: any[]) => {return value})).map(this.dataFormatter);

        this.tableService.allData.emit(this.dados);

        this.loading = false;

        this.recount(this.lastEvent);

        this.tableService.lastCriteria = criteria;

        this.tableDOM._multiSortMeta = this.multipleSortField;

        if(recarregarFiltros){
            // @ts-ignore
            this.tableDOM.__ngSimpleChanges__.current = this.tableDOM.__ngSimpleChanges__.previous;
        }

        this.counter++;

    }

    onSelectionChange($event: any) {

    }

    at(object: any, property: string) {
        return _.at(object, property)[0];
    }

    removeMask(value: string, mask: string) {
        let characters = mask.replace(new RegExp("[0-9]", "g"), "");
        for (let i = 0; i < characters.length; i++) {
            value = value.replace(characters.charAt(i), "");
        }
        return value;
    }

    onRowEditInit(row: any) {

        this.alreadyEditing = true;

        this.form = this.formBuilder.group({

        });

        this.columns.forEach(value => {
            this.form.addControl(value.filterField, value?.control || new UntypedFormControl());
            if(row[value.filterField]?.id){
                value.controlOptions?.forEach(option => {
                    if(option?.value?.id == row[value.filterField]?.id){
                        this.form.get(value.filterField).setValue(option);
                    }
                });
            }else{
                if(value.controlType == ControlType.DROPDOWN_WITH_VALUE){
                    value.controlOptions?.forEach(option => {
                        if(option?.value == row[value.filterField]){
                            this.form.get(value.filterField).setValue(option);
                        }
                    });
                }else{
                    this.form.get(value.filterField).setValue(value.controlType == ControlType.DATE ? moment(row[value.filterField], "YYYY-MM-DD").format("DD/MM/YYYY") : row[value.filterField]);
                }
            }
        });

        this.dadosClone[row.id] = {...row};

    }

    onRowEditSave(row: any) {

        if(true || this.form.valid) {

            let body = this.form.getRawValue();
            let keys = Object.keys(body);
            for(let key of keys){
                if(body[key]?.value){
                    body[key] = body[key]?.value;
                }else if(this.utilService.validarData(body[key])){
                    body[key] = moment(body[key], "DD/MM/YYYY").format("YYYY-MM-DD");
                }
            }

            this.http.put(`${environment.urlBackend}/${this.rest}/${body.id}`, body).subscribe(value => {
                this.tableService.reload.emit(true);
                this.alreadyEditing = false;
            }, error => {
                console.error(error);
            });

        }else{

        }

    }

    onRowEditCancel(row: any, index: number) {
        this.alreadyEditing = false;
        delete this.dadosClone[row.id];
    }

    log(col: any) {
        console.log(col);
    }

    mudarSelecao(event: any) {
        console.log(this.firstRun)
        if(this.firstRun)
            this.firstRun = false;
        else
            this.tableService.selecaoAtual.emit(event);
    }

}
