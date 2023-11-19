import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxMaskService} from "ngx-mask";
import {UtilService} from "../../../services/util.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import Local from "../../../classes/Local";
import Coleta from "../../../classes/Coleta";
import moment from "moment";
import TableColDefinition from "../../../features/table/table-col-definition";
import {TipoLocal} from "../../../classes/enums/TipoLocal";
import {environment} from "../../../../environments/environment";
import {HttpDataFormatterService} from "../../../services/httpDataFormatter.service";
import {DivIcon, latLng, Marker, tileLayer} from "leaflet";
import {TableService} from "../../../features/table/table-service";
import RelacaoLocalColeta from "../../../classes/RelacaoLocalColeta";
import {StatusColeta} from "../../../classes/enums/StatusColeta";

@Component({
    selector: 'app-cadastrar-coleta',
    templateUrl: './cadastrar-coleta.component.html',
    styleUrls: ['./cadastrar-coleta.component.scss'],
    providers: [NgxMaskService, UtilService, HttpDataFormatterService]
})
export class CadastrarColetaComponent implements OnInit, AfterViewInit{

    form: UntypedFormGroup = this.formBuilder.group({});
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
    dados: any[] = [];
    dadosFiltrados: any[] = [];
    options: any = {
        layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 13,
        center: latLng(-1.4217229, -48.4593428)
    };
    layers = [];
    selecaoAtual: any[] = [];

    constructor(private formBuilder: UntypedFormBuilder, private utilService: UtilService, private ref: DynamicDialogRef, public config: DynamicDialogConfig, private http: HttpClient, public router: Router, private route: ActivatedRoute, private dialogService: DialogService, public httpDataFormatterService: HttpDataFormatterService, private tableService: TableService) {
    }

    ngAfterViewInit(): void {
        this.tableService.selecaoAtual.subscribe(val => {
            this.atualizarCards(val);
        })
        this.tableService.selecaoAtual.emit([]);
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            id: [this.config.data?.entidade?.id ?? null],
            pontosColeta: [this.config.data?.entidade?.pontosColeta ?? null],
            status: [this.config.data?.entidade?.status ?? StatusColeta.PENDENTE],
            data: [this.config.data?.entidade?.data ? moment(this.config.data?.entidade?.data, 'YYYY-MM-DD').format("DDMMYYYY") : null, [
                Validators.required,
            ]],
        });

        this.http.get(`${environment.urlBackend}/locals`).subscribe((locais: Local[]) => {
            this.dados = locais.map(this.httpDataFormatterService.localFormatter());
            this.dadosFiltrados = this.dados;
            if(this.config.data?.entidade?.id){
                this.http.get(`${environment.urlBackend}/relacao-local-coletas`).subscribe((selecoes: RelacaoLocalColeta[]) => {
                    this.atualizarCards(selecoes.map(val => {return val.local}));
                });
            }else{
                this.atualizarCards(null);
            }
        });

    }

    salvar() {
        if(this.form.valid){
            let dados: Coleta = this.form.getRawValue();
            dados.pontosColetas = this.selecaoAtual.map(value => {
                let relacao = new RelacaoLocalColeta();
                relacao.local = value;
                return relacao;
            });
            dados.data = moment(dados.data, "DDMMYYYY").format("YYYY-MM-DD");
            this.ref.close(dados);
        }else{
            this.form.markAllAsTouched();
        }
    }

    cancelar() {
        this.ref.close(null);
    }

    atualizarCards(val: any[]){
        console.log(val);
        this.selecaoAtual = val;
        this.layers = this.dados.filter(value => {
            return value.endereco && value.endereco.latitude && value.endereco.longitude;
        }).map(value => {
            console.log(val?.map(v => {return v.id}), value.id)
            return new Marker([value.endereco.latitude, value.endereco.longitude], {
                alt: value.id,
                icon: new DivIcon({
                    html: `<i class="fa ${value.tipo == TipoLocal.EMPRESA ? 'fa-warehouse' : value.tipo == TipoLocal.RESIDENCIA ? 'fa fa-house' : 'fa fa-city'}"></i>`,
                    className: val?.map(v => {return v.id})?.includes(value.id) ? 'local-selecionado' : 'local',
                })
            });
        });
    }

    protected readonly StatusColeta = StatusColeta;
}
