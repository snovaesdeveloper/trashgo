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
import {environment} from "../../../../environments/environment";
import _ from "lodash";
import Usuario from "../../../classes/Usuario";
import {CadastrarUsuarioComponent} from "../../cadastros/cadastrar-usuario/cadastrar-usuario.component";
import {ActivatedRoute} from "@angular/router";
import {ConfirmacaoComponent} from "../../../features/confirmacao/confirmacao.component";
import {UsuarioService} from "../../../services/usuario.service";
import {Perfil} from "../../../classes/enums/Perfil";

@Component({
    selector: 'app-listar-usuarios',
    templateUrl: './listar-usuarios.component.html',
    styleUrls: ['./listar-usuarios.component.scss'],
    providers: [HttpDataFormatterService, NgxMaskService, UtilService]
})
export class ListarUsuariosComponent implements OnInit {

    rest: string = "usuarios";
    itemsMenu: MenuItem[] = [];
    loading: boolean = false;
    filterFields: string[] = [];
    columns: TableColDefinition[] = [{
        name: 'perfil',
        title: 'Perfil',
        filter: true,
        sort: true,
        display: true,
        filterField: 'perfil',
        export: true,
        filterType: "contains",
    }, {
        name: 'nome',
        title: 'Nome',
        filter: true,
        sort: true,
        display: true,
        filterField: 'nome',
        export: true,
        filterType: "contains",
    },];
    pageSize: number = 500;
    dados: any[] = [];
    dadosFiltrados: any[] = [];

    constructor(private dialogService: DialogService, public tableService: TableService, private http: HttpClient, public httpDataFormatterService: HttpDataFormatterService, public excelService: ExcelService, public pdfService: PdfService, public config: DynamicDialogConfig, private route: ActivatedRoute, private usuarioService: UsuarioService) {

        tableService.selected.subscribe((value: Usuario) => {
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

    openRegister(usuario?: Usuario) {

        let ref = this.dialogService.open(CadastrarUsuarioComponent, {
            header: usuario ? usuario.id ? "Editar" : "Cadastrar" : "Cadastrar", width: '70%', data: {
                entidade: usuario || new Usuario()
            }
        });

        ref.onClose.subscribe(async (entidade: Usuario) => {
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

        this.http.get(`${environment.urlBackend}/${this.rest}`).subscribe((pessoas: Usuario[]) => {
            this.dados = pessoas.map(this.httpDataFormatterService.usuarioFormatter());
            this.dadosFiltrados = this.dados;
        });

    }

    atualizarCards(event?:any){
        if(event)
            this.dadosFiltrados = event;
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
