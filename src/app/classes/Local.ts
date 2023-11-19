import Endereco from "./Endereco";
import {TipoLocal} from "./enums/TipoLocal";

export default class Local{
    id: number;
    nome: string;
    endereco: Endereco;
    tipo: TipoLocal;
}
