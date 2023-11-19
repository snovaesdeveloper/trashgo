import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../../services/util.service";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import Endereco from "../../../classes/Endereco";
import {NgxMaskService} from "ngx-mask";

@Component({
    selector: 'app-cadastrar-endereco',
    templateUrl: './cadastrar-endereco.component.html',
    styleUrls: ['./cadastrar-endereco.component.scss'],
    providers: [NgxMaskService, UtilService]
})
export class CadastrarEnderecoComponent implements OnInit {

    form: UntypedFormGroup = this.formBuilder.group({});

    constructor(private formBuilder: UntypedFormBuilder, private utilService: UtilService, private ref: DynamicDialogRef, public config: DynamicDialogConfig, private http: HttpClient, public router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            id: [this.config.data?.entidade?.id ?? null],
            cep: [this.config.data?.entidade?.cep ?? null, [Validators.required]],
            uf: [this.config.data?.entidade?.uf ?? null, [Validators.required]],
            cidade: [this.config.data?.entidade?.cidade ?? null, [Validators.required]],
            bairro: [this.config.data?.entidade?.bairro ?? null, [Validators.required]],
            logradouro: [this.config.data?.entidade?.logradouro ?? null, [Validators.required]],
            numero: [this.config.data?.entidade?.numero ?? null, [Validators.required]],
            complemento: [this.config.data?.entidade?.complemento ?? null],
            latitude: [this.config.data?.entidade?.latitude ?? null],
            longitude: [this.config.data?.entidade?.longitude ?? null],
        });

    }

    salvar() {
        if (this.form.valid) {
            let dados: Endereco = this.form.getRawValue();
            this.ref.close(dados);
        } else {
            this.form.markAllAsTouched();
        }
    }

    cancelar() {
        this.ref.close(null);
    }

    buscaCEP() {
        let cep = this.form.get('cep').value;

        if (cep && cep.length == 8) {

            this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((value: {
                "cep": string,
                "logradouro": string,
                "complemento": string,
                "bairro": string,
                "localidade": string,
                "uf": string,
                "ibge": string,
                "gia": string,
                "ddd": string,
                "siafi": string
            }) => {
                this.form.get('uf').setValue(value.uf);
                this.form.get('cidade').setValue(value.localidade);
                this.form.get('bairro').setValue(value.bairro);
                this.form.get('logradouro').setValue(value.logradouro);
                this.form.get('complemento').setValue(value.complemento);
            }, error => {
                this.form.get('uf').setValue('');
                this.form.get('cidade').setValue('');
                this.form.get('bairro').setValue('');
                this.form.get('logradouro').setValue('');
                this.form.get('complemento').setValue('');
            });

        } else {
            this.form.get('uf').setValue('');
            this.form.get('cidade').setValue('');
            this.form.get('bairro').setValue('');
            this.form.get('logradouro').setValue('');
            this.form.get('complemento').setValue('');
        }
    }
}
