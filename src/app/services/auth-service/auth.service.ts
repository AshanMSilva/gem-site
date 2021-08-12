import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) { }


  login(email: string, password: string) {
    this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(res => this.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          this.router.navigateByUrl('dashboard');
          this.toastr.info('You have successfully logged in..!');

        }).catch(error => {
          this.toastr.error(error.message);
        })
    ).catch(e=>{
      this.toastr.error('Persistent SESSION Error');
      }
    );

  }

  signOut(){
    this.auth.signOut().then(res =>{
      this.router.navigateByUrl('login');
      this.toastr.info("You have successfully logged Out");
    }).catch(error => {
      this.toastr.error(error?.message);
    });
  }
  getCurrentUser():Observable<any>{
    return this.auth.authState;
  }
  forgotPassword(email:string){
    this.auth.sendPasswordResetEmail(email).then((val)=>{
      this.toastr.info("Password reset link sent successfully");
    }).catch(error => {
      this.toastr.error(error?.message);
    });
  }
}