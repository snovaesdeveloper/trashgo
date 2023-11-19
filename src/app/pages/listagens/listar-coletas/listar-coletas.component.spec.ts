import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarColetasComponent } from './listar-coletas.component';

describe('ListarColetasComponent', () => {
  let component: ListarColetasComponent;
  let fixture: ComponentFixture<ListarColetasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarColetasComponent]
    });
    fixture = TestBed.createComponent(ListarColetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
