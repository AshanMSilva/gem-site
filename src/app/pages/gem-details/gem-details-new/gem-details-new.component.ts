import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { GemDetail } from 'app/shared/models/gem-detail';
import { FormUtil } from 'app/shared/utils/form-utility';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gem-details-new',
  templateUrl: './gem-details-new.component.html',
  styleUrls: ['./gem-details-new.component.css']
})
export class GemDetailsNewComponent implements OnInit {
  isRecordSaved: boolean = false

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
    this.gemDetailToEdit = this.gemDetailService.getSelectedGemDetailForView();
    this.createForm();
    this.bindFormData();
  }

  createForm() {
    let today = new Date().toLocaleDateString()
    let todayTime = new Date().getTime()
    this.gemDetailsForm = this.formBuilder.group({

      //common
      date: [{ value: today, disabled: true }, Validators.required],   //will get overidden at bind 
      sgtlReportNumber: [{ value: todayTime, disabled: true }, Validators.required],

      //Details of specimen
      weight: ['', Validators.required],           //common
      shapeAndCut: ['', Validators.required],      //common
      transparency: [''],
      dimensions: ['', Validators.required],       //common

      //Tested data
      refractiveIndex: [''],
      specifyGravity: [''],
      hardness: [''],
      opticCharacter: [''],
      magnification: [''],

      color: ['', Validators.required],       //common
      species: ['', Validators.required],       //common
      variety: ['', Validators.required],       //common
      comments: ['', Validators.required],       //common
      apex: [''],

      // //Gem Imag
      // gemImageURL: "string",

      // //LatestReportLink for QR
      // qrCodePdfLink: "string",
      // qrCodeImageURL: "string",

      // //Latest Card,Report Ids filter by sgtlReportNo and latest revision
      // latestCardId: "string",
      // latestReportId: "string",
    });

    this.gemDetailsForm.valueChanges.subscribe(data => this.onFormChange())
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.gemDetailsForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.gemDetailsForm);
  }

  bindFormData() {
    if (this.gemDetailToEdit) {
      this.isRecordSaved = true;
      this.gemDetailsForm.patchValue(this.gemDetailToEdit)
      this.gemDetailsForm.disable();
      // gemDetailsFormValue.date = this.gemDetailToEdit.detailId
      // gemDetailsFormValue.sgtlReportNumber = this.gemDetailToEdit.sgtlReportNumber
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
      // gemDetailsFormValue.detailId = this.gemDetailToEdit.detailId
      // gemDetailsFormValue.date = this.gemDetailToEdit.detailId
      // gemDetailsFormValue.sgtlReportNumber = this.gemDetailToEdit.sgtlReportNumber
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
      this.gemDetailToEdit = gemDetailsFormValue
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
    //if new save
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
    //if new Save
  }

  setValidatorsForReportFields(isValidatingForReport: boolean) {
    let validators = (isValidatingForReport) ? [Validators.required] : []

    this.gemDetailsForm.get("transparency").setValidators(validators)
    this.gemDetailsForm.get("refractiveIndex").setValidators(validators)
    this.gemDetailsForm.get("specifyGravity").setValidators(validators)
    this.gemDetailsForm.get("hardness").setValidators(validators)
    this.gemDetailsForm.get("opticCharacter").setValidators(validators)
    this.gemDetailsForm.get("magnification").setValidators(validators)
    this.gemDetailsForm.get("apex").setValidators(validators)

    //updateValueAndValidity
    this.gemDetailsForm.get("transparency").updateValueAndValidity()
    this.gemDetailsForm.get("refractiveIndex").updateValueAndValidity()
    this.gemDetailsForm.get("specifyGravity").updateValueAndValidity()
    this.gemDetailsForm.get("hardness").updateValueAndValidity()
    this.gemDetailsForm.get("opticCharacter").updateValueAndValidity()
    this.gemDetailsForm.get("magnification").updateValueAndValidity()
    this.gemDetailsForm.get("apex").updateValueAndValidity()

  }

  proceedToReportGeneration(){

  }

  proceedToCardGeneration(){
    
  }


}
