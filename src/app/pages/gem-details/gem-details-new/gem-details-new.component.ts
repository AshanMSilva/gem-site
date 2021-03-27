import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { GemDetail } from 'app/shared/models/gem-detail';
import { FormUtil } from 'app/shared/utils/form-utility';
import { ToastrService } from 'ngx-toastr';

import { FileQueueObject, ImageUploaderOptions } from 'ngx-image-uploader-next';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignatureService } from 'app/services/signature/signature.service';
import { SignatureDTO } from 'app/shared/models/signatureDTO';
import { ISSUETYPE } from 'app/shared/utils/gem-details-types';

@Component({
  selector: 'app-gem-details-new',
  templateUrl: './gem-details-new.component.html',
  styleUrls: ['./gem-details-new.component.css']
})
export class GemDetailsNewComponent implements OnInit {
  isRecordSaved: boolean = false
  disableGenBtn: boolean = false

  gemDetailIdToEdit: string //sgtlReportNumber
  gemDetailToEdit: GemDetail

  displayGemImgFromURL: boolean

  gemImageURL: string
  gemImgSubscription: Subscription


  gemDetailsForm: FormGroup;
  formErrors: Map<string, string> = new Map();
  formValidationMessages: Map<string, Map<string, string>> = new Map();

  gemImageFile: File;


  signatureList: SignatureDTO[]
  selectedSignatureName: string

  reportIssueTypeList: string[] = Object.keys(ISSUETYPE);

  constructor(
    private formBuilder: FormBuilder,
    private gemDetailService: GemDetailService,
    private signatureService: SignatureService,
    private toasterService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.signatureService.setSelectedSignatureNameToSign(null)
    this.displayGemImgFromURL = true //check
    if (this.gemDetailService.getSelectedGemDetailIdForView()) {
      this.gemDetailIdToEdit = this.gemDetailService.getSelectedGemDetailIdForView()
      let filePath = "gems/" + this.gemDetailIdToEdit + "_gem"
      this.gemImgSubscription = this.gemDetailService.getFiles(filePath).subscribe(res => {
        if (res) {
          console.log(res);
          this.gemImageURL = res
          this.gemImgSubscription.unsubscribe()
        }
      })
    } else {
      this.gemDetailIdToEdit = new Date().getTime().toString(); //new
      this.isRecordSaved = false
    }
    this.createForm();
    this.gemDetailService.getGemDetailById(this.gemDetailIdToEdit).subscribe(res => {
      this.gemDetailToEdit = res as GemDetail
      this.bindFormData(res)

    })

    this.signatureService.getSignatures().subscribe(res => {
      this.signatureList = res
    })

  }

  createForm() {
    this.gemDetailsForm = this.formBuilder.group({

      //common
      date: [new Date(), Validators.required],
      sgtlReportNumber: [{ value: this.gemDetailIdToEdit, disabled: true }, Validators.required],

      issueType: ISSUETYPE.ORIGINAL,

      isReportGenerated: false,
      isCardGenerated: false,

      object: ['', Validators.required],           //common
      gemologistName: ['',],           //common

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
      comments: ['', [Validators.required, Validators.maxLength(50)]],       //common
      apex: [''],

      // //Gem Image
      isGemImageSaved: [''],       //common

    });

    this.gemDetailsForm.valueChanges.subscribe(data => {
      this.onFormChange()
      this.disableGenBtn = true
    })
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.gemDetailsForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.gemDetailsForm);
    this.formValidationMessages.get("comments").set("maxlength", "Comments should be less than 50 characters")
    this.formValidationMessages.get("isGemImageSaved").set("required", "Gem Image is required")
    this.formValidationMessages.get("date").set("matDatepickerParse", "Date is in incorrect format")
    this.disableGenBtn = false
  }

  onSelectetValueChange(event) {
    this.gemDetailsForm.controls.date.setValue(event.value)
  }

  bindFormData(res: GemDetail) {
    if (res) {
      this.isRecordSaved = true;
      this.gemDetailsForm.patchValue(this.gemDetailToEdit)
      this.gemDetailsForm.controls.date.setValue(new Date(res.date))
      //set validators when saved
      this.gemDetailsForm.get("isGemImageSaved").setValidators([Validators.required])
      //updateValueAndValidity
      this.gemDetailsForm.get("isGemImageSaved").updateValueAndValidity()
      this.disableGenBtn = false
      if (res.issueType) this.selectReportIssueType(res.issueType)
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
    this.disableGenBtn = false
    let gemDetailsFormValue = this.gemDetailsForm.getRawValue() as GemDetail;
    let date = this.gemDetailsForm.controls.date.value as Date
    gemDetailsFormValue.date = date.toISOString()
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
    this.disableGenBtn = false
  }

  proceedToReportGeneration() {
    if (this.signatureService.getSelectedSignatureNameToSign()) {
      this.toasterService.info("Proceeding to Report Generation")
      this.gemDetailService.setSelectedGemDetailIdForView(this.gemDetailIdToEdit)
      this.router.navigateByUrl("pdf-gen/report") // create view screen if time is available
    } else {
      this.toasterService.info("Please Select signature")
    }

  }

  proceedToCardGeneration() {
    // if (this.signatureService.getSelectedSignatureNameToSign()) {
    this.toasterService.info("Proceeding to Card Generation")
    this.gemDetailService.setSelectedGemDetailIdForView(this.gemDetailIdToEdit)
    this.router.navigateByUrl("pdf-gen/card") // create view screen if time is available
    // } else {
    // this.toasterService.info("Please Select signature")
    // }
  }


  options: ImageUploaderOptions = {

    uploadUrl: '',
    allowedImageTypes: ['image/png'],
    maxImageSize: 1,
    autoUpload: false,
  };

  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type == 'image/png') {
        this.gemImageFile = file;
        console.log(this.gemImageFile);
      }
    }

  }


  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type == 'image/png') {
        this.gemImageFile = file;
        console.log(this.gemImageFile);
      }

    }
  }

  gemImagePercentage: number
  uploadGemImage() {
    if (this.gemImageFile) {
      let filePath = "gems/" + this.gemDetailIdToEdit + "_gem"
      let result = this.gemDetailService.uploadFile(this.gemImageFile, filePath)
      result.task.percentageChanges().subscribe(res => {
        if (res) {
          this.gemImagePercentage = (res >= 100) ? null : res;
        }
      })

      result.task.then(res => {
        this.toasterService.success("Gem Stone Image Uploaded")
        this.displayGemImgFromURL = false
        this.gemImagePercentage = null
        this.gemDetailService.updateGemDetail(this.gemDetailIdToEdit, { isGemImageSaved: true })
      }, e => {
        this.toasterService.error("Gem Stone Image could not be Uploaded")
        this.gemImagePercentage = null
      })
    } else {
      this.toasterService.warning("Please Select Image to upload")
    }
  }

  selectSignature(sign: SignatureDTO) {
    this.selectedSignatureName = sign.signatureName
    this.signatureService.setSelectedSignatureNameToSign(sign.signatureName)
  }

  selectReportIssueType(issueType: string) {
    this.gemDetailsForm.controls.issueType.setValue(ISSUETYPE[issueType])
  }

  getReportIssueTypeFormValue() {
    return this.gemDetailsForm.controls.issueType.value;
  }

}
