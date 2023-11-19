import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './services/auth-guard.service';
import {LoginUsuarioComponent} from "./pages/outros/login-usuario/login-usuario.component";
import { ListarUsuariosComponent } from './pages/listagens/listar-usuarios/listar-usuarios.component';
import {AppMainComponent} from "./app.main.component";
import {HomePageComponent} from "./pages/outros/home-page/home-page.component";
import {ListarLocaisComponent} from "./pages/listagens/listar-locais/listar-locais.component";
import {ListarColetasComponent} from "./pages/listagens/listar-coletas/listar-coletas.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
                {
                    path: '', component: AppMainComponent,
                    children: [
                        {path: '', redirectTo: 'inicio', pathMatch: 'full'},
                        {path: 'inicio', component: HomePageComponent},
                        {path: 'usuarios', component: ListarUsuariosComponent},
                        {path: 'locais', component: ListarLocaisComponent},
                        {path: 'coletas', component: ListarColetasComponent},
                    ],
                    canActivate: [AuthGuard]
                },
                {path: 'login', component: LoginUsuarioComponent},
            ],
            {useHash: false, onSameUrlNavigation: 'reload', enableTracing: false, scrollPositionRestoration: 'top'}
        )
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
