import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PekerjaPage } from './pekerja.page';

describe('PekerjaPage', () => {
  let component: PekerjaPage;
  let fixture: ComponentFixture<PekerjaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PekerjaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
