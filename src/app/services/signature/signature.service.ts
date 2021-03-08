import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { SignatureDTO } from 'app/shared/models/signatureDTO';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MODELTYPE } from 'app/shared/utils/model-types';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  signatureList: AngularFireList<SignatureDTO>;
  signatures: Observable<SignatureDTO[]>;
  signature: Observable<SignatureDTO>;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toasterService: ToastrService
  ) { }

  getSignatures(): Observable<SignatureDTO[]> {
    this.signatureList = this.db.list<SignatureDTO>(MODELTYPE.SIGNATURE,);
    this.signatures = this.signatureList.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val() as SignatureDTO;
        data.signatureName = a.payload.key;
        return data;
      }))
    );
    return this.signatures;
  }

  getSignatureById(id: string): Observable<SignatureDTO> {
    this.signature = this.db.object<SignatureDTO>(MODELTYPE.SIGNATURE + '/' + id).snapshotChanges().pipe(
      map(response => {
        const data = response.payload.val() as SignatureDTO;
        if (data != null) {
          data.signatureName = response.payload.key;
        }
        return data;
      })
    );
    return this.signature;
  }

  addSignature(signature: any) {
    return this.db.database.ref(MODELTYPE.SIGNATURE).push(signature, (e) => {
      if (e) {
        this.toasterService.error("Signature Could Not Be Added!\n " + e.message, "Error")
      } else {
        this.toasterService.success("Signature Added", "Success")
      }
    });
  }

  setSignature(id: string, signature: any) {
    return this.db.object(MODELTYPE.SIGNATURE + '/' + id).set(signature).then((e) => {
      this.toasterService.success("Signature Added", "Success")
    }, (e) => {
      if (e) {
        this.toasterService.error("Signature Could Not Be Added!\n " + e.message, "Error")
      }
    });
  }

  updateSignature(id: string, signature: any) {
    return this.db.object(MODELTYPE.SIGNATURE + '/' + id).update(signature).then(() => {
      this.toasterService.success("Signature Updated", "Success")
    }, (e) => {
      this.toasterService.error("Signature Could Not Be Updated!\n ", "Error")
    });
  }

  deleteSignature(id: string) {
    this.db.object(MODELTYPE.SIGNATURE + '/' + id).remove();
  }

  getFiles(filepath: string): Observable<string> {
    return this.storage.ref(filepath).getDownloadURL();
  }

  uploadFile(file: File, filepath: string) {
    const fileRef = this.storage.ref(filepath);
    const task = this.storage.upload(filepath, file);
    return { fileRef, task };
  }

  updateFile(file: File, filepath: string) {
    const fileRef = this.storage.ref(filepath);
    const task = fileRef.put(file);
    return { fileRef, task };
  }

  deleteFile(filepath: string) {
    return this.storage.ref(filepath).delete();
  }

  private selectedSignatureNameForEdit: string

  getSelectedSignatureNameForEdit() {
    return this.selectedSignatureNameForEdit
  }

  setSelectedSignatureNameForEdit(signatureName: string) {
    this.selectedSignatureNameForEdit = signatureName
  }

  private selectedSignatureNameToSign: string

  getSelectedSignatureNameToSign() {
    return this.selectedSignatureNameToSign
  }

  setSelectedSignatureNameToSign(signatureName: string) {
    this.selectedSignatureNameToSign = signatureName
  }


}
