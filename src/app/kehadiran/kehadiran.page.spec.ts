import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KehadiranPage } from './kehadiran.page';

describe('KehadiranPage', () => {
  let component: KehadiranPage;
  let fixture: ComponentFixture<KehadiranPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KehadiranPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
