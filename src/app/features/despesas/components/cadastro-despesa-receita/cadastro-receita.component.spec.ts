import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroReceitaComponent } from './cadastro-receita.component';

describe('CadastroReceitaComponent', () => {
  let component: CadastroReceitaComponent;
  let fixture: ComponentFixture<CadastroReceitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroReceitaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroReceitaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
