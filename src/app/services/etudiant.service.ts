import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Etudiant } from '../models/etudiant';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(private _http: HttpClient) {}

  /*addEtudiant(data: any): Observable<any> {
    return this._http.post('http://localhost:3000/etudiants', data);
  }
  private classeUrl = 'http://localhost:3000/classes';*/

  addEtudiant(etudiant: Etudiant): Observable<any> {
    return this._http.post<any>('http://localhost:3000/etudiants', etudiant).pipe(
      switchMap((newEtudiant) => {
        return this._http.get<any>('http://localhost:3000/classes').pipe(
          map((classes) => {
            const classe = classes.find((c: any) => c.nom === etudiant.classe);
            if (classe) {
              classe.effectif++;
              return classe;
            } else {
              throw new Error(`La classe ${etudiant.classe} n'existe pas.`);
            }
          }),
          switchMap((updatedClasse) => {
            return this._http.put<any>(
              `http://localhost:3000/classes/${updatedClasse.id}`,
              updatedClasse
            );
          }),
          map(() => newEtudiant)
        );
      })
    );
  }
  

  /*updateEtudiant(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/etudiants/${id}`, data);
  }*/

  updateEtudiant(id: number, etudiant: Etudiant): Observable<any> {
    let ancienneClasse: any;
    let nouvelleClasse: any;
    return this.getEtudiant(id).pipe(
      switchMap((data: any) => {
        ancienneClasse = data.classe;
        return this._http.put(`http://localhost:3000/etudiants/${id}`, etudiant);
      }),
      switchMap(() => {
        nouvelleClasse = etudiant.classe;
        if (ancienneClasse !== nouvelleClasse) {
          return forkJoin({
            ancienneClasse: this._http.get(`http://localhost:3000/classes?nom=${ancienneClasse}`).pipe(take(1)),
            nouvelleClasse: this._http.get(`http://localhost:3000/classes?nom=${nouvelleClasse}`).pipe(take(1))
          });
        } else {
          return of(null);
        }
      }),
      switchMap((classes: any) => {
        if (classes) {
          const ancienneClasse = classes.ancienneClasse[0];
          const nouvelleClasse = classes.nouvelleClasse[0];
          ancienneClasse.effectif--;
          nouvelleClasse.effectif++;
          return forkJoin({
            ancienneClasse: this._http.put(`http://localhost:3000/classes/${ancienneClasse.id}`, ancienneClasse),
            nouvelleClasse: this._http.put(`http://localhost:3000/classes/${nouvelleClasse.id}`, nouvelleClasse)
          });
        } else {
          return of(null);
        }
      })
    );
  }
  
  
  
  decrementerEffectifClasse(nomClasse: string) {
    this._http.get(`http://localhost:3000/classes?nom=${nomClasse}`).subscribe((data: any) => {
      let classe = data[0];
      classe.effectif--;
      this._http.put(`http://localhost:3000/classes/${classe.id}`, classe).subscribe();
    });
  }
  
  incrementerEffectifClasse(nomClasse: string) {
    this._http.get(`http://localhost:3000/classes?nom=${nomClasse}`).subscribe((data: any) => {
      let classe = data[0];
      classe.effectif++;
      this._http.put(`http://localhost:3000/classes/${classe.id}`, classe).subscribe();
    });
  }
  

  getEtudiantList(): Observable<any> {
    return this._http.get('http://localhost:3000/etudiants');
  }

  
  deleteEtudiant(id: number): Observable<any> {
    return this._http.get(`http://localhost:3000/etudiants/${id}`).pipe(
      switchMap((etudiant: any) => {
        const classe = etudiant.classe;
        return this._http.delete(`http://localhost:3000/etudiants/${id}`).pipe(
          tap(() => {
            const classesUrl = `http://localhost:3000/classes`;
            this._http.get(classesUrl).subscribe((classes: any) => {
              const classeToUpdate = classes.find((c: any) => c.nom === classe);
              classeToUpdate.effectif -= 1;
              this._http.put(`${classesUrl}/${classeToUpdate.id}`, classeToUpdate).subscribe();
            });
          })
        );
      })
    );
  }
  
  
  /*deleteEtudiant(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/etudiants/${id}`);
  }*/
  
  getClass(id: number): Observable<any> {
    return this._http.get(`http://localhost:3000/classes/${id}`);
  }
  
  getEtudiant(id: number): Observable<any> {
    return this._http.get(`http://localhost:3000/etudiants/${id}`);
  }

  
  getclasseList(): Observable<any> {
    return this._http.get('http://localhost:3000/classes');
  }

  getclasse(): Observable<any> {
    return this._http.get('http://localhost:3000/classes');
  }

}
