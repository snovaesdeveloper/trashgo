import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarColetaComponent } from './cadastrar-coleta.component';

describe('CadastrarColetaComponent', () => {
  let component: CadastrarColetaComponent;
  let fixture: ComponentFixture<CadastrarColetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarColetaComponent]
    });
    fixture = TestBed.createComponent(CadastrarColetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
