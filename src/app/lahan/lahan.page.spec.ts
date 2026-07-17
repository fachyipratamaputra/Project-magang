import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LahanPage } from './lahan.page';

describe('LahanPage', () => {
  let component: LahanPage;
  let fixture: ComponentFixture<LahanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LahanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
