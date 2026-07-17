import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanenPage } from './panen.page';

describe('PanenPage', () => {
  let component: PanenPage;
  let fixture: ComponentFixture<PanenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
