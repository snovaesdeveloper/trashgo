import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {MenuItem} from 'primeng/api';
import {UsuarioService} from "./services/usuario.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DadosNavegador} from "./services/dados-navegador.service";
import {DOCUMENT} from "@angular/common";
import {LoadingService} from "./services/loadingService";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit {

    items: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'fas fa-dashboard',
            routerLink: '/dashboard'
        },
        {
            label: 'Serviços',
            icon: 'fas fa-bars-progress',
            items: [
                {
                    label: 'Programação',
                    icon: 'fas fa-list-check',
                    routerLink: '/programacao'
                },
                {
                    label: 'Distribuição de Serviços',
                    icon: 'fas fa-users-viewfinder'
                },
                {
                    label: 'Licenças',
                    icon: 'fas fa-file-lines'
                },
                {
                    label: 'Protocolos',
                    icon: 'fas fa-ruler'
                },
                {
                    label: 'Projetos',
                    icon: 'fas fa-diagram-project'
                },
                {
                    label: 'Taxas',
                    icon: 'fas fa-receipt'
                },
                {
                    label: 'Processos',
                    icon: 'fas fa-briefcase'
                },
            ],
        },
        {
            label: 'Configurações',
            icon: 'fas fa-cog',
            items: [
                {
                    label: 'Empresas',
                    icon: 'fas fa-building',
                    routerLink: '/empresas'
                },
                {
                    label: 'Serviços',
                    icon: 'fas fa-memo-pad',
                    routerLink: '/servicos'
                },
                {
                    label: 'Tipo de Origens',
                    icon: 'fas fa-text',
                    routerLink: '/tipo-origens'
                },
                {
                    label: 'Tipo de Planos',
                    icon: 'fas fa-text',
                    routerLink: '/tipo-planos'
                },
                {
                    label: 'Usuários',
                    icon: 'fas fa-user',
                    routerLink: '/usuarios'
                }
            ]
        },
        {
            label: 'Deslogar',
            icon: 'fas fa-right-from-bracket',
            command: (event) => {
                this.usuarioService.deslogar();
            }
        },
    ];

    constructor(public app: AppComponent, public appMain: AppMainComponent, public router: Router, private dadosNavegador: DadosNavegador, private currentRoute: ActivatedRoute, @Inject(DOCUMENT) private document, private _renderer2: Renderer2, public usuarioService: UsuarioService, public loadingService: LoadingService) {
    }

    ngOnInit() {

    }

}
