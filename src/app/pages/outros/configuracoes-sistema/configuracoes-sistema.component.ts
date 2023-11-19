import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DialogService} from "primeng/dynamicdialog";
import {DialogoComponent} from "../../../features/dialogo/dialogo.component";

@Component({
    selector: 'app-configuracoes-sistema',
    templateUrl: './configuracoes-sistema.component.html',
    styleUrls: ['./configuracoes-sistema.component.scss']
})
export class ConfiguracoesSistemaComponent implements OnInit {

    constructor(private http: HttpClient, private dialogService: DialogService) {
    }

    ngOnInit(): void {
    }

    importarProgramacoesMesAnterior() {

        this.http.get(`${environment.urlBackend}/programacaos/importar-mes-anterior`).subscribe(value => {
            this.dialogService.open(DialogoComponent, {
                header: 'Sucesso',
                width: '50%',
                data: {
                    content: "Importação realizada com sucesso."
                }
            });
        });

    }

}
