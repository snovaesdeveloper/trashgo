import {Injectable} from '@angular/core';
import * as moment from "moment";
import * as _ from "lodash";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as FileSaver from "file-saver";
import TableColDefinition from "../features/table/table-col-definition";
import {TableService} from "../features/table/table-service";

@Injectable({
    providedIn: 'root'
})
export class ExcelService {


    constructor(private http: HttpClient, private tableService: TableService) {
    }

    exportExcelDados(columns: TableColDefinition[], dados: any, dataFormatter: Function, filename: string, specialFilter?: Function) {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(dados.map(value => {
                let item = {};
                columns.filter(col => {
                    return col.display
                }).forEach(col => {
                    item[col.title] = (this.removeHtmlTags(col.name.includes('.') ? _.at(value, col.name)[0] : value[col.name]));
                    if(!item[col.title] || item[col.title] == "null") item[col.title] = "";
                });
                return item;
            }));
            const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, filename);
        });
    }

    exportExcel(columns: TableColDefinition[], rest: string, dataFormatter: Function, filename: string, specialFilter?: Function) {
        this.http.get(`${environment.urlBackend}/${rest}?${this.tableService.lastCriteria.replace("size=", "").replace("page=", "")}&size=99999`).subscribe((dados: any) => {
            if(specialFilter){
                dados = dados.filter(specialFilter).map(dataFormatter);
            }else{
                dados = dados.map(dataFormatter);
            }
            import("xlsx").then(xlsx => {
                const worksheet = xlsx.utils.json_to_sheet(dados.map(value => {
                    let item = {};
                    columns.filter(col => {
                        return col.display
                    }).forEach(col => {
                        item[col.title] = (this.removeHtmlTags(col.name.includes('.') ? _.at(value, col.name)[0] : value[col.name]));
                        if(!item[col.title] || item[col.title] == "null") item[col.title] = "";
                    });
                    return item;
                }));
                const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
                const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
                this.saveAsExcelFile(excelBuffer, filename);
            });

        });
    }

    exportExcel2(columns: TableColDefinition[], dados: any, filename: string) {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(dados.map(value => {
                let item = {};
                columns.filter(col => {
                    return col.display
                }).forEach(col => {
                    item[col.title] = (this.removeHtmlTags(col.name.includes('.') ? _.at(value, col.name)[0] : value[col.name]));
                    if(!item[col.title] || item[col.title] == "null") item[col.title] = "";
                });
                return item;
            }));
            const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, filename);
        });
    }

    removeHtmlTags(html){
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

}
