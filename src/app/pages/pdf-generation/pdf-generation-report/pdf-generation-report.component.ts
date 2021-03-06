import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { IMAGES } from 'app/shared/utils/image-type-const';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';


import * as QRCode from 'qrcode';
import { Subject } from 'rxjs';
import { jsPDF } from "jspdf";
import { MediaCompletionContext } from 'app/shared/models/media-completion';
import { GemDetail } from 'app/shared/models/gem-detail';
import { ReportContext } from 'app/shared/models/contextDTOs';

@Component({
  selector: 'app-pdf-generation-report',
  templateUrl: './pdf-generation-report.component.html',
  styleUrls: ['./pdf-generation-report.component.css']
})
export class PdfGenerationReportComponent implements OnInit {
  gemDetailIdToGenReport: string
  gemDetailToGenReport: GemDetail

  imageSubject: Subject<{ image: IMAGES }> = new Subject()

  mediaCompletionContext: MediaCompletionContext = new MediaCompletionContext();
  reporContext: ReportContext

  constructor(
    private gemDetailService: GemDetailService,
    private toasterService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.mediaCompletionContext = new MediaCompletionContext();
    if (this.gemDetailService.getSelectedGemDetailIdForView() || true) {/////////////////////////
      this.gemDetailIdToGenReport = "1614970781510"// this.gemDetailService.getSelectedGemDetailIdForView()
      this.gemDetailService.getGemDetailById(this.gemDetailIdToGenReport).subscribe(res => {
        if (res) {
          this.gemDetailToGenReport = res as GemDetail
          this.reporContext = new ReportContext(res)
        }
      })
    } else {
      //this.router.navigateByUrl("gem-details")
    }
    this.generateQRCodes()
  }

  generateQRCodes() {
    let reportURL = environment.baseURLForQR + "/report/" + this.gemDetailIdToGenReport

    let reportCanvas = document.getElementById("reportQRCodeImg");
    let qrcodeReport = QRCode.toCanvas(reportCanvas, reportURL, { errorCorrectionLevel: "quartile" }).then((res) => { }
      , (e) => {
        this.toasterService.error("reportQR code could not be generated")
      })
  }

  onImageComplete(image: IMAGES) {
    if (image == IMAGES.TEMPLATE) {
      this.mediaCompletionContext.isTemplateImageComplete = true
    }
    if (image == IMAGES.GEM) {
      this.mediaCompletionContext.isGemImageComplete = true
    }
    if (image == IMAGES.QR) {
      this.mediaCompletionContext.isQRImageComplete = true
    }
    if (image == IMAGES.SIGNATURE) {
      this.mediaCompletionContext.isSignatureImageComplete = true
    }
  }

  OnClickGenerateReport() {
    //subjet to image onload completion
    this.imageSubject.subscribe(res => {
      if (res.image) {
        this.onImageComplete(res.image)
        if (this.mediaCompletionContext.isAllCompleted()) {          // TODO
          doc.addImage(gemImg, "png", 19.275, 5.5, 5, 5);
          doc.addImage(signature, "png", 19.775, 13, 4, 2);
          doc.addImage(qrImg, "png", 20.775, 15.5, 2, 2);
          doc.save("alldone.pdf");
        }
        if (res.image == IMAGES.TEMPLATE) {

          let keyMargin = 2.2
          let valueMargin = 7.5
          var spacing = 0.6

          var postion = 4.2
          doc.setFontSize(10)

          //Basic
          this.reporContext.getBasicDetialsMap().forEach((value, key) => {
            doc.text(key, keyMargin, postion, { align: "left" });
            doc.text(": " + value, valueMargin - 1, postion, { align: "left" });
            postion += spacing
          })

          var postion = 8.2
          doc.setFontSize(10)

          //Specimen
          this.reporContext.getDetailsOfSpecimenMap().forEach((value, key) => {
            doc.text(key, keyMargin, postion, { align: "left" });
            doc.text(": " + value, valueMargin, postion, { align: "left" });
            postion += spacing
          })

          var postion = 13
          doc.setFontSize(10)

          //test
          this.reporContext.getTestedDataMap().forEach((value, key) => {
            doc.text(key, keyMargin, postion, { align: "left" });
            doc.text(": " + value, valueMargin, postion, { align: "left" });
            postion += spacing
          })

          //Apex
          if (this.reporContext.apex) {
            doc.text("Apex", keyMargin, postion, { align: "left" });
            doc.text(": " + this.reporContext.apex, valueMargin, postion, { align: "left" });
          }
          //species, variety
          let speciesAndVariety = "Species : " + this.reporContext.species + "  Variety: " + this.reporContext.variety
          doc.text(speciesAndVariety, 22.275, 11.5, { align: "center" });
          let comments = "Comments : " + this.reporContext.comments
          doc.text(comments, 22.275, 12, { align: "center" });

        }
      }
    })

    let subject = this.imageSubject

    //A4 210 x 297 
    var docHeight = 21
    var docWidth = 29.7

    //init Doc
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [docHeight, docWidth]
    });

    //template image
    let templateImg = new Image();
    templateImg.onload = function () {
      doc.addImage(templateImg, "jpeg", 0, 0, docWidth, docHeight);
      subject.next({ image: IMAGES.TEMPLATE })
    };

    templateImg.crossOrigin = "";
    templateImg.src = '/assets/pdf-templates/report_template.jpeg';


    //gemImg image
    let gemImg = new Image();
    gemImg.onload = function () {
      subject.next({ image: IMAGES.GEM })
    };
    gemImg.crossOrigin = "";
    gemImg.src = '/assets/pdf-templates/gem.png';

    //qrImg image
    let qrImg = new Image();
    qrImg.onload = function () {
      subject.next({ image: IMAGES.QR })
    };
    qrImg.crossOrigin = "";
    qrImg.src = '/assets/pdf-templates/gem.png';

    //signature image
    let signature = new Image();
    signature.onload = function () {
      subject.next({ image: IMAGES.SIGNATURE })
    };
    signature.crossOrigin = "";
    signature.src = '/assets/pdf-templates/signature.png';

  }


}
