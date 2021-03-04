import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtil } from 'app/shared/utils/form-utility';
import { GEMREPORTTYPE } from 'app/shared/utils/gem-details-types';



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
    this.formValidationMessages = FormUtil.validateForm(this.gemDetailsForm, this.formErrors, this.formValidationMessages)
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

 


}
