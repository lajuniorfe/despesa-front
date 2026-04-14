import { TestBed } from '@angular/core/testing';

import { TipoCategoriaUtilService } from './tipo-categoria-util.service';

describe('TipoCategoriaUtilService', () => {
  let service: TipoCategoriaUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoCategoriaUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
