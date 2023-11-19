import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpSentEvent
} from "@angular/common/http";
import {UsuarioService} from "./usuario.service";
import {Observable, throwError} from "rxjs";
import {catchError, finalize, map, mergeMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {TableService} from "../features/table/table-service";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {LoadingService} from "./loadingService";
import {DialogService} from "primeng/dynamicdialog";
import {DialogoComponent} from "../features/dialogo/dialogo.component";

@Injectable({
    providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private usuarioService: UsuarioService, private router: Router, private tableService: TableService, private loadingService: LoadingService, private dialogService: DialogService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.loadingService.addLoading();

        const token = this.usuarioService.token;

        if (token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}`}
            });
        }

        if(request.method == "PATCH"){
            request = request.clone({
                setHeaders: { 'Content-Type': `application/merge-patch+json`}
            });
        }

        return next.handle(request).pipe(
            map(value => {
                return value;
            }),
            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.router.navigateByUrl("/admin");
                    }
                }
                if(err?.error?.mensagem){
                    this.dialogService.open(DialogoComponent, {
                        header: "Erro",
                        width: "40%",
                        data: {
                            content: err?.error?.mensagem
                        },
                        baseZIndex: 999999
                    })
                }
                return throwError(err);
            }),
            finalize(() => {
                this.loadingService.decreaseLoading();
            })
        );

    }
}
