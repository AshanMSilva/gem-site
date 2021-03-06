import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { GemDetail } from 'app/shared/models/gem-detail';
import { FormUtil } from 'app/shared/utils/form-utility';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

import * as QRCode from 'qrcode';

import { FileQueueObject, ImageUploaderOptions } from 'ngx-image-uploader-next';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gem-details-new',
  templateUrl: './gem-details-new.component.html',
  styleUrls: ['./gem-details-new.component.css']
})
export class GemDetailsNewComponent implements OnInit {
  isRecordSaved: boolean = false

  gemDetailIdToEdit: string //sgtlReportNumber
  gemDetailToEdit: GemDetail

  gemDetailsForm: FormGroup;
  formErrors: Map<string, string> = new Map();
  formValidationMessages: Map<string, Map<string, string>> = new Map();

  gemImageFile: File;
  reportQRImageFile: File;
  cardQRImageFile: File;

  constructor(
    private formBuilder: FormBuilder,
    private gemDetailService: GemDetailService,
    private toasterService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.gemDetailService.getSelectedGemDetailIdForView()) {
      this.gemDetailIdToEdit = this.gemDetailService.getSelectedGemDetailIdForView()
    } else {
      this.gemDetailIdToEdit = new Date().getTime().toString(); //new
      this.isRecordSaved = false
      this.generateQRCodes()
    }
    this.createForm();
    this.gemDetailService.getGemDetailById(this.gemDetailIdToEdit).subscribe(res => {
      this.gemDetailToEdit = res as GemDetail
      this.bindFormData(res)
    })

  }

  createForm() {
    let today = new Date().toLocaleDateString()
    this.gemDetailsForm = this.formBuilder.group({

      //common
      date: [{ value: today, disabled: true }, Validators.required],   //will get overidden at bind 
      sgtlReportNumber: [{ value: this.gemDetailIdToEdit, disabled: true }, Validators.required],
      object: ['', Validators.required],           //common

      //Details of specimen
      weight: ['', Validators.required],           //common
      shapeAndCut: ['', Validators.required],      //common
      transparency: [''],
      dimensions: ['', Validators.required],       //common

      //Tested data
      refractiveIndex: [''],
      specificGravity: [''],
      hardness: [''],
      opticCharacter: [''],
      magnification: [''],

      color: ['', Validators.required],       //common
      species: ['', Validators.required],       //common
      variety: ['', Validators.required],       //common
      comments: ['', [Validators.required,Validators.maxLength(40)]],       //common
      apex: [''],

      // //Gem Image
      gemImageURL: ['', Validators.required],       //common

      // //Latest Card,Report Ids filter by sgtlReportNumber and latest revision
      // latestCardId: [''],
      // latestReportId: [''],
    });

    this.gemDetailsForm.valueChanges.subscribe(data => this.onFormChange())
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.gemDetailsForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.gemDetailsForm);
    this.formValidationMessages.get("comments").set("maxlength","Comments should be less than 40 characters")
  }

  bindFormData(res: GemDetail) {
    if (res) {
      this.isRecordSaved = true;
      this.gemDetailsForm.patchValue(this.gemDetailToEdit)
    }
  }

  onFormChange() {
    this.clearValidationMessages();
  }

  clearValidationMessages() {
    this.formErrors.forEach((value, key, self) => { self.set(key, '') })
  }

  displayValidation() {
    this.formErrors = FormUtil.validateForm(this.gemDetailsForm, this.formErrors, this.formValidationMessages)
  }

  preprocessForm() {
    if (this.gemDetailsForm.valid) {
      this.onFormSubmit();
    } else {
      this.displayValidation();
    }
  }

  onFormSubmit() {
    let gemDetailsFormValue = this.gemDetailsForm.getRawValue() as GemDetail;
    if (this.isRecordSaved) {
      this.editGemDetail(gemDetailsFormValue)
    } else {
      this.saveGemDetail(gemDetailsFormValue)
    }
  }

  editGemDetail(gemDetailsFormValue: GemDetail) {
    return this.gemDetailService.updateGemDetail(this.gemDetailToEdit.sgtlReportNumber, gemDetailsFormValue)
  }

  saveGemDetail(gemDetailsFormValue: GemDetail) {
    this.gemDetailService.setGemDetail(gemDetailsFormValue.sgtlReportNumber, gemDetailsFormValue).then((ref) => {
      this.isRecordSaved = true
    }, (e) => {
      console.log(e);
    })
  }

  onClickGenerateReport() {
    this.setValidatorsForReportFields(true)
    if (this.gemDetailsForm.valid) {
      this.proceedToReportGeneration()
    } else {
      this.displayValidation();
      this.toasterService.warning("Please fill mandatory details for the Report")
    }
  }

  onClickGenerateCard() {
    this.setValidatorsForReportFields(false)
    if (this.gemDetailsForm.valid) {
      this.proceedToCardGeneration()
    } else {
      this.displayValidation();
      this.toasterService.warning("Please fill mandatory details for the Card")
    }
  }

  setValidatorsForReportFields(isValidatingForReport: boolean) {
    let validators = (isValidatingForReport) ? [Validators.required] : []

    this.gemDetailsForm.get("transparency").setValidators(validators)
    this.gemDetailsForm.get("refractiveIndex").setValidators(validators)
    this.gemDetailsForm.get("specificGravity").setValidators(validators)
    this.gemDetailsForm.get("hardness").setValidators(validators)
    this.gemDetailsForm.get("opticCharacter").setValidators(validators)
    this.gemDetailsForm.get("magnification").setValidators(validators)
    this.gemDetailsForm.get("apex").setValidators(validators)

    //updateValueAndValidity
    this.gemDetailsForm.get("transparency").updateValueAndValidity()
    this.gemDetailsForm.get("refractiveIndex").updateValueAndValidity()
    this.gemDetailsForm.get("specificGravity").updateValueAndValidity()
    this.gemDetailsForm.get("hardness").updateValueAndValidity()
    this.gemDetailsForm.get("opticCharacter").updateValueAndValidity()
    this.gemDetailsForm.get("magnification").updateValueAndValidity()
    this.gemDetailsForm.get("apex").updateValueAndValidity()

  }

  proceedToReportGeneration() {
    this.toasterService.info("Proceeding to Report Generation")
    this.gemDetailService.setSelectedGemDetailIdForView(this.gemDetailIdToEdit)
    this.router.navigateByUrl("pdf-gen/report") // create view screen if time is available
  }

  proceedToCardGeneration() {
    this.toasterService.info("Proceeding to Card Generation")
    this.gemDetailService.setSelectedGemDetailIdForView(this.gemDetailIdToEdit)
    this.router.navigateByUrl("pdf-gen/card") // create view screen if time is available
  }

  generateQRCodes() {
    let cardURL = environment.baseURLForQR + "/card/" + this.gemDetailIdToEdit
    let reportURL = environment.baseURLForQR + "/report/" + this.gemDetailIdToEdit

    let cardCanvas = document.getElementById("cardQRCode");
    let qrcodeCard = QRCode.toCanvas(cardCanvas, cardURL, { errorCorrectionLevel: "quartile" }).then((res) => { }
      , (e) => {
        this.toasterService.error("Card QR code could not be generated")
      })

    let reportCanvas = document.getElementById("reportQRCode");
    let qrcodeReport = QRCode.toCanvas(reportCanvas, reportURL, { errorCorrectionLevel: "quartile" }).then((res) => { }
      , (e) => {
        this.toasterService.error("reportQR code could not be generated")
      })
  }


  options: ImageUploaderOptions = {

    uploadUrl: '',
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 1,
    autoUpload: false,
  };

  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type == 'image/png' || file.type == 'image/jpeg') {
        this.gemImageFile = file;
        console.log(this.gemImageFile);
      }
    }

  }


  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type == 'image/png' || file.type == 'image/jpeg') {
        this.gemImageFile = file;
        console.log(this.gemImageFile);
      }

    }
  }

  gemImagePercentage: number
  uploadGemImage() {
    let filePath = this.gemDetailIdToEdit + "_gem"
    let result = this.gemDetailService.uploadFile(this.gemImageFile, filePath)
    result.task.percentageChanges().subscribe(res => {
      if (res) {
        this.gemImagePercentage = (res >= 100) ? null : res;
      }
    })

    result.task.then(res => {
      this.toasterService.success("Gem Stone Image Uploaded")
      this.gemImagePercentage = null
      this.gemDetailService.updateGemDetail(this.gemDetailIdToEdit, { gemImageURL: filePath })
    }, e => {
      this.toasterService.error("Gem Stone Image could not be Uploaded")
      this.gemImagePercentage = null
    })
  }

}
