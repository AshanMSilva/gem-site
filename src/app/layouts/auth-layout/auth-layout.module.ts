import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';

import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'app/pages/login/login.component';
import { ForgotPasswordComponent } from 'app/pages/login/components/forgot-password/forgot-password.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PdfViewComponent } from 'app/pages/pdf-view/pdf-view.component';
import { PdfViewReportComponent } from 'app/pages/pdf-view/pdf-view-report/pdf-view-report.component';
import { PdfViewCardComponent } from 'app/pages/pdf-view/pdf-view-card/pdf-view-card.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    PdfViewerModule,

  ],
  declarations: [

    LoginComponent,
    ForgotPasswordComponent,

    PdfViewComponent,
    PdfViewReportComponent,
    PdfViewCardComponent,
  ]
})
export class AuthLayoutModule { }
