import {Injectable} from "@angular/core";
import {NgxMaskService} from "ngx-mask";
import {UtilService} from "./util.service";
import Usuario from "../classes/Usuario";
import Local from "../classes/Local";
import Coleta from "../classes/Coleta";
import moment from "moment";

@Injectable({
    providedIn: 'root'
})
export class HttpDataFormatterService{

    constructor(private ngxMaskService: NgxMaskService, private utilService: UtilService) {}

    monthToString(month: number){
        switch(month){
            case 0: return "Janeiro";
            case 1: return "Feveiro";
            case 2: return "Março";
            case 3: return "Abril";
            case 4: return "Maio";
            case 5: return "Junho";
            case 6: return "Julho";
            case 7: return "Agosto";
            case 8: return "Setembro";
            case 9: return "Outubro";
            case 10: return "Novembro";
            case 11: return "Dezembro";
        }
    }

    usuarioFormatter() {
        return (usuario: Usuario) => {
            return usuario;
        };
    }

    localFormatter() {
        return (local: Local) => {
            return local;
        };
    }

    coletaFormatter() {
        return (coleta: Coleta) => {
            coleta["dataFormatada"] = coleta.data ? moment(coleta.data).format("DD/MM/YYYY") : null;
            return coleta;
        };
    }
}
