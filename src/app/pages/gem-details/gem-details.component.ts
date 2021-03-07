import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtil } from 'app/shared/utils/form-utility';

@Component({
  selector: 'app-gem-details',
  templateUrl: './gem-details.component.html',
  styleUrls: ['./gem-details.component.css']
})
export class GemDetailsComponent implements OnInit {


  gemDetailsSearchForm: FormGroup;
  formErrors: Map<string, string> = new Map();
  formValidationMessages: Map<string, Map<string, string>> = new Map();

  gemImageFile: File;

  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  redirectToNew() {
    this.router.navigateByUrl("/gem-detail/new")
  }

  createForm() {
    
    this.gemDetailsSearchForm = this.formBuilder.group({
      query: ['', Validators.required],           
    });

    this.gemDetailsSearchForm.valueChanges.subscribe(data => this.onFormChange())
    this.onFormChange();
    this.formErrors = FormUtil.getFormErrorMap(this.gemDetailsSearchForm);
    this.formValidationMessages = FormUtil.getGenericFormValidators(this.gemDetailsSearchForm);
   
  }

  

  onFormChange() {
    this.clearValidationMessages();
  }

  clearValidationMessages() {
    this.formErrors.forEach((value, key, self) => { self.set(key, '') })
  }

  displayValidation() {
    this.formErrors = FormUtil.validateForm(this.gemDetailsSearchForm, this.formErrors, this.formValidationMessages)
  }

  preprocessForm() {
    if (this.gemDetailsSearchForm.valid) {
      this.onFormSubmit();
    } else {
      this.displayValidation();
    }
  }

  onFormSubmit() {
    let q = this.gemDetailsSearchForm.value["query"];;
    this.gemDetailsSearchForm.reset();
    try {
      this.router.navigateByUrl(`/gem-details/search/${q}`);
    } catch (error) {
      console.log(error.message);
      
    }
   
  }

}
