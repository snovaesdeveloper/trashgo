import {Injectable} from '@angular/core';
import * as moment from "moment";
import {NgxMaskService} from "ngx-mask";

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(public ngxMaskService: NgxMaskService) {
    }

    currencyFormat(value?: number) {
        return (value || 0).toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2});
    }

    verificarCPF(value: string) {
        var Soma;
        var Resto;
        Soma = 0;
        if (value == "00000000000") return false;

        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(value.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(value.substring(10, 11))) return false;
        return true;
    }

    validarData(value: any) {
        if(typeof value == "string")
            return moment(value, value?.includes("/") ? 'DD/MM/YYYY' : 'DDMMYYYY', true).isValid();
        else
            return null;
    }

    validarEmail(value: string) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(value);
    }

    verificarCNPJ(value: any) {

        if (!value) {
            return value;
        }
        value = value.replace(/[^\d]+/g, '');
        if (value === '') {
            return false;
        }

        if (value.length !== 14) {
            return false;
        }

        if (value === '00000000000000' ||
            value === '11111111111111' ||
            value === '22222222222222' ||
            value === '33333333333333' ||
            value === '44444444444444' ||
            value === '55555555555555' ||
            value === '66666666666666' ||
            value === '77777777777777' ||
            value === '88888888888888' ||
            value === '99999999999999') {
            return false;
        }

        let size = value.length - 2;
        let cpfNumber = value.substring(0, size);
        const digit = value.substring(size);
        let sum = 0;
        let pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += cpfNumber.charAt(size - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digit.charAt(0), 10)) {
            return false;
        }

        size = size + 1;
        cpfNumber = value.substring(0, size);
        sum = 0;
        pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += cpfNumber.charAt(size - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        return result === parseInt(digit.charAt(1), 10);

    }

    fromIsoToLocalDate(data: string | Date) {
        return moment(data, "YYYY-MM-DD").format("DD/MM/YYYY");
    }

    parseDate(data: string | Date) {
        return moment(data, "YYYY-MM-DD").toDate();
    }

    displayDataFromForm(data: string) {
        return moment(data, "DDMMYYYY").format("DD/MM/YYYY");
    }

    phoneFormat(telefone: string) {
        return this.ngxMaskService.applyMask(telefone, "(00) 0 0000-0000");
    }

    cpfFormat(cpf: string) {
        return this.ngxMaskService.applyMask(cpf, "000.000.000-00");
    }

    cnpjFormat(cnpj: string) {
        return this.ngxMaskService.applyMask(cnpj, "00.000.000/0000-00");
    }

    cepFormat(cep: string) {
        return this.ngxMaskService.applyMask(cep, "00000-000");
    }

    validarHora(hora: string) {
        if(hora?.length == 4){
            return parseInt(hora.substring(0, 2)) < 24 && parseInt(hora.substring(2, 4)) < 60;
        }else{
            return false;
        }
    }
}
