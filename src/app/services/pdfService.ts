import {Injectable} from '@angular/core';
import * as moment from "moment";
import * as _ from "lodash";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import TableColDefinition from "../features/table/table-col-definition";
import {TableService} from "../features/table/table-service";

class ColumnPdfExport{
    content: string;
    colSpan: number;
    rowSpan: number;
    halign?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PdfService {


    constructor(private http: HttpClient, private tableService: TableService) {
    }

    createPdfCustom(cols: ColumnPdfExport[][], dados: any[]){
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default('l', 'mm', [297, 210]);
                // @ts-ignore
                doc.autoTable({
                    styles: {
                        halign: 'center',
                        valign: 'middle',
                        lineWidth: 0.1,
                        lineColor: [0, 0, 0],
                    },
                    head: cols,
                    body: dados.map(value => {
                        let keys = Object.keys(value);
                        return keys.map(val => {
                            return {content: value[val], colSpan: 1, rowSpan: 1};
                        })
                    })
                });
                doc.save("PDF.pdf");
            })
        })
    }

    createPdfDados(columns: TableColDefinition[], dados: any, dataFormatter: Function, filename: string) {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default('l', 'mm', [297, 210]);
                // @ts-ignore
                doc.autoTable(columns.filter(col => {
                    return col.display
                }).map(col => {
                    return {title: col.title, dataKey: col.title};
                }), dados.map(value => {
                    let item = {};
                    columns.filter(col => {
                        return col.display
                    }).forEach(col => {
                        item[col.title] = this.removeHtmlTags(col.name.includes('.') ? _.at(value, col.name)[0] : value[col.name]);
                    });
                    return item;
                }));
                doc.save(filename + ".pdf");
            })
        })
    }

    createPdf(columns: TableColDefinition[], rest: string, dataFormatter: Function, filename: string) {
        this.http.get(`${environment.urlBackend}/${rest}?${this.tableService.lastCriteria.replace("size=", "").replace("page=", "")}&size=99999`).subscribe((dados: any) => {
            dados = dados.map(dataFormatter);
            import("jspdf").then(jsPDF => {
                import("jspdf-autotable").then(x => {
                    const doc = new jsPDF.default('l', 'mm', [297, 210]);
                    // @ts-ignore
                    doc.autoTable(columns.filter(col => {
                        return col.display
                    }).map(col => {
                        return {title: col.title, dataKey: col.title};
                    }), dados.map(value => {
                        let item = {};
                        columns.filter(col => {
                            return col.display
                        }).forEach(col => {
                            item[col.title] = this.removeHtmlTags(col.name.includes('.') ? _.at(value, col.name)[0] : value[col.name]);
                        });
                        return item;
                    }));
                    doc.save(filename + ".pdf");
                })
            })
        });
    }

    removeHtmlTags(html){
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

}
