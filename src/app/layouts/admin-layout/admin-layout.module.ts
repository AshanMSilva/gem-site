import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';

import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { ImageUploaderModule } from 'ngx-image-uploader-next';

import { GemDetailsComponent } from 'app/pages/gem-details/gem-details.component';
import { GemDetailsListComponent } from 'app/pages/gem-details/gem-details-list/gem-details-list.component';
import { GemDetailsNewComponent } from 'app/pages/gem-details/gem-details-new/gem-details-new.component';

import { PdfGenerationCardComponent } from 'app/pages/pdf-generation/pdf-generation-card/pdf-generation-card.component';
import { PdfGenerationReportComponent } from 'app/pages/pdf-generation/pdf-generation-report/pdf-generation-report.component';
import { PdfGenerationComponent } from 'app/pages/pdf-generation/pdf-generation.component';

import { SearchResultComponent } from 'app/pages/gem-details/search-result/search-result.component';
import { SignaturesComponent } from 'app/pages/signatures/signatures.component';
import { SignaturesListComponent } from 'app/pages/signatures/signatures-list/signatures-list.component';
import { SignaturesNewComponent } from 'app/pages/signatures/signatures-new/signatures-new.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
;
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    ImageUploaderModule,

    MatDatepickerModule,
    MatNativeDateModule, 

    
  ],
  declarations: [
   
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
 
    MapsComponent,
    NotificationsComponent,
   
    PdfGenerationComponent,
    PdfGenerationCardComponent,
    PdfGenerationReportComponent,

    SearchResultComponent,
    
    GemDetailsComponent,
    GemDetailsListComponent,
    GemDetailsNewComponent,

    SignaturesComponent,
    SignaturesListComponent,
    SignaturesNewComponent,
    
  ]
})

export class AdminLayoutModule {}
