import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth-service/auth.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
 
  { path: '/gem-details', title: 'Gem Details', icon: 'dashboard', class: '' },
  { path: '/signatures', title: 'Signatures', icon: 'border_color', class: '' },
 
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
  signOut(){
    this.authService.signOut();
  }
}
