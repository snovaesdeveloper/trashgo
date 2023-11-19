import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracoesSistemaComponent } from './configuracoes-sistema.component';

describe('ConfiguracoesSistemaComponent', () => {
  let component: ConfiguracoesSistemaComponent;
  let fixture: ComponentFixture<ConfiguracoesSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracoesSistemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracoesSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
