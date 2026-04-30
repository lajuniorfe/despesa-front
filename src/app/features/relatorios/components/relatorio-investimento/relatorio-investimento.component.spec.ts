import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioInvestimentoComponent } from './relatorio-investimento.component';

describe('RelatorioInvestimentoComponent', () => {
  let component: RelatorioInvestimentoComponent;
  let fixture: ComponentFixture<RelatorioInvestimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioInvestimentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioInvestimentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
