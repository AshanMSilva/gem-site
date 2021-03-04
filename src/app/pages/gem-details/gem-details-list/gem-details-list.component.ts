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

  gemDetailsList: GemDetail[]

  constructor(
    private gemDetailService: GemDetailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.gemDetailService.setSelectedGemDetailForView(null)
    this.gemDetailService.getGemDetails().subscribe(response => {
      if (response) {
        this.gemDetailsList = response
      }
    })
  }

  onClickViewItem(gemDetail: GemDetail) {
    this.gemDetailService.setSelectedGemDetailForView(gemDetail)
    this.router.navigateByUrl("gem-detail/new") // create view screen if time is available
  }


}
