import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TokenComponent } from './token/token.component';
import { AuthGuard } from './guards/authguard.service';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'token',
        component: TokenComponent
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: HomeComponent
    }
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
