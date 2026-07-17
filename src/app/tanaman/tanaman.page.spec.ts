import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TanamanPage } from './tanaman.page';

describe('TanamanPage', () => {
  let component: TanamanPage;
  let fixture: ComponentFixture<TanamanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TanamanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
