import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { GemDetail } from 'app/shared/models/gem-detail';

@Component({
  selector: 'app-gem-details-list',
  templateUrl: './gem-details-list.component.html',
  styleUrls: ['./gem-details-list.component.css']
})
export class GemDetailsListComponent implements OnInit {
  limit: number = 10;
  gemDetailsList: GemDetail[]
  firstGemDetailkey: string;
  previousGemDetailkey: string;


  constructor(
    private gemDetailService: GemDetailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.gemDetailService.setSelectedGemDetailIdForView(null)
    this.gemDetailService.getGemDetailsWithPagination(null, this.limit, false).subscribe(response => {
      if (response) {
        this.gemDetailsList = response.reverse();
        if (this.gemDetailsList.length > 0) {
          this.firstGemDetailkey = this.gemDetailsList[0].sgtlReportNumber;
        }
      }
    })

    localStorage.setItem('downloadConfig', JSON.stringify({isAllowed :true}));
  }

  getNextGemDetails(offsetsgtlNumber: string) {
    if (this.gemDetailsList.length == this.limit) {
      this.gemDetailService.getGemDetailsWithPagination(offsetsgtlNumber, this.limit, false).subscribe(response => {
        if (response) {
          this.gemDetailsList = response.reverse();
          if (this.gemDetailsList.length > 0) {
            this.previousGemDetailkey = this.gemDetailsList[0].sgtlReportNumber;
          }

        }
      })
    }
  }

  getPreviousGemDetails(offsetsgtlNumber: string) {
    if (offsetsgtlNumber != this.firstGemDetailkey) {
      this.gemDetailService.getGemDetailsWithPagination(offsetsgtlNumber, this.limit, true).subscribe(response => {
        if (response) {
          this.gemDetailsList = response.reverse();
        }
      })
    }
  }

  onClickGenNewReportItem(gemDetail: GemDetail) {
    this.gemDetailService.setSelectedGemDetailIdForView(gemDetail.sgtlReportNumber)
    this.router.navigateByUrl("gem-detail/new") // create view screen if time is available
  }


}
