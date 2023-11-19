import {Component, OnInit} from '@angular/core';
import {NgxMaskService} from "ngx-mask";
import {UtilService} from "../../../services/util.service";
import Local from "../../../classes/Local";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Perfil} from "../../../classes/enums/Perfil";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CadastrarEnderecoComponent} from "../cadastrar-endereco/cadastrar-endereco.component";
import {TipoLocal} from "../../../classes/enums/TipoLocal";

@Component({
    selector: 'app-cadastrar-local',
    templateUrl: './cadastrar-local.component.html',
    styleUrls: ['./cadastrar-local.component.scss'],
    providers: [NgxMaskService, UtilService]
})
export class CadastrarLocalComponent implements OnInit {

    form: UntypedFormGroup = this.formBuilder.group({});

    constructor(private formBuilder: UntypedFormBuilder, private utilService: UtilService, private ref: DynamicDialogRef, public config: DynamicDialogConfig, private http: HttpClient, public router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            id: [this.config.data?.entidade?.id ?? null],
            endereco: [this.config.data?.entidade?.endereco ?? null],
            tipo: [this.config.data?.entidade?.tipo ?? TipoLocal.CONDOMINIO],
            nome: [this.config.data?.entidade?.nome ?? null, [
                Validators.required,
            ]],
        });

    }

    salvar() {
        if(this.form.valid){
            let dados: Local = this.form.getRawValue();
            this.ref.close(dados);
        }else{
            this.form.markAllAsTouched();
        }
    }

    cancelar() {
        this.ref.close(null);
    }

    cadastrarEndereco() {
        let ref = this.dialogService.open(CadastrarEnderecoComponent, {
            width: '60%',
            header: "Cadastrar Endereço",
            data: {
                entidade: this.form.get("endereco").value
            }
        });

        ref.onClose.subscribe(value => {
            if(value){
                this.form.get("endereco").setValue(value);
            }
        });

    }

    protected readonly TipoLocal = TipoLocal;
}
