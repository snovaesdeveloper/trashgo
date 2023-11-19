import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UsuarioService} from "../../../services/usuario.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {DeviceDetectorService} from "ngx-device-detector";
import {DialogoComponent} from "../../../features/dialogo/dialogo.component";
import {environment} from "../../../../environments/environment";
import Usuario from "../../../classes/Usuario";
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UtilService} from "../../../services/util.service";
import {NgxMaskService} from "ngx-mask";

@Component({
    selector: 'app-login-usuario',
    templateUrl: './login-usuario.component.html',
    styleUrls: ['./login-usuario.component.scss'],
    providers: [UtilService, NgxMaskService]
})
export class LoginUsuarioComponent implements OnInit {

    form: UntypedFormGroup;

    constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService, private dialogService: DialogService, private deviceDetector: DeviceDetectorService, private ref: DynamicDialogRef, private formBuilder: UntypedFormBuilder, private utilService: UtilService) {
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            username: ['', [
                Validators.required,
            ]],
            password: ['', [
                Validators.required
            ]],
            rememberMe: [true]
        });

    }



    async logar() {

        if(this.form.valid){
            this.http.post(`${environment.urlBackend}/authenticate`, this.form.getRawValue(), {}).toPromise().then(async (response: {
                id_token: string,
                usuario: Usuario
            }) => {
                this.usuarioService.setToken(response.id_token);
                this.usuarioService.setUsuario(response.usuario);
                this.router.navigateByUrl("/");
            }).catch(e => {
                if (e.status == 401) {
                    this.dialogService.open(DialogoComponent, {
                        header: "Erro",
                        width: '50%',
                        data: {
                            content: "Usuário ou senha incorretos."
                        }
                    });
                } else {
                    this.dialogService.open(DialogoComponent, {
                        header: "Erro",
                        width: '50%',
                        data: {
                            content: "Ocorreu um erro inesperado, tente novamente mais tarde."
                        }
                    });
                }
            });
        }else{
            this.form.markAllAsTouched();
        }


    }

}
