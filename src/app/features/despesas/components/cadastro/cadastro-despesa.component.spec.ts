import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroDespesaComponent } from './cadastro-despesa.component';

describe('CadastroComponent', () => {
  let component: CadastroDespesaComponent;
  let fixture: ComponentFixture<CadastroDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDespesaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroDespesaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
