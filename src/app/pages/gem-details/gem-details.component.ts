import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gem-details',
  templateUrl: './gem-details.component.html',
  styleUrls: ['./gem-details.component.css']
})
export class GemDetailsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  redirectToNew() {
    this.router.navigateByUrl("/gem-detail/new")
  }

}
