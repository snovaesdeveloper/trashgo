import * as _ from 'lodash';
import * as camelCase from 'camelcase';
import {isObject} from "lodash";

export class Util {

    static toCaptalize(texto:string){
        return texto.charAt(0).toUpperCase() + texto.substr(1);
    }

    static toJSON(object:any){
        let json = {};
        let keys = Object.keys(object);
        for(let key of keys){
            // @ts-ignore
            json[key] = object[key];
        }
        return json;
    }

    static formatarData(data:Date | string){
        try{
            if(data != null){
                return new Date(data).toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: "America/Sao_Paulo"
                });
            }
        }catch(e){
            return null;
        }
    }

    static sortObject(o) {
        var sorted : any = {},
            key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    }

    static formatarDataHora(data:Date | string){
        try{
            if(data != null){
                return new Date(data).toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'long',
                    timeZone: "America/Sao_Paulo"
                });
            }
        }catch(e){
            return null;
        }
    }

    static formatarValoresMonetarios(valor: number) {

        return valor.toLocaleString('pt-BR', {
            style: "currency",
            currency: "BRL",
            useGrouping: true,
            minimumFractionDigits: 2
        });

    }

    static validarCPF(strCPF) {
        var Soma;
        var Resto;
        Soma = 0;
        if (strCPF == "00000000000") return false;

        for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
        return true;
    }

    static validarCNPJ(cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g,'');

        if(cnpj == '') return false;

        if (cnpj.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;

        return true;

    }

    static fullJsonParse(objectParse: any) {

        let atributosNaoConverter = ['tax', 'cpf', 'cnpj', 'valor', 'quantidade', 'cpfCnpj', 'pix', 'conta', 'agencia', 'macho', 'femea', 'indiferente'];

        for(let object of objectParse){

            _.forEach(object, (value, key) => {

                try {
                    object[key] = JSON.parse(object[key]);
                } catch (e) {
                }

                if(!isNaN(object[key]) && !isNaN(parseFloat(object[key])) && !atributosNaoConverter.includes(key)){
                    object[key] = parseInt(object[key]);
                }

                object[camelCase(key)] = object[key];

                key = camelCase(key);

                if(object[key]?.id){

                    _.forEach(object[key], (value2, key2) => {

                        try {
                            object[key][key2] = JSON.parse(object[key][key2]);
                        } catch (e) {
                        }

                        if(!isNaN(object[key][key2]) && !isNaN(parseFloat(object[key][key2])) && !atributosNaoConverter.includes(key2)){
                            object[key][key2] = parseInt(object[key][key2]);
                        }

                        object[key][camelCase(key2)] = object[key][key2];

                    });

                }

            });

        }

        return objectParse;

    }

    static formatarTexto(texto) :string{
        return texto?.replace(/_/g, ' ');
    }

    static formatarKeys(json: any){
        _.forIn(json, function(value, key) {
            json[_.camelCase(key)] = value;
            if(isObject(value)){
                _.forIn(json[key], function(subValue, subKey) {
                    json[_.camelCase(key)][_.camelCase(subKey)] = subValue;
                });
            }
        });
        return json;
    }

}
