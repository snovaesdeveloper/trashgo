import firebase from "firebase";
import { v4 as uuidv4 } from 'uuid';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {UsuarioService} from "./usuario.service";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export default class UploadService {

    constructor(private http: HttpClient, private usuarioService: UsuarioService) {
    }

    async uploadFile(folder, file: File){

        let uuid = uuidv4();
        let formData:FormData = new FormData();
        formData.append("file", file, uuid + "." + file.name.split(".")[file.name.split(".").length - 1]);
        formData.append("folder", folder);
        return await this.http.post(`${environment.urlBackend}/upload`, formData).toPromise().then((value:any) => {
            return value.url;
        }).catch(error => {
            return error;
        });

    }

}
