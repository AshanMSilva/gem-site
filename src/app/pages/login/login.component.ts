import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "app/services/auth-service/auth.service";




@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  loginErr: any;
  passwordType: string;
  slashIcon: string;
  loading: boolean = false;
  loginFormErrors = {
    email: "",
    password: "",
  };
  user = {
    email: "",
    password: "",
  };
  loginValidationMessages ={
    'email':{
      'required': 'Email Address is required',
      'email':'Emai Address is not in valid format'
    },
    'password':{
      'required': 'password is required'
    }
  };
  selectedLanguage: string;
  hide = true;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.passwordType = "password";
    this.slashIcon = "";
    
    this.createLoginForm();
  }

  
  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
    this.loginForm.valueChanges.subscribe((data) =>
      this.onLoginFormValueChanged()
    );
    this.onLoginFormValueChanged(); //reset form validation messages
  }

  onLoginFormValueChanged() {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
    for (const field in this.loginFormErrors) {
      if (this.loginFormErrors.hasOwnProperty(field)) {
        //clear previous error messsage(if any)
        this.loginFormErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.loginValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.loginFormErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }
  onLoginFormSubmit() {
    this.user.email = this.loginForm.value["email"];
    this.user.password = this.loginForm.value["password"];
    this.authService.login(this.user.email, this.user.password);
    this.loginForm.reset();
  }

  
}
