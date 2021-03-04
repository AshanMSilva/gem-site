import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-report-type',
  templateUrl: './select-report-type.component.html',
  styleUrls: ['./select-report-type.component.css']
})
export class SelectReportTypeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  goToNewGemReport(type:string){
    this.router.navigateByUrl(`gem-report/new/${type}`);
  }

}
