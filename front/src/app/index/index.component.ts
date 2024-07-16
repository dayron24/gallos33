import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; //
import { Router } from '@angular/router';
import {inject } from '@angular/core';
import {UsersService} from '../services/users.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './index.html',
  styleUrls: ['./index.component.css'],
  standalone:true,
  imports:[MenuComponent]
})
export class IndexComponent implements OnInit {

  @ViewChild('videoPlayer', { static: true }) private readonly videoElement: ElementRef<HTMLVideoElement> | any;
  claveActual: string | undefined;
  claveStream: string | undefined;

  constructor(
    private userService: UsersService,
    private router: Router
  ) {

  }
  titulo1 = ""
  titulo2 = ""
  titulo3 = ""
  public imagen1 = ''
  imagen2 = ''
  public imagen3 = ''
  clave1=''
  clave2=''
  clave3=''
  async ngOnInit(): Promise<void> {
    await this.userService.getClaveStream('1').subscribe(
      (resultado: any) => {
        console.log(resultado.stream.clave);
        this.titulo1 = resultado.stream.titulo;
        this.clave1 = resultado.stream.clave;
        
      },
      (error:any) => {
        console.error('Error al obtener la clave del stream:', error);
      }
    );
    await this.userService.getClaveStream('2').subscribe(
      (resultado: any) => {
        console.log(resultado.stream.clave);
        this.titulo2 = resultado.stream.titulo;
        this.clave2 = resultado.stream.clave;
        
      },
      (error:any) => {
        console.error('Error al obtener la clave del stream:', error);
      }
    );
    await this.userService.getClaveStream('3').subscribe(
      (resultado: any) => {
        console.log(resultado.stream.clave);
        this.titulo3 = resultado.stream.titulo;
        this.clave3 = resultado.stream.clave;
        
      },
      (error:any) => {
        console.error('Error al obtener la clave del stream:', error);
      }
    );
    
    this.imagen1 = this.userService.getImagenStream('1');
    this.imagen2 = this.userService.getImagenStream('2');
    this.imagen3 = this.userService.getImagenStream('3');
  }
  ngAfterViewInit(): void {
    // Accede al elemento del video y llama al método play() para reproducir el video
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    video.play();
  }
  irPanel()
  {
    this.router.navigate([`/Admin`]);
  }
  async irStream1 ()
  {
    var claveStream = '';
    await this.userService.getClaveStream('1').subscribe(
      (resultado: any) => {
        this.router.navigate([`/live/${resultado.stream.clave}/443`]);
        
      },
      (error:any) => {
        console.error('Error al obtener la clave del stream:', error);
      });
    console.log(`/live/${this.clave1}`)
    
  }
  async irStream2 ()
  {
    var claveStream = '';
    await this.userService.getClaveStream('2').subscribe(
      (resultado: any) => {
        this.router.navigate([`/live/${resultado.stream.clave}/442`]);
        
      },
      (error:any) => {
        console.error('Error al obtener la clave del stream:', error);
      });
    console.log(`/live/${this.clave2}`)
    
  }
  async irStream3 ()
  {
    var claveStream = '';
    await this.userService.getClaveStream('3').subscribe(
      (resultado: any) => {
        this.router.navigate([`/live/${resultado.stream.clave}/441`]);
        
      },
      (error:any) => {
        console.error('Error al obtener la clave del stream:', error);
      });
    console.log(`/live/${this.clave3}`)
    
  }
}
