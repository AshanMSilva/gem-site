import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { GemDetail } from 'app/shared/models/gem-detail';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  d: string;
  m: string;
  y: string;
  query: string;
  gemDetailsList: GemDetail[]



  constructor(
    private gemDetailService: GemDetailService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.gemDetailService.setSelectedGemDetailIdForView(null);
    this.query = this.route.snapshot.paramMap.get('query');
    if (this.query == null) {
      this.d = this.route.snapshot.paramMap.get('d');
      this.m = this.route.snapshot.paramMap.get('m');
      this.y = this.route.snapshot.paramMap.get('y');
      this.query = new Date(new Date(`${this.y}-${this.m}-${this.d}`).setHours(0, 0, 0, 0)).toISOString()
    }
    this.gemDetailService.getSearchGemDetailsBySGTL(this.query).subscribe(response => {
      if (response) {
        if (response.length > 0) {
          this.gemDetailsList = response;
        }
        else {
          this.gemDetailService.getSearchGemDetailsByDate(this.query).subscribe(response => {
            if (response) {
              if (response.length > 0) {
                this.gemDetailsList = response;
              }
              else {
                this.gemDetailService.getSearchGemDetailsByObject(this.query).subscribe(response => {
                  if (response) {

                    this.gemDetailsList = response;

                  }
                })
              }


            }
          })
        }


      }
    })
  }

  onClickGenNewReportItem(gemDetail: GemDetail) {
    this.gemDetailService.setSelectedGemDetailIdForView(gemDetail.sgtlReportNumber)
    this.router.navigateByUrl("gem-detail/new") // create view screen if time is available
  }

  goBack() {
    this.router.navigateByUrl("gem-details")
  }
}
