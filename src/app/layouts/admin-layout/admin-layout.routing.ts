import { Routes } from '@angular/router';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';

import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { GemDetailsComponent } from 'app/pages/gem-details/gem-details.component';
import { GemDetailsNewComponent } from 'app/pages/gem-details/gem-details-new/gem-details-new.component';
import { PdfGenerationReportComponent } from 'app/pages/pdf-generation/pdf-generation-report/pdf-generation-report.component';
import { PdfGenerationCardComponent } from 'app/pages/pdf-generation/pdf-generation-card/pdf-generation-card.component';

export const AdminLayoutRoutes: Routes = [
    
   
    
    { path: 'gem-details',    component: GemDetailsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
    { path: 'gem-detail/new', component: GemDetailsNewComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
    { path: 'pdf-gen/report', component: PdfGenerationReportComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
    { path: 'pdf-gen/card', component: PdfGenerationCardComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
];
