import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirDespesasComponent } from './exibir-despesas.component';

describe('ExibirDespesasComponent', () => {
  let component: ExibirDespesasComponent;
  let fixture: ComponentFixture<ExibirDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExibirDespesasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExibirDespesasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
