import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignatureService } from 'app/services/signature/signature.service';
import { SignatureDTO } from 'app/shared/models/signatureDTO';
import { FormUtil } from 'app/shared/utils/form-utility';
import { ImageUploaderOptions } from 'ngx-image-uploader-next';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signatures-new',
  templateUrl: './signatures-new.component.html',
  styleUrls: ['./signatures-new.component.css']
})
export class SignaturesNewComponent implements OnInit {

  signatureToEdit: SignatureDTO
  signatureIdToEdit: string //signatureName

  signatureFile: File;
  signatureImageURL: string

  displaySignatureImgFromURL: boolean
  isRecordSaved: boolean


  signatureForm: FormGroup
  formErrors: Map<string, string> = new Map();
  formValidationMessages: Map<string, Map<string, string>> = new Map();


  constructor(
    private signatureService: SignatureService,
    private toasterService: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isRecordSaved = false;
    this.displaySignatureImgFromURL = false
    if (this.signatureService.getSelectedSignatureNameForEdit()) {
      this.displaySignatureImgFromURL = true
      this.signatureIdToEdit = this.signatureService.getSelectedSignatureNameForEdit()
      this.signatureService.getSignatureById(this.signatureIdToEdit).subscribe(res => {
        this.signatureToEdit = res
        this.bindFormData(res)
      })
      let filepath = "signatures/" + this.signatureIdToEdit + "_sign"
      this.signatureService.getFiles(filepath).subscribe(url => {
        this.signatureImageURL = url
      })
    }

    this.createForm()
  }

  bindFormData(res: SignatureDTO) {
    if (res) {
      this.isRecordSaved = true;
      this.signatureForm.disable()
      this.signatureForm.patchValue(this.signatureToEdit)
    }
  }

  createForm() {
    this.signatureForm = this.formBuilder.group({
      signatureName: ['', Validators.required],
    })

    this.signatureForm.valueChanges.subscribe(data => this.onFormChange())
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.signatureForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.signatureForm);
  }

  onFormChange() {
    this.clearValidationMessages();
  }

  clearValidationMessages() {
    this.formErrors.forEach((value, key, self) => { self.set(key, '') })
  }

  displayValidation() {
    this.formErrors = FormUtil.validateForm(this.signatureForm, this.formErrors, this.formValidationMessages)
  }

  preprocessForm() {
    if (this.signatureForm.valid || this.signatureForm.disabled) {
      this.onFormSubmit();
    } else {
      this.displayValidation();
    }
  }

  onFormSubmit() {
    let signatureFormValue = this.signatureForm.getRawValue() as SignatureDTO;
    if (this.isRecordSaved) {
      this.editSignatureImage(signatureFormValue)
    } else {
      this.saveSignature(signatureFormValue)
    }
  }

  editSignatureImage(signatureFormValue: SignatureDTO) {
    this.uploadSignatureImage()
  }

  saveSignature(signatureFormValue: SignatureDTO) {
    this.uploadSignatureImageAndSave(signatureFormValue)
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
        this.signatureFile = file;
        console.log(this.signatureFile);
      }
    }

  }


  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type == 'image/png') {
        this.signatureFile = file;
        console.log(this.signatureFile);
      }

    }
  }

  signatureImagePercentage: number
  uploadSignatureImage() {
    if (this.signatureFile) {
      let filepath = "signatures/" + this.signatureIdToEdit + "_sign"
      let result = this.signatureService.uploadFile(this.signatureFile, filepath)
      result.task.percentageChanges().subscribe(res => {
        if (res) {
          this.signatureImagePercentage = (res >= 100) ? null : res;
        }
      })

      result.task.then(res => {
        this.toasterService.success("Signature Image Uploaded")
        this.displaySignatureImgFromURL = false
        this.signatureImagePercentage = null
        // this.signatureService.updateSignature(this.signatureIdToEdit, { isGemImageSaved: true })
      }, e => {
        this.toasterService.error("Signature Image could not be Uploaded")
        this.signatureImagePercentage = null
      })
    } else {
      this.toasterService.warning("Please Select Image to upload")
    }
  }

  uploadSignatureImageAndSave(signatureFormValue: SignatureDTO) {
    if (this.signatureFile) {
      this.signatureIdToEdit = signatureFormValue.signatureName
      let filepath = "signatures/" + this.signatureIdToEdit + "_sign"
      let result = this.signatureService.uploadFile(this.signatureFile, filepath)
      result.task.percentageChanges().subscribe(res => {
        if (res) {
          this.signatureImagePercentage = (res >= 100) ? null : res;
        }
      })

      result.task.then(res => {
        this.toasterService.success("Signature Image Uploaded")
        this.displaySignatureImgFromURL = false
        this.signatureImagePercentage = null
        this.signatureService.setSignature(signatureFormValue.signatureName, signatureFormValue).then((ref) => {
          this.isRecordSaved = true
          this.signatureForm.disable()
        }, (e) => {
          console.log(e);
        })
      }, e => {
        this.toasterService.error("Signature Image could not be Uploaded")
        this.signatureImagePercentage = null
      })
    } else {
      this.toasterService.warning("Please Select Image to upload")
    }
  }

}
