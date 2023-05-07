import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EtudiantService } from '../services/etudiant.service';

@Component({
  selector: 'app-etudiant-add-edit',
  templateUrl: './etudiant-add-edit.component.html',
  styleUrls: ['./etudiant-add-edit.component.scss']
})
export class EtudiantAddEditComponent implements OnInit {
  etudiantForm: FormGroup;

  /*classe: string[] = [
    'Master 1 Data',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];*/
  classe: string[] = [];
  matricule: string | undefined;
  //private _classeService: any;

  constructor(
    private _fb: FormBuilder,
    private _etudiantService: EtudiantService,
    private _dialogRef: MatDialogRef<EtudiantAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.etudiantForm = this._fb.group({
      nom: '',
      prenom: '',
      matricule: '',
      classe: '',
    });


    this.matricule = this.generateMatricule();

    this._etudiantService.getclasseList().subscribe(classes => {
      this.classe = classes.map((c: { nom: any; }) => c.nom);
      //this.classe = classes;
    });

    
  }

  generateMatricule(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
    return `Et-${day}${month}${year}${hour}${minute}${second}-@`;
  }
  
  isAjout() {
    return !this.data;
}

  ngOnInit(): void {
    this.etudiantForm.patchValue(this.data);

    if (this.isAjout()) {
      this.etudiantForm.controls['matricule'].setValue(this.generateMatricule());
    } else {
      this.etudiantForm.patchValue(this.data);
    }

  }

  onFormSubmit() {
    if (this.etudiantForm.valid) {
      if (this.data) {
        this._etudiantService
          .updateEtudiant(this.data.id, this.etudiantForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Mise à jour effectuée avec succès!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._etudiantService.addEtudiant(this.etudiantForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Étudiant ajouté avec succès!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

  /*onFormSubmit() {
    if (this.etudiantForm.valid) {
      const newEtudiant = this.etudiantForm.value;

      if (this.data) {
        // Modifier l'étudiant existant
        this._etudiantService.updateEtudiant(this.data.id, newEtudiant).subscribe({
          next: () => {
            this._coreService.openSnackBar('Mise à jour effectuée avec succès!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        // Ajouter un nouvel étudiant
        this._etudiantService.addEtudiant(newEtudiant).subscribe({
          next: () => {
            // Mettre à jour l'attribut "effectif" de la classe correspondante
            this._classeService.getClasseByLibelle(newEtudiant.classe).subscribe((classe: { effectif: number; }) => {
              classe.effectif++;
              this._classeService.updateClasse(classe).subscribe({
                next: () => {
                  this._coreService.openSnackBar('Étudiant ajouté avec succès!');
                  this._dialogRef.close(true);
                },
                error: (err: any) => {
                  console.error(err);
                },
              });
            });
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }*/

  
  
  

}
