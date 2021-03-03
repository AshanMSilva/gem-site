import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/services/auth-service/auth.service';






@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnChanges, OnInit {
 
  forgotPasswordForm: FormGroup;
  forgotPasswordFormErrors ={
    'email':'',
   
  };
  
  forgotPasswordFormValidationMessages ={
    'email':{
      'required': 'Email Address is required',
      'email':'Emai Address is not in valid format'
    }
  };
  
  constructor(
    
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnChanges(): void {
    
  }

  ngOnInit(): void {
    this.createForgotPasswordForm();

  }
  open(content, type, modalDimension) {

        this.modalService.open(content, { windowClass: type, size: modalDimension, centered: true })
  }
  createForgotPasswordForm(){

    this.forgotPasswordForm =this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
     
    });
    this.forgotPasswordForm.valueChanges.subscribe(data=>this.onForgotPasswordFormValueChanged());
    this.onForgotPasswordFormValueChanged(); //reset form validation messages
  }

  onForgotPasswordFormValueChanged(){
    if(!this.forgotPasswordForm){
      return;
    }
    const form =this.forgotPasswordForm;
    for(const field in this.forgotPasswordFormErrors){
      if(this.forgotPasswordFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.forgotPasswordFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.forgotPasswordFormValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.forgotPasswordFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onForgotPasswordFormFormSubmit(){  
    console.log(this.forgotPasswordForm.value['email']);

    this.authService.forgotPassword(this.forgotPasswordForm.value['email']);
    
    this.forgotPasswordForm.reset();

  }


}
