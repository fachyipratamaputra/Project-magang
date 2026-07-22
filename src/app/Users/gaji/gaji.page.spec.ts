import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GajiPage } from './gaji.page';

describe('GajiPage', () => {
  let component: GajiPage;
  let fixture: ComponentFixture<GajiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GajiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
