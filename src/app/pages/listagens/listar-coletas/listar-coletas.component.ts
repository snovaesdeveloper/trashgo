import {Component} from '@angular/core';
import {HttpDataFormatterService} from "../../../services/httpDataFormatter.service";
import {NgxMaskService} from "ngx-mask";
import {UtilService} from "../../../services/util.service";
import {MenuItem} from "primeng/api";
import TableColDefinition from "../../../features/table/table-col-definition";
import {DialogService, DynamicDialogConfig} from "primeng/dynamicdialog";
import {TableService} from "../../../features/table/table-service";
import {HttpClient} from "@angular/common/http";
import {ExcelService} from "../../../services/excelService";
import {PdfService} from "../../../services/pdfService";
import {ActivatedRoute} from "@angular/router";
import Coleta from "../../../classes/Coleta";
import _ from "lodash";
import {CadastrarColetaComponent} from "../../cadastros/cadastrar-coleta/cadastrar-coleta.component";
import {environment} from "../../../../environments/environment";
import {ConfirmacaoComponent} from "../../../features/confirmacao/confirmacao.component";

@Component({
    selector: 'app-listar-coletas',
    templateUrl: './listar-coletas.component.html',
    styleUrls: ['./listar-coletas.component.scss'],
    providers: [HttpDataFormatterService, NgxMaskService, UtilService]
})
export class ListarColetasComponent {

    rest: string = "coletas";
    itemsMenu: MenuItem[] = [];
    loading: boolean = false;
    filterFields: string[] = [];
    columns: TableColDefinition[] = [{
        name: 'dataFormatada',
        title: 'Data',
        filter: true,
        sort: true,
        display: true,
        filterField: 'dataFormatada',
        export: true,
        filterType: "contains",
    }, {
        name: 'pontosColeta',
        title: 'Pontos de Coleta',
        filter: true,
        sort: true,
        display: true,
        filterField: 'pontosColeta',
        export: true,
        filterType: "contains",
    }, {
        name: 'status',
        title: 'Status',
        filter: true,
        sort: true,
        display: true,
        filterField: 'status',
        export: true,
        filterType: "contains",
    }];
    pageSize: number = 5;
    dados: any[] = [];
    dadosFiltrados: any[] = [];

    constructor(private dialogService: DialogService, public tableService: TableService, private http: HttpClient, public httpDataFormatterService: HttpDataFormatterService, public excelService: ExcelService, public pdfService: PdfService, public config: DynamicDialogConfig, private route: ActivatedRoute) {

        tableService.selected.subscribe((value: Coleta) => {
            this.itemsMenu = [{
                label: 'Editar', command: () => {
                    this.openRegister(_.cloneDeep(value))
                }
            }];
        });

    }

    ngOnInit() {
        this.filtrar();
    }

    openRegister(coleta?: Coleta) {

        let ref = this.dialogService.open(CadastrarColetaComponent, {
            header: coleta ? coleta.id ? "Editar" : "Cadastrar" : "Cadastrar", width: '80%', height: '80%', data: {
                entidade: coleta || new Coleta()
            }
        });

        ref.onClose.subscribe(async (entidade: Coleta) => {
            if (entidade) {

                if (entidade.id) {
                    this.http.put(`${environment.urlBackend}/${this.rest}/${entidade.id}`, entidade).subscribe(value => {
                        this.filtrar();
                    }, error => {
                        this.openRegister(entidade);
                    });
                } else {
                    this.http.post(`${environment.urlBackend}/${this.rest}`, entidade).subscribe(value => {
                        this.filtrar();
                    }, error => {
                        this.openRegister(entidade);
                    });
                }

            }
        });

    }

    filtrar() {

        this.http.get(`${environment.urlBackend}/${this.rest}`).subscribe((locais: Coleta[]) => {
            this.dados = locais.map(this.httpDataFormatterService.coletaFormatter());
            this.dadosFiltrados = this.dados;
            this.atualizarCards();
        });

    }

    atualizarCards(event?:any){
        if(event)
            this.dadosFiltrados = event;
    }

}
