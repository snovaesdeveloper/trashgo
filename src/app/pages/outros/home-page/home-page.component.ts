import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import * as moment from "moment";
import {UsuarioService} from "../../../services/usuario.service";

@Component({
    selector: 'app-home-page', templateUrl: './home-page.component.html', styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    constructor(private http: HttpClient, private usuarioService: UsuarioService) {
    }

    ngOnInit(): void {

    }

}
