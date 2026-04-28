import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesejoComponent } from './desejo.component';

describe('DesejoComponent', () => {
  let component: DesejoComponent;
  let fixture: ComponentFixture<DesejoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesejoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesejoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
