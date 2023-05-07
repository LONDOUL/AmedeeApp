import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EtudiantAddEditComponent } from './etudiant-add-edit/etudiant-add-edit.component';
import { EtudiantService } from './services/etudiant.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  classes: string[] = [];
  @ViewChild('classListModal', { static: true }) classListModal!: TemplateRef<any>;
  
  title = 'AmedeeApp';

  displayedColumns: string[] = [
    'id',
    'matricule',
    'nom',
    'prenom',
    'classe',
    'action',
  ];
  

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor (
    private _dialog: MatDialog, 
    private _etudiantService: EtudiantService,
    private _coreService: CoreService,
    private router: Router) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]);
    this.getEtudiantList();
    this.getClasseList();
  }

  getClasseList() {
    this._etudiantService.getclasse().subscribe(
      (classes) => {
        this.classes = classes;
      },
      (error) => {
        console.log('Une erreur est survenue : ', error);
      }
    );
  }
  

  getEtudiantList() {
    this._etudiantService.getEtudiantList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: console.log,
    });
  }

  openClassListModal() {
    this.getClasseList();
    const dialogRef = this._dialog.open(this.classListModal);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
/*
  getEtudiantList() {
    this._etudiantService.getEtudiantList().subscribe({
    next: (res) => {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
    switch (sortHeaderId) {
    case 'nom': return data.nom;
    default: return data[sortHeaderId];
    }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.sort.sort({
      id: 'nom', start: 'asc',
      disableClear: false
    });
    },
    error: console.log,
    });
  }*/

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch(property) {
        case 'nom': return item.nom;
        default: return item[property];
      }
    };
    this.dataSource.sort.sort({
      id: 'nom', start: 'asc',
      disableClear: false
    });
  }
  

  onpenAddEditEtudiantForm() {
    const dialogRef = this._dialog.open(EtudiantAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEtudiantList();
        }
      },
    });
  }

  /*getEtudiantList() {
    this._etudiantService.getEtudiantList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }*/


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEtudiant(id: number) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir supprimer cet étudiant ?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      },
    });
  
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this._etudiantService.deleteEtudiant(id).subscribe({
            next: (res) => {
              this._coreService.openSnackBar('Étudiant supprimé!');
              this.getEtudiantList();
              this.getClasseList();
            },
            error: (err) => {
              console.log(err);
              this._coreService.openSnackBar('Une erreur est survenue lors de la suppression de l\'étudiant.');
            },
          });
        }
      },
    });
  }
  
  
  
/*
  deleteEtudiant(id: number) {
    this._etudiantService.deleteEtudiant(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Étudiant supprimé!');
        this.getEtudiantList();
      },
      error: console.log,
    });
  }*/

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EtudiantAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEtudiantList();
        }
      },
    });
  }

  // Fonction pour naviguer vers la page de liste des classes
  /*goToClasses() {
    this.router.navigate(['/classes']);
  }*/


}
