import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TambahberitaPage } from './tambahberita.page';

describe('TambahberitaPage', () => {
  let component: TambahberitaPage;
  let fixture: ComponentFixture<TambahberitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TambahberitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
