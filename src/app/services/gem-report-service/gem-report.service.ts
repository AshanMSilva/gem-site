import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { MODELTYPE } from 'app/shared/utils/model-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GemReportService {

  gemReportList: AngularFireList<GemReport>;
  gemReports:Observable<GemReport[]>;
  gemReport:Observable<GemReport>;
  constructor(private db:AngularFireDatabase) {
  }

  getGemReports(): Observable<GemReport[]>{
    this.gemReportList = this.db.list<GemReport>(MODELTYPE.GEM_REPORTS,); 
    this.gemReports = this.gemReportList.snapshotChanges().pipe(
      map(actions => actions.map(a=>{
          const data = a.payload.val() as GemReport;
          data.id = a.payload.key;
          return data;
      }))
    );
    return this.gemReports;
  } 
 
  
  getGemReportById(id:string):Observable<GemReport>{
    this.gemReport = this.db.object<GemReport>(MODELTYPE.GEM_REPORTS+'/'+id).snapshotChanges().pipe(
      map(response => {
       
        const data = response.payload.val() as GemReport;
        if(data!=null){
          data.id = response.payload.key;
        }
        
        return data;
      })
    );
    return this.gemReport;
  }

 

  addGemReport(id:string, gemReport:any){
    this.db.object(MODELTYPE.GEM_REPORTS+'/'+id).set(gemReport);
  }

  updateGemReport(id:string, gemReport:any){
    this.db.object(MODELTYPE.GEM_REPORTS+'/'+id).update(gemReport);
  }

  deleteGemReport(id:string){
    this.db.object(MODELTYPE.GEM_REPORTS+'/'+id).remove();
  }
}
