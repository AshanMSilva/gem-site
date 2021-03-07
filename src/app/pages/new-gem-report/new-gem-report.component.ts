import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtil } from 'app/shared/utils/form-utility';
import { GEMREPORTTYPE } from 'app/shared/utils/gem-details-types';
import { FileQueueObject, ImageUploaderOptions } from 'ngx-image-uploader-next';



@Component({
  selector: 'app-new-gem-report',
  templateUrl: './new-gem-report.component.html',
  styleUrls: ['./new-gem-report.component.css']
})
export class NewGemReportComponent implements OnInit {

  gemDetailsForm: FormGroup;
  formErrors: Map<string, string> = new Map();
  formValidationMessages: Map<string, Map<string, string>> = new Map();
  gemReprtType:string;
  imageFile: File;
  constructor(
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private location: Location
    
  ) { }
  
  ngOnInit(): void {
    this.gemReprtType = this.route.snapshot.paramMap.get('type');
    if(this.gemReprtType != GEMREPORTTYPE.BOTH && this.gemReprtType != GEMREPORTTYPE.MEMO_CARD && this.gemReprtType != GEMREPORTTYPE.REPORT){
      this.location.back();
    }
    else{
      this.createForm(this.gemReprtType);
    }
    
  }

  createForm(gemReprtType:string) {
    if(gemReprtType == GEMREPORTTYPE.BOTH || gemReprtType == GEMREPORTTYPE.REPORT){
   
      this.gemDetailsForm = this.formBuilder.group({
        weight: ['', Validators.required],
        shape: ['', Validators.required],
        transparency: ['', Validators.required],
        dimensions: ['', Validators.required],
        refractiveIndex: ['', Validators.required],
        specifyGravity: ['', Validators.required],
        hardness: ['', Validators.required],
        opticCharacter: ['', Validators.required],
        magnification: ['', Validators.required],
        color: ['', Validators.required],
        species: ['', Validators.required],
        variety: ['', Validators.required],
        comments: ['', Validators.required],
        apex: ['', Validators.required],
       
      });
      
    }
    else{
      this.gemDetailsForm = this.formBuilder.group({
        weight: ['', Validators.required],
        shape: ['', Validators.required],
        dimensions: ['', Validators.required],
        color: ['', Validators.required],
        species: ['', Validators.required],
        variety: ['', Validators.required],
        comments: ['', Validators.required],
      }); 
    }
    
    this.gemDetailsForm.valueChanges.subscribe(data => this.onFormChange())
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.gemDetailsForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.gemDetailsForm);
  }

  onFormChange() {
    this.clearValidationMessages();
    this.displayValidation();
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
    
  }
  options: ImageUploaderOptions = {
    
    uploadUrl: '',
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 1,
    autoUpload:false,
};

  onUpload(file: FileQueueObject) {
    console.log(file.response);
  }
  onDrop(event){
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if(file.type =='image/png' || file.type =='image/jpeg'){
        this.imageFile = file;
        console.log(this.imageFile);
      }
    }
    
  }
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(file.type =='image/png' || file.type =='image/jpeg'){
        this.imageFile = file;
        console.log(this.imageFile);
      }
      
    }
  }

 


}
