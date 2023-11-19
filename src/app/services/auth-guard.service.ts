import {Injectable} from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import {UsuarioService} from "./usuario.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {

    constructor(private router: Router, private usuarioService: UsuarioService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        if (this.usuarioService.verificarLogado()) {

            return true;

        }else{

            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

            return false;

        }

    }

}