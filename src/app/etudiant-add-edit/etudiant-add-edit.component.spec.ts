import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantAddEditComponent } from './etudiant-add-edit.component';

describe('EtudiantAddEditComponent', () => {
  let component: EtudiantAddEditComponent;
  let fixture: ComponentFixture<EtudiantAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtudiantAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
