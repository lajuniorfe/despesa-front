import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoRelatorioComponent } from './grafico-relatorio.component';

describe('GraficoRelatorioComponent', () => {
  let component: GraficoRelatorioComponent;
  let fixture: ComponentFixture<GraficoRelatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoRelatorioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoRelatorioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
