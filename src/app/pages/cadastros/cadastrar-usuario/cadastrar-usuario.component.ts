import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../../services/util.service";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxMaskService} from "ngx-mask";
import Usuario from "../../../classes/Usuario";
import {Perfil} from "../../../classes/enums/Perfil";
import {CadastrarEnderecoComponent} from "../cadastrar-endereco/cadastrar-endereco.component";
import {UsuarioService} from "../../../services/usuario.service";

@Component({
    selector: 'app-cadastrar-usuario',
    templateUrl: './cadastrar-usuario.component.html',
    styleUrls: ['./cadastrar-usuario.component.scss'],
    providers: [NgxMaskService, UtilService]
})
export class CadastrarUsuarioComponent implements OnInit {

    usuario: Usuario;
    form: UntypedFormGroup = this.formBuilder.group({});
    PerfilPessoa = Perfil;

    constructor(private formBuilder: UntypedFormBuilder, private utilService: UtilService, private ref: DynamicDialogRef, public config: DynamicDialogConfig, private http: HttpClient, public router: Router, private route: ActivatedRoute, private dialogService: DialogService, public usuarioService: UsuarioService) {
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            id: [this.config.data?.entidade?.id ?? null],
            user: [this.config.data?.entidade?.user ?? null],
            perfil: [this.config.data?.entidade?.perfil ?? Perfil.CLIENTE],
            nome: [this.config.data?.entidade?.nome ?? null, [
                Validators.required,
            ]],
        });

    }

    salvar() {
        if(this.form.valid){
            let dados: Usuario = this.form.getRawValue();
            this.ref.close(dados);
        }else{
            this.form.markAllAsTouched();
        }
    }

    cancelar() {
        this.ref.close(null);
    }

}
