import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioDespesaComponent } from './relatorio-despesa.component';

describe('RelatorioDespesaComponent', () => {
  let component: RelatorioDespesaComponent;
  let fixture: ComponentFixture<RelatorioDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioDespesaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioDespesaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
