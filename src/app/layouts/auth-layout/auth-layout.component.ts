import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../components/sidebar/sidebar.component';


@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  
  

  constructor(private router: Router, ) { }

 
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
   
  ngOnInit() {
    

  }
  ngOnDestroy() {
    
  }
 

}
