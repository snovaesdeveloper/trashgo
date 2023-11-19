import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import * as moment from "moment";
import {Chart} from "chart.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
    menuMode = 'sidebar';

    darkMode = 'light';

    topbarTheme = 'light';

    menuTheme = 'light';

    inputStyle = 'outlined';

    ripple: boolean;

    constructor(private primengConfig: PrimeNGConfig) {

        moment.locale("pt-BR");

    }

    translate() {
        this.primengConfig.setTranslation(
            {
                "dayNames": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
                "dayNamesShort": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                "dayNamesMin": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                "monthNames": ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
                "monthNamesShort": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                "today": "Hoje",
                "clear": "Limpar",
                "apply": "Aplicar"
            }
        );
    }
}
