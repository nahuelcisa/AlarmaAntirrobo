import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  apretado: boolean = false;

  activado:boolean = false;

  clave:string;

  accelerationX: any;
  accelerationY: any;
  accelerationZ: any;
  subscription: any;


  audioIzquierda = "../../../assets/sonidos/audioIzquierda.mp3";
  audioDerecha = "../../../assets/sonidos/audioDerecha.mp3";
  audioVertical = "../../../assets/sonidos/audioVertical.mp3";
  audioHorizontal = "../../../assets/sonidos/audioHorizontal.mp3";
  audio = new Audio();

  primerIngreso: boolean = true;
  primerIngresoFlash: boolean = true;

  posicionActualCelular = 'actual';
  posicionAnteriorCelular = 'anterior';


  constructor(
    private auth: AngularFireAuth, 
    private router: Router,
    public toast: ToastController, 
    private flashlight: Flashlight,
    private vibration: Vibration,
    private screenOrientation: ScreenOrientation,
    private deviceMotion: DeviceMotion) {}

  activarAlarma(){
    this.apretado = true;
    setTimeout(() => {
      this.activado = true;
      this.AlertSuccess("Alarma activada con exito.").then((alert : any)=>{
        alert.present();
        this.comenzar();
      });
      this.apretado = false;
    }, 2000);
  }

  apagarAlarma(){
    if(this.clave == '123456'){
      this.apretado = true;
      setTimeout(() => {
        this.activado = false;
        this.AlertSuccess("Alarma desactivada con exito.").then((alert : any)=>{
          this.subscription.unsubscribe();
          alert.present();
          this.primerIngreso = true;
          this.audio.pause();
        });
        this.apretado = false;
        this.clave = "";
      }, 2000);
    }else{
      this.Alert("Contraseña incorrecta.").then((alert : any)=>{
        alert.present();
      });
    }
  }

  comenzar(){
    

    this.subscription = this.deviceMotion.watchAcceleration({ frequency: 300 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.accelerationX = Math.floor(acceleration.x);
      this.accelerationY = Math.floor(acceleration.y);
      this.accelerationZ = Math.floor(acceleration.z);

      if(acceleration.x > 5){
        //Inclinacion Izquierda
        
        this.posicionActualCelular = 'izquierda';
        this.movimientoIzquierda();
      }
      else if (acceleration.x < -5) {
        //Inclinacion Derecha
        
        this.posicionActualCelular = 'derecha';
        this.movimientoDerecha();        
      }
      else if (acceleration.y >= 9) {
        //encender flash por 5 segundos y sonido
        this.posicionActualCelular='arriba';
        
        if ((this.posicionActualCelular!=this.posicionAnteriorCelular)) {
          this.audio.src = this.audioVertical;
          this.posicionAnteriorCelular = 'arriba';
        }
        this.audio.play();
        this.movimientoVertical();
      }

      else if (acceleration.z >= 9 && (acceleration.y >= -1 && acceleration.y <= 1) && (acceleration.x >= -1 && acceleration.x <= 1)) {
        //acostado vibrar por 5 segundos y sonido
        this.posicionActualCelular='plano';
        this.movimientoHorizontal();
      }


    });
  }

  movimientoIzquierda(){
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if(this.posicionActualCelular!=this.posicionAnteriorCelular){
      this.posicionAnteriorCelular = 'izquierda';
      this.audio.src = this.audioIzquierda;
    }
    this.audio.play();
  }

  movimientoDerecha(){
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if(this.posicionActualCelular!= this.posicionAnteriorCelular){
      this.posicionAnteriorCelular = 'derecha';
      this.audio.src = this.audioDerecha;
    }
    this.audio.play();
  }

  movimientoVertical(){
    if(this.primerIngresoFlash){
      this.primerIngresoFlash ? this.flashlight.switchOn() : false;
      setTimeout(() => {
        this.primerIngresoFlash = false;
        this.flashlight.switchOff();
      }, 5000);
      this.primerIngreso = false;
    }
  }

  movimientoHorizontal(){
    if(this.posicionActualCelular!=this.posicionAnteriorCelular){
      this.posicionAnteriorCelular='plano';
      this.audio.src = this.audioHorizontal;
    }

    this.primerIngreso ? null : this.audio.play();
    this.primerIngreso ? null : this.vibration.vibrate(5000);
    this.primerIngreso = true;
    this.primerIngresoFlash = true;
  }

  logOut(){
    this.auth.signOut().then(()=>{

      this.apretado = true;

      setTimeout(()=>{
        
        this.router.navigate(["/login"]);

        this.apretado = false;
        
      },2000);
    });
  }

  Alert(message : string)
  {
    return this.toast.create({
            header: 'Error',
            message: message,
            buttons: ['Ok'],
            position: 'top',
            color: 'danger'
    });
  }
  AlertSuccess(message : string)
  {
    return this.toast.create({
            header: 'Exito',
            message: message,
            buttons: ['Ok'],
            position: 'top',
            color: 'success'
    });
  }

}
