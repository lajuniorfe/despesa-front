import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroModal } from './cadastro-modal';

describe('CadastroModal', () => {
  let component: CadastroModal;
  let fixture: ComponentFixture<CadastroModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
