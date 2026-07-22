import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbsenPage } from './absen.page';

describe('AbsenPage', () => {
  let component: AbsenPage;
  let fixture: ComponentFixture<AbsenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
