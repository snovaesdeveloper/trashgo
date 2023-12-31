import {Component} from '@angular/core';
import {MenuService} from './app.menu.service';
import {FilterService, PrimeNGConfig} from 'primeng/api';
import {AppComponent} from './app.component';
import * as moment from "moment";

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    styleUrls: ["./app.main.component.scss"]
})
export class AppMainComponent {

    sidebarStatic: boolean = true;

    sidebarActive = true;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    topbarMenuActive: boolean;

    searchClick = false;

    search = false;

    rightPanelClick: boolean;

    rightPanelActive: boolean;

    configActive: boolean;

    configClick: boolean;

    menuHoverActive = false;

    constructor(private menuService: MenuService, private primengConfig: PrimeNGConfig, public app: AppComponent, private filterService: FilterService) {

        primengConfig.setTranslation({
            "dayNames": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            "dayNamesShort": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            "dayNamesMin": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            "monthNames": ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
            "monthNamesShort": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            "today": "Hoje",
            "clear": "Limpar",
            "apply": "Aplicar"
        });

        filterService.register("custom-date-filter", (value: Date, filter: Date): boolean => {
            if (filter === undefined || filter === null) {
                return true;
            }
            if (value === undefined || value === null) {
                return false;
            }
            return moment(value).isSame(filter, 'day');
        });

    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick && (this.isHorizontal() || this.isSlim())) {
            this.menuService.reset();
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.menuClick) {
            if (this.staticMenuMobileActive) {
                this.staticMenuMobileActive = false;
            }

            this.menuHoverActive = false;
            this.unblockBodyScroll();
        }

        if (!this.searchClick) {
            this.search = false;
        }

        this.searchClick = false;
        this.configClick = false;
        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;
        this.rightPanelActive = false;

        if (this.isMobile()) {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
            if (this.staticMenuMobileActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        if (item.className === 'topbar-item search-item') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }

        event.preventDefault();
    }

    onRightPanelClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;

        this.staticMenuMobileActive = false;

        event.preventDefault();
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    onSidebarClick($event) {
        this.menuClick = true;
    }

    onToggleMenu(event) {
        this.menuClick = true;
        this.sidebarStatic = !this.sidebarStatic;

        event.preventDefault();
    }

    onSidebarMouseOver(event) {
        if (this.app.menuMode === 'sidebar' && !this.sidebarStatic) {
            this.sidebarActive = !this.isMobile();
        }
    }

    onSidebarMouseLeave($event) {
        if (this.app.menuMode === 'sidebar' && !this.sidebarStatic) {
            setTimeout(() => {
                this.sidebarActive = false;
            }, 250);
        }
    }

    isSlim() {
        return this.app.menuMode === 'slim';
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return window.innerWidth <= 991;
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
}
