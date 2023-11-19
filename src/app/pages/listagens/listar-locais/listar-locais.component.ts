import {Component, OnInit} from '@angular/core';
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
import Local from "../../../classes/Local";
import _ from "lodash";
import {CadastrarLocalComponent} from "../../cadastros/cadastrar-local/cadastrar-local.component";
import {environment} from "../../../../environments/environment";
import {ConfirmacaoComponent} from "../../../features/confirmacao/confirmacao.component";
import {DivIcon, latLng, Marker, tileLayer} from "leaflet";
import {TipoLocal} from "../../../classes/enums/TipoLocal";

@Component({
    selector: 'app-listar-locais',
    templateUrl: './listar-locais.component.html',
    styleUrls: ['./listar-locais.component.scss'],
    providers: [HttpDataFormatterService, NgxMaskService, UtilService]
})
export class ListarLocaisComponent implements OnInit {

    rest: string = "locals";
    itemsMenu: MenuItem[] = [];
    loading: boolean = false;
    filterFields: string[] = [];
    columns: TableColDefinition[] = [{
        name: 'tipo',
        title: 'Tipo',
        filter: true,
        sort: true,
        display: true,
        filterField: 'tipo',
        export: true,
        filterType: "contains",
    },{
        name: 'nome',
        title: 'Nome',
        filter: true,
        sort: true,
        display: true,
        filterField: 'nome',
        export: true,
        filterType: "contains",
    },{
        name: 'endereco.bairro',
        title: 'Bairro',
        filter: true,
        sort: true,
        display: true,
        filterField: 'endereco.bairro',
        export: true,
        filterType: "contains",
    }];
    pageSize: number = 5;
    dados: any[] = [];
    dadosFiltrados: any[] = [];
    options: any = {
        layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 14,
        center: latLng(-1.4217229, -48.4593428)
    };
    layers = [];

    constructor(private dialogService: DialogService, public tableService: TableService, private http: HttpClient, public httpDataFormatterService: HttpDataFormatterService, public excelService: ExcelService, public pdfService: PdfService, public config: DynamicDialogConfig, private route: ActivatedRoute) {

        tableService.selected.subscribe((value: Local) => {
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

    openRegister(local?: Local) {

        let ref = this.dialogService.open(CadastrarLocalComponent, {
            header: local ? local.id ? "Editar" : "Cadastrar" : "Cadastrar", width: '70%', data: {
                entidade: local || new Local()
            }
        });

        ref.onClose.subscribe(async (entidade: Local) => {
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

        this.http.get(`${environment.urlBackend}/${this.rest}`).subscribe((locais: Local[]) => {
            this.dados = locais.map(this.httpDataFormatterService.localFormatter());
            this.dadosFiltrados = this.dados;
            this.atualizarCards();
        });

    }

    atualizarCards(event?:any){
        if(event)
            this.dadosFiltrados = event;
        this.layers = this.dadosFiltrados.filter(value => {
            return value.endereco && value.endereco.latitude && value.endereco.longitude;
        }).map(value => {
            return new Marker([value.endereco.latitude, value.endereco.longitude], {
                icon: new DivIcon({
                    html: `<i class="fa ${value.tipo == TipoLocal.EMPRESA ? 'fa-warehouse' : value.tipo == TipoLocal.RESIDENCIA ? 'fa fa-house' : 'fa fa-city'}"></i>`,
                    className: 'local'
                })
            });
        });
    }

    // excluirSelecionados() {
    //
    //     let ref = this.dialogService.open(ConfirmacaoComponent, {
    //         header: "Exclusão múltipla",
    //         width: '50%',
    //         data: {
    //             content: `Deseja excluir os ${this.tableService.selecaoAtual.length} registros selecionados?`
    //         }
    //     });
    //
    //     ref.onClose.subscribe(async (value) => {
    //         if(value){
    //             let promises = [];
    //             this.tableService.selecaoAtual.forEach((entidade) => {
    //                 promises.push(this.http.delete(`${environment.urlBackend}/${this.rest}/${entidade.id}`).toPromise().then(val => {}));
    //             });
    //             await Promise.all(promises);
    //             this.tableService.selecaoAtual = [];
    //             this.filtrar();
    //         }
    //     });
    //
    // }

}
