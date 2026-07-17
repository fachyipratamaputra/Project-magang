import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

// Import semua pages
import { LoginPage } from './login/login.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { ProfilePage } from './profil/profil.page';
import { KehadiranPage } from './kehadiran/kehadiran.page';
import { PekerjaPage } from './pekerja/pekerja.page';
import { PembayaranPage } from './pembayaran/pembayaran.page';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    DashboardPage,
    ProfilePage,
    KehadiranPage,
    PekerjaPage,
    PembayaranPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,  // 🔥 WAJIB ADA
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}