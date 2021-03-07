import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignatureService } from 'app/services/signature/signature.service';
import { SignatureDTO } from 'app/shared/models/signatureDTO';

@Component({
  selector: 'app-signatures-list',
  templateUrl: './signatures-list.component.html',
  styleUrls: ['./signatures-list.component.css']
})
export class SignaturesListComponent implements OnInit {
  signatureList: SignatureDTO[]

  constructor(
    private signatureService: SignatureService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.signatureService.setSelectedSignatureNameForEdit(null)
    this.signatureService.setSelectedSignatureNameToSign(null)
    this.signatureService.getSignatures().subscribe(res => {
      if (res) {
        this.signatureList = res
      }
    })

  }

  onClickEditSignature(signature: SignatureDTO) {
    this.signatureService.setSelectedSignatureNameForEdit(signature.signatureName)
    this.router.navigateByUrl("signature/new")
  }

}
