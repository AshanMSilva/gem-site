import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { IMAGES } from 'app/shared/utils/image-type-const';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';


import * as QRCode from 'qrcode';
import { Observable, Subject, Subscription } from 'rxjs';
import { jsPDF } from "jspdf";
import { MediaCompletionContext } from 'app/shared/models/media-completion';
import { GemDetail } from 'app/shared/models/gem-detail';
import { ReportContext } from 'app/shared/models/contextDTOs';
import { SignatureService } from 'app/services/signature/signature.service';

@Component({
  selector: 'app-pdf-generation-report',
  templateUrl: './pdf-generation-report.component.html',
  styleUrls: ['./pdf-generation-report.component.css']
})
export class PdfGenerationReportComponent implements OnInit {
  gemDetailIdToGenReport: string
  gemDetailToGenReport: GemDetail

  imageSubject: Subject<{ image: IMAGES }> = new Subject()

  gemImageURL: string
  gemImgSubscription: Subscription


  signatureImageURL: string
  signatureImgSubscription: Subscription

  signatureImgNameUsedToSign: string


  qrImage: any

  mediaCompletionContext: MediaCompletionContext = new MediaCompletionContext();
  reporContext: ReportContext

  includeApex: boolean
  includeComment: boolean

  constructor(
    private gemDetailService: GemDetailService,
    private signatureService: SignatureService,
    private toasterService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.includeApex = true
    this.includeComment = true
    if (this.gemDetailService.getSelectedGemDetailIdForView() && this.signatureService.getSelectedSignatureNameToSign()) {
      this.mediaCompletionContext = new MediaCompletionContext();

      this.gemDetailIdToGenReport = this.gemDetailService.getSelectedGemDetailIdForView()
      this.gemDetailService.getGemDetailById(this.gemDetailIdToGenReport).subscribe(res => {
        if (res) {
          this.gemDetailToGenReport = res as GemDetail
          this.reporContext = new ReportContext(res)
        }
      })

      let filePath = "gems/" + this.gemDetailIdToGenReport + "_gem"
      this.gemImgSubscription = this.gemDetailService.getFiles(filePath).subscribe(res => {
        if (res) {
          console.log(res);
          this.gemImageURL = res
          this.gemImgSubscription.unsubscribe()
        }
      })

      this.signatureImgNameUsedToSign = this.signatureService.getSelectedSignatureNameToSign()
      let signFilepath = "signatures/" + this.signatureImgNameUsedToSign + "_sign"
      this.signatureImgSubscription = this.signatureService.getFiles(signFilepath).subscribe(url => {
        if (url) {
          console.log(url)
          this.signatureImageURL = url
          this.signatureImgSubscription.unsubscribe()
        }
      })

      this.generateQRCodes()
      this.setSubscriptionToOnload()
    } else {
      this.router.navigateByUrl("gem-details")
    }
  }

  setSubscriptionToOnload() {
    this.imageSubject.subscribe(res => {
      this.onImageComplete(res.image)
    })

    let subject = this.imageSubject

    let templateImg = document.getElementById("templateImg") as HTMLImageElement
    templateImg.onload = function () {
      subject.next({ image: IMAGES.TEMPLATE })
    };

    let gemImg = document.getElementById("gemImage") as HTMLImageElement
    gemImg.onload = function () {
      subject.next({ image: IMAGES.GEM })
    };

    let signature = document.getElementById("signatureImg") as HTMLImageElement
    signature.onload = function () {
      subject.next({ image: IMAGES.SIGNATURE })
    };

    // let reportCanvas = document.getElementById("reportQRCodeImg") as HTMLCanvasElement;
    // this.qrImage = new Image();
    // this.qrImage.onload = function () {
    //   subject.next({ image: IMAGES.QR })
    // };
    // this.qrImage.crossOrigin = "";
    // this.qrImage.src = reportCanvas.toDataURL("png", 1);
  }

  generateQRCodes() {
    let reportURL = environment.baseURLForQR + "viewpdf/report/" + this.gemDetailIdToGenReport

    let reportCanvas = document.getElementById("reportQRCodeImg") as HTMLCanvasElement;
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
    if (this.mediaCompletionContext.isAllCompletedExecptQR()) {
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
      let templateImg = document.getElementById("templateImg") as HTMLImageElement
      // templateImg.onload = function () {
      //   doc.addImage(templateImg, "jpg", 0, 0, docWidth, docHeight);
      //   subject.next({ image: IMAGES.TEMPLATE })
      // };
      // templateImg.crossOrigin = "";
      // templateImg.src = '/assets/pdf-templates/report_template.jpg';

      //gemImg image
      let gemImg = document.getElementById("gemImage") as HTMLImageElement
      // gemImg.onload = function () {
      //   subject.next({ image: IMAGES.GEM })
      // };
      // gemImg.crossOrigin = "";
      //gemImg.src = this.gemImageURL;

      // qrImg image
      let reportCanvas = document.getElementById("reportQRCodeImg") as HTMLCanvasElement;
      let qrImg = new Image();
      let subject = this.imageSubject
      let id = this.gemDetailIdToGenReport
      let service = this.gemDetailService
      let toast = this.toasterService
      qrImg.onload = function () {
        subject.next({ image: IMAGES.QR })
        doc.addImage(qrImg, "png", 20.775, 15.5, 2, 2);
        const blob = doc.output("blob");
        const file = new File([blob], "filename")
        const filePath = "viewpdf/report/" + id
        const result = service.uploadFile(file, filePath + '.pdf');
        result.task.then((res) => {
          console.log("uploaded");
          toast.success("Report PDF uploaded to server")
        }, (e) => { console.log(e); })
        doc.save(id + "_report.pdf");
      };
      qrImg.crossOrigin = "";
      qrImg.src = reportCanvas.toDataURL("png", 1);

      //signature image
      let signature = document.getElementById("signatureImg") as HTMLImageElement
      // signature.onload = function () {
      //   subject.next({ image: IMAGES.SIGNATURE })
      // };
      // signature.crossOrigin = "";
      // signature.src = '/assets/pdf-templates/signature.png';
      doc.addImage(templateImg, "jpeg", 0, 0, docWidth, docHeight);
      this.addTextInfo(doc)
      doc.addImage(gemImg, "png", 19.275, 5.5, 5, 5);
      doc.addImage(signature, "png", 19.775, 13, 4, 2);

    } else {
      this.toasterService.warning("All media not loaded Yet")
    }

  }

  addTextInfo(doc: jsPDF) {
    let keyMargin = 2.2
    let valueMargin = 7.5
    var spacing = 0.6

    var postion = 4.2

    //Basic
    doc.setFont("times", "bold")//Courier, Helvetica, Times, courier, helvetica, times
    doc.setFontSize(10)
    this.reporContext.getBasicDetialsMap().forEach((value, key) => {
      doc.text(key, keyMargin, postion, { align: "left" });
      doc.text(": " + value, valueMargin - 1, postion, { align: "left" });
      postion += spacing
    })

    var postion = 8.2

    //Specimen
    doc.setFontSize(11)
    doc.setFont("times", "bold")//Courier, Helvetica, Times, courier, helvetica, times
    doc.text("Details of Specimen", keyMargin, postion - spacing, { align: "left" });
    doc.setFont("times", "normal")
    doc.setFontSize(10)
    this.reporContext.getDetailsOfSpecimenMap().forEach((value, key) => {
      doc.text(key, keyMargin, postion, { align: "left" });
      doc.text(": " + value, valueMargin, postion, { align: "left" });
      postion += spacing
    })

    var postion = 13

    //test
    doc.setFontSize(11)
    doc.setFont("times", "bold")
    doc.text("Tested Data", keyMargin, postion - spacing, { align: "left" });
    doc.setFont("times", "normal")
    doc.setFontSize(10)
    this.reporContext.getTestedDataMap().forEach((value, key) => {
      doc.text(key, keyMargin, postion, { align: "left" });
      doc.text(": " + value, valueMargin, postion, { align: "left" });
      postion += spacing
    })

    //Apex
    if (this.reporContext.apex && this.includeApex) {
      doc.text("Apex", keyMargin, postion, { align: "left", maxWidth: 2.5 });
      var splitApexText = doc.splitTextToSize(this.reporContext.apex, 5);
      doc.text(": ", valueMargin, postion, { align: "left" });
      doc.text(splitApexText, valueMargin + 0.2, postion, { align: "justify", maxWidth: 5 });
    }
    //species, variety
    let speciesAndVariety = "Species : " + this.reporContext.species + "  Variety: " + this.reporContext.variety
    doc.text(speciesAndVariety, 21.775, 11.5, { align: "center" });

    //comments
    if (this.includeComment) {
      let comments = "Comments : " + this.reporContext.comments
      doc.text(comments, 21.775, 12, { align: "center" });
    }


    doc.setFontSize(13)
    let gemologistName = this.reporContext.gemologistName
    doc.text(gemologistName, 21.775, 14.95, { align: "center" });
    console.log(doc.getFontList())
  }

  toggleIncludeComment() {
    this.includeComment = !this.includeComment
  }

  toggleIncludeApex() {
    this.includeApex = !this.includeApex
  }
}
