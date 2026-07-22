import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationPage } from './notifikasi.page';

describe('NotificationPage', () => {
  let component: NotificationPage;
  let fixture: ComponentFixture<NotificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
