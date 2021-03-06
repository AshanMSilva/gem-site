import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { GemDetail } from 'app/shared/models/gem-detail';
import { FormUtil } from 'app/shared/utils/form-utility';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as QRCode from 'qrcode';
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

  constructor(
    private formBuilder: FormBuilder,
    private gemDetailService: GemDetailService,
    private toasterService: ToastrService,
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
    let cardURL = environment.baseURLForQR + "/card/" + this.gemDetailIdToEdit
    let reportURL = environment.baseURLForQR + "/report/" + this.gemDetailIdToEdit
    this.gemDetailsForm = this.formBuilder.group({

      //common
      date: [{ value: today, disabled: true }, Validators.required],   //will get overidden at bind 
      sgtlReportNumber: [{ value: this.gemDetailIdToEdit, disabled: true }, Validators.required],

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
      comments: ['', Validators.required],       //common
      apex: [''],

      // //Gem Image
      gemImageURL: ['', Validators.required],       //common

      // //QR code URLs
      cardQRCodeImageURL: ['', Validators.required],       //common
      reportQRCodeImageURL: ['', Validators.required],       //common

      // //Latest Card,Report Ids filter by sgtlReportNumber and latest revision
      // latestCardId: [''],
      // latestReportId: [''],
    });

    this.gemDetailsForm.valueChanges.subscribe(data => this.onFormChange())
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.gemDetailsForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.gemDetailsForm);
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
      let gemDetailsFormValue = this.gemDetailsForm.getRawValue() as GemDetail;
      this.editGemDetail(gemDetailsFormValue).then((ref) => {
        this.toasterService.info("Proceeding to Report Generation")
      }, (e) => {
        console.log(e);
      })
    } else {
      this.displayValidation();
    }
  }

  onClickGenerateCard() {
    this.setValidatorsForReportFields(false)
    if (this.gemDetailsForm.valid) {
      let gemDetailsFormValue = this.gemDetailsForm.getRawValue() as GemDetail;
      this.editGemDetail(gemDetailsFormValue).then((ref) => {
        this.toasterService.info("Proceeding to Card Generation")
      }, (e) => {
        console.log(e);
      })
    } else {
      this.displayValidation();
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

  }

  proceedToCardGeneration() {

  }

  generateQRCodes() {

    let cardCanvas = document.getElementById("cardQRCode");

    let qrcodeCard = QRCode.toCanvas(cardCanvas, "localhost", { errorCorrectionLevel: "quartile" }).then(() => {

    }, () => {
      this.toasterService.error("Card QR code could not be generated")
    })

    let reportCanvas = document.getElementById("reportQRCode");

    let qrcodeReport = QRCode.toCanvas(reportCanvas, "localhost", { errorCorrectionLevel: "quartile" }).then(() => {

    }, () => {
      this.toasterService.error("reportQR code could not be generated")
    })
  }



}
