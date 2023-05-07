import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Classe } from '../models/classe';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private classesUrl = 'http://localhost:3000/classes';

  constructor(private _http: HttpClient) {}

  getclasseList(): Observable<any> {
    return this._http.get('http://localhost:3000/classes');
  }

  getClasses(): Observable<Classe[]> {
    return this._http.get<Classe[]>(this.classesUrl);
  }

  getClasseNameById(id: number): Observable<string> {
    return this._http.get<Classe>(`${this.classesUrl}/${id}`).pipe(
      map(classe => classe.nom)
    );
  }
}
