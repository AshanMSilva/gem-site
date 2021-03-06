import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { MODELTYPE } from 'app/shared/utils/model-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GemDetail } from 'app/shared/models/gem-detail'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GemDetailService {

  gemReportList: AngularFireList<GemDetail>;
  gemReports: Observable<GemDetail[]>;
  gemReport: Observable<GemDetail>;
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toasterService: ToastrService
  ) {
  }

  getGemDetails(): Observable<GemDetail[]> {
    this.gemReportList = this.db.list<GemDetail>(MODELTYPE.GEM_DETAILS,);
    this.gemReports = this.gemReportList.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val() as GemDetail;
        data.sgtlReportNumber = a.payload.key;
        return data;
      }))
    );
    return this.gemReports;
  }


  getGemDetailById(id: string): Observable<GemDetail> {
    this.gemReport = this.db.object<GemDetail>(MODELTYPE.GEM_DETAILS + '/' + id).snapshotChanges().pipe(
      map(response => {
        const data = response.payload.val() as GemDetail;
        if (data != null) {
          data.sgtlReportNumber = response.payload.key;
        }
        return data;
      })
    );
    return this.gemReport;
  }


  addGemDetail(gemDetail: any) {
    return this.db.database.ref(MODELTYPE.GEM_DETAILS).push(gemDetail, (e) => {
      if (e) {
        this.toasterService.error("Gem Detail Could Not Be Added!\n " + e.message, "Error")
      } else {
        this.toasterService.success("Gem Detail Added", "Success")
      }
    });
  }

  setGemDetail(id: string, gemDetail: any) {
    return this.db.object(MODELTYPE.GEM_DETAILS + '/' + id).set(gemDetail).then((e) => {
      this.toasterService.success("Gem Detail Added", "Success")
    }, (e) => {
      if (e) {
        this.toasterService.error("Gem Detail Could Not Be Added!\n " + e.message, "Error")
      }
    });
  }

  updateGemDetail(id: string, gemDetail: any) {
    return this.db.object(MODELTYPE.GEM_DETAILS + '/' + id).update(gemDetail).then(() => {
      this.toasterService.success("Gem Detail Updated", "Success")
    }, (e) => {
      this.toasterService.error("Gem Detail Could Not Be Updated!\n ", "Error")
    });
  }

  deleteGemDetail(id: string) {
    this.db.object(MODELTYPE.GEM_DETAILS + '/' + id).remove();
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


  private selectedGemDetailIdForEditAndGen: string

  getSelectedGemDetailIdForView() {
    return this.selectedGemDetailIdForEditAndGen
  }

  setSelectedGemDetailIdForView(sgtlReportNumber: string) {
    this.selectedGemDetailIdForEditAndGen = sgtlReportNumber
  }

}
