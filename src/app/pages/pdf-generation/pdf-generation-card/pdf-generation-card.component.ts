import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { IMAGES } from 'app/shared/utils/image-type-const';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';


import * as QRCode from 'qrcode';
import { Subject, Subscription } from 'rxjs';
import { jsPDF } from "jspdf";
import { MediaCompletionContext } from 'app/shared/models/media-completion';
import { GemDetail } from 'app/shared/models/gem-detail';
import { CardContext } from 'app/shared/models/contextDTOs';
@Component({
  selector: 'app-pdf-generation-card',
  templateUrl: './pdf-generation-card.component.html',
  styleUrls: ['./pdf-generation-card.component.css']
})
export class PdfGenerationCardComponent implements OnInit {


  gemDetailIdToGenCard: string
  gemDetailToGenCard: GemDetail

  imageSubject: Subject<{ image: IMAGES }> = new Subject()

  gemImageURL: string
  gemImgSubscription: Subscription

  qrImage: any

  mediaCompletionContext: MediaCompletionContext = new MediaCompletionContext();
  cardContext: CardContext

  constructor(
    private gemDetailService: GemDetailService,
    private toasterService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.gemDetailService.getSelectedGemDetailIdForView()) {
      this.mediaCompletionContext = new MediaCompletionContext();

      this.gemDetailIdToGenCard = this.gemDetailService.getSelectedGemDetailIdForView()
      this.gemDetailService.getGemDetailById(this.gemDetailIdToGenCard).subscribe(res => {
        if (res) {
          this.gemDetailToGenCard = res as GemDetail
          this.cardContext = new CardContext(res)
        }
      })

      let filePath = "gems/" + this.gemDetailIdToGenCard + "_gem"
      this.gemImgSubscription = this.gemDetailService.getFiles(filePath).subscribe(res => {
        if (res) {
          console.log(res);
          this.gemImageURL = res
          this.gemImgSubscription.unsubscribe()
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

    let templateImg = document.getElementById("cardtemplateImg") as HTMLImageElement
    templateImg.onload = function () {
      subject.next({ image: IMAGES.TEMPLATE })
    };

    let gemImg = document.getElementById("cardgemImage") as HTMLImageElement
    gemImg.onload = function () {
      subject.next({ image: IMAGES.GEM })
    };

    let signature = document.getElementById("cardsignatureImg") as HTMLImageElement
    signature.onload = function () {
      subject.next({ image: IMAGES.SIGNATURE })
    };

    // let cardCanvas = document.getElementById("cardQRCodeImg") as HTMLCanvasElement;
    // this.qrImage = new Image();
    // this.qrImage.onload = function () {
    //   subject.next({ image: IMAGES.QR })
    // };
    // this.qrImage.crossOrigin = "";
    // this.qrImage.src = cardCanvas.toDataURL("png", 1);
  }

  generateQRCodes() {
    let cardURL = environment.baseURLForQR + "viewpdf/card/" + this.gemDetailIdToGenCard

    let cardCanvas = document.getElementById("cardQRCodeImg") as HTMLCanvasElement;
    let qrcodeCard = QRCode.toCanvas(cardCanvas, cardURL, { errorCorrectionLevel: "quartile" }).then((res) => { }
      , (e) => {
        this.toasterService.error("Card QR Code code could not be generated")
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

  OnClickGenerateCard() {
    if (this.mediaCompletionContext.isAllCompletedExecptQR()) {
      //Length 85mm & width 54mm
      var docHeight = 5.4
      var docWidth = 8.5

      //init Doc
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "cm",
        format: [docHeight, docWidth]
      });

      //template image
      let templateImg = document.getElementById("cardtemplateImg") as HTMLImageElement
      // templateImg.onload = function () {
      //   doc.addImage(templateImg, "jpg", 0, 0, docWidth, docHeight);
      //   subject.next({ image: IMAGES.TEMPLATE })
      // };
      // templateImg.crossOrigin = "";
      // templateImg.src = '/assets/pdf-templates/card_template.jpg';

      //gemImg image
      let gemImg = document.getElementById("cardgemImage") as HTMLImageElement
      // gemImg.onload = function () {
      //   subject.next({ image: IMAGES.GEM })
      // };
      // gemImg.crossOrigin = "";
      //gemImg.src = this.gemImageURL;

      // qrImg image
      let cardCanvas = document.getElementById("cardQRCodeImg") as HTMLCanvasElement;
      let qrImg = new Image();
      let subject = this.imageSubject
      let id = this.gemDetailIdToGenCard
      let service = this.gemDetailService
      let toast = this.toasterService
      qrImg.onload = function () {
        subject.next({ image: IMAGES.QR })
        doc.addImage(qrImg, "png", 7.1, docHeight - 1.1, 0.8, 0.8);
        const blob = doc.output("blob");
        const file = new File([blob], "filename")
        const filePath = "viewpdf/card/" + id
        const result = service.uploadFile(file, filePath + '.pdf');
        result.task.then((res) => {
          console.log("uploaded");
          toast.success("Card PDF uploaded to server")
        }, (e) => { console.log(e); })
        doc.save("alldone.pdf");
      };
      qrImg.crossOrigin = "";
      qrImg.src = cardCanvas.toDataURL("png", 1);

      //signature image
      let signature = document.getElementById("cardsignatureImg") as HTMLImageElement
      // signature.onload = function () {
      //   subject.next({ image: IMAGES.SIGNATURE })
      // };
      // signature.crossOrigin = "";
      // signature.src = '/assets/pdf-templates/signature.png';
      doc.addImage(templateImg, "jpeg", 0, 0, docWidth, docHeight);
      this.addTextInfo(doc)
      doc.addImage(gemImg, "png", 5.68, 2, 1.8, 1.8);
      doc.addImage(signature, "png", 5, docHeight - 1.4, 2, 1);

    } else {
      this.toasterService.warning("All media not loaded Yet")
    }

  }

  addTextInfo(doc: jsPDF) {
    let keyMargin = 1.2
    let valueMargin = 3.7
    var spacing = 0.32

    var postion = 2.3

    // Basic
    // doc.setFont("times", "bold")//Courier, Helvetica, Times, courier, helvetica, times
    doc.setFontSize(5)
    this.cardContext.getAllDetailsMap().forEach((value, key) => {
      doc.text(key, keyMargin, postion, { align: "left" });
      doc.text(": " + value, valueMargin - 1, postion, { align: "left" });
      postion += spacing
    })
  }


}
