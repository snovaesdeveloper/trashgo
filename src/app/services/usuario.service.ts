import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DadosNavegador} from "./dados-navegador.service";
import {Router} from "@angular/router";
import Usuario from "../classes/Usuario";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService{

    changed: EventEmitter<boolean> = new EventEmitter<boolean>();
    token: string;
    usuario: Usuario;

    constructor(private http: HttpClient, private dadosNavegador: DadosNavegador, private router: Router) {
        this.token = dadosNavegador.get("token");
        this.usuario = dadosNavegador.get("usuario") && dadosNavegador.get("usuario") != "null" && dadosNavegador.get("usuario") != "undefined" ? JSON.parse(dadosNavegador.get("usuario")) : null;
    }

    verificarLogado(){
        return !(this.token == null || this.token == 'null' || this.token == undefined);
    }

    deslogar(){
        this.token = null;
        this.dadosNavegador.set("token", null);
        this.usuario = null;
        this.dadosNavegador.set("usuario", null);
        this.router.navigateByUrl("/login");
    }

    setToken(idToken: string) {
        this.token = idToken;
        this.dadosNavegador.set("token", idToken);
        this.emitChange();
    }

    setUsuario(usuario: Usuario) {
        this.usuario = usuario;
        this.dadosNavegador.set("usuario", JSON.stringify(usuario));
        this.emitChange();
    }

    emitChange(){
        this.changed.emit(true);
    }

}
