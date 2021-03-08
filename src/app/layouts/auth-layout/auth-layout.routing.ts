import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from 'app/pages/login/login.component';
import { PdfViewCardComponent } from 'app/pages/pdf-view/pdf-view-card/pdf-view-card.component';
import { PdfViewReportComponent } from 'app/pages/pdf-view/pdf-view-report/pdf-view-report.component';



const redirectLoggedInToIssues = () => redirectLoggedInTo(['dashboard']);

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToIssues } },
    { path: 'viewpdf/report/:id', component: PdfViewReportComponent, canActivate: [], data: {} },
    { path: 'viewpdf/card/:id', component: PdfViewCardComponent, canActivate: [], data: {} },
];
