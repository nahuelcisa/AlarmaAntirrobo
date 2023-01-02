import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform, private router: Router) {
    this.initializeApp();
  }


  public initializeApp(){
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        SplashScreen.hide();
        this.router.navigateByUrl("splash");
      },2000);
    })
  }
}
