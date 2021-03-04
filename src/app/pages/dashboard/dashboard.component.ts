import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SelectReportTypeComponent } from './components/select-report-type/select-report-type.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    
    private dialog: MatDialog
  ) { }
  ngOnInit() {

  }

  openDialog() {
    const dialogRef = this.dialog.open(SelectReportTypeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
