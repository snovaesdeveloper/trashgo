import {Component, Inject, Renderer2} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {UsuarioService} from "./services/usuario.service";
import {AppComponent} from "./app.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DadosNavegador} from "./services/dados-navegador.service";
import {DOCUMENT} from "@angular/common";
import {MenuItem} from "primeng/api";
import {Perfil} from "./classes/enums/Perfil";

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss'],
})
export class AppMenuComponent{

    items: MenuItem[] = [];

    constructor(public app: AppComponent, public appMain: AppMainComponent, public router: Router, private dadosNavegador: DadosNavegador, private currentRoute: ActivatedRoute, @Inject(DOCUMENT) private document, private _renderer2: Renderer2, public usuarioService: UsuarioService) {
    }

    ngOnInit() {

        this.atualizarMenu();

        this.usuarioService.changed.subscribe((value) => {
            this.atualizarMenu();
        });

    }

    atualizarMenu(){

        this.items = [
            {
                label: 'Início',
                routerLink: '/',
                icon: 'fas fa-home',
                visible: true
            },
            {
                label: 'Coletas',
                icon: 'fas fa-trash-can-arrow-up',
                routerLink: '/coletas',
                visible: true
            },
            {
                label: 'Locais',
                icon: 'fas fa-building',
                routerLink: '/locais',
                visible: true
            },
            {
                label: 'Usuários',
                icon: 'fas fa-user',
                routerLink: '/usuarios',
                visible: true
            },
            {
                label: 'Deslogar',
                icon: 'fas fa-right-from-bracket',
                visible: true,
                command: (event) => {
                    this.usuarioService.deslogar();
                }
            },
        ];

    }

}
