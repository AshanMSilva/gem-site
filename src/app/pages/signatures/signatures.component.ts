import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GemDetailService } from 'app/services/gem-detail-service/gem-detail.service';
import { SignatureService } from 'app/services/signature/signature.service';

@Component({
  selector: 'app-signatures',
  templateUrl: './signatures.component.html',
  styleUrls: ['./signatures.component.css']
})
export class SignaturesComponent implements OnInit {

  constructor(
    private router: Router,
    private signatureService: SignatureService,
  ) { }

  ngOnInit(): void {
  }

  redirectToNew() {
    this.signatureService.setSelectedSignatureNameForEdit(null)
    this.router.navigateByUrl("/signature/new")
  }

}
