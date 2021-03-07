import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { ToastrService } from 'ngx-toastr';
import { PDFDocumentProxy, PDFProgressData } from 'pdfjs-dist';
@Component({
  selector: 'app-pdf-view-report',
  templateUrl: './pdf-view-report.component.html',
  styleUrls: ['./pdf-view-report.component.css']
})
export class PdfViewReportComponent implements OnInit {

  sgtlReportNumber: string
  downloadURL: string

  loadPercentage: number

  constructor(
    private gemDetailService: GemDetailService,
    private router: Router,
    private acivatedRoute: ActivatedRoute,
    private toasterService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sgtlReportNumber = this.acivatedRoute.snapshot.paramMap.get('id');
    const filePath = "viewpdf/report/" + this.sgtlReportNumber + ".pdf"
    this.gemDetailService.getFiles(filePath).subscribe(res => {
      if (res) {
        this.downloadURL = res
      }
    }, (e) => {
      console.log(e);
    })
  }

  onProgress(progressData: PDFProgressData) {
    this.loadPercentage = (Number(progressData.loaded) * 100) / Number(progressData.total)
    // do anything with progress data. For example progress indicator
  }

  onLoad(pdf: PDFDocumentProxy) {
    this.loadPercentage = null
    // do anything with "pdf"
  }
}
