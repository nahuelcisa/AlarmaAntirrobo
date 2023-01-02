import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toastController } from '@ionic/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  clave: string;
  apretado: boolean = false;

  constructor(private auth: AngularFireAuth, private router: Router, public toast: ToastController) { }

  ngOnInit() {
  }

  inicioRapido(a){
    switch (a) {
      case 1:
        this.email = "usuarioTest@gmail.com";
        this.clave = "123456";
      break;

      case 2:
        this.email = "adminTest@gmail.com";
        this.clave = "123456";
      break;

      case 3:
        this.email = "invitadoTest@gmail.com";
        this.clave = "123456";
      break;
    }
  }

  iniciarSesion(){
    this.auth.signInWithEmailAndPassword(this.email, this.clave).then(()=>{

      this.apretado = true;

      setTimeout(()=>{
        
        this.router.navigate(["/home"]);

        this.apretado = false;
      },2000);


    }).catch((response)=>{
      if(response.code == "auth/wrong-password" || response.code == "auth/wrong-email" || response.code == "auth/invalid-email" ){
          this.Alert("Correo o clave invalida.").then((alert : any)=>{
            alert.present();
          });
      }else if(response.code == "auth/missing-email"){
        this.Alert("Correo vacio.").then((alert : any)=>{
          alert.present();
        })
      }else if(response.code == "auth/missing-password" || response.code == "auth/internal-error"){
        this.Alert("Clave vacia.").then((alert : any)=>{
          alert.present();
        })
      }else if(response.code == "auth/user-not-found"){
        this.Alert("Correo inexistente.").then((alert : any)=>{
          alert.present();
        })
      }
    });
  }

  Alert(message : string)
  {
    return this.toast.create({
            header: 'Error',
            message: message,
            buttons: ['Ok'],
            position: 'top'
    });
  }
}
