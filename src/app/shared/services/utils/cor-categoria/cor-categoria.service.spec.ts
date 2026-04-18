import { TestBed } from '@angular/core/testing';

import { CorCategoriaService } from '../cor-categoria.service';

describe('CorCategoriaService', () => {
  let service: CorCategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorCategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
