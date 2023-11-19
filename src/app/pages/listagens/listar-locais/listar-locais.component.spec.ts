import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLocaisComponent } from './listar-locais.component';

describe('ListarLocaisComponent', () => {
  let component: ListarLocaisComponent;
  let fixture: ComponentFixture<ListarLocaisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarLocaisComponent]
    });
    fixture = TestBed.createComponent(ListarLocaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
