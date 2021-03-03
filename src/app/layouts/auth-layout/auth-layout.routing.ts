import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from 'app/pages/login/login.component';



const redirectLoggedInToIssues = () => redirectLoggedInTo(['dashboard']);

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent,  canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToIssues }},
];
