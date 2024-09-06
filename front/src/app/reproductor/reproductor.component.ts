
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import HLS from 'hls.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  private hls = new HLS();
  public user: string | null = 'HOME' //TODO: User que se pasa por la url como parametro !
  public port: string | null = '443'
  private playing: boolean = false;
  @ViewChild('video', { static: true }) private readonly video: ElementRef<HTMLVideoElement> | any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void{
    try {
      this.user = this.route.snapshot.paramMap.get('sala') || 'HOME';
      this.port = this.route.snapshot.paramMap.get('port') || '443';
      this.load(`${this.apiUrl}:${this.port}/live/${this.user}/index.m3u8`);
      console.log("Despues de cargar",this.user);
      console.log("Despues de cargar",this.port);
      //this.video.nativeElement.play();
    } catch (error) {
      console.error('Error loading video:', error);
    }
  }
  

  public loadInit(): void{
    console.log('El componente se ha inicializado');
  }

  public load(currentVideo: string): void {

    if (HLS.isSupported()) {
      //this.video.nativeElement.muted = true;
      this.loadVideoWithHLS(currentVideo);
    } else {
      this.video.nativeElement.src = currentVideo;
      //this.video.nativeElement.muted = true;
      //this.video.nativeElement.setAttribute('playsinline', 'true');
      
      // this.video.nativeElement.addEventListener('loadedmetadata', () => {
      //   // Aquí puedes buscar el segmento más reciente y establecer el tiempo actual del video
      //   this.video.nativeElement.currentTime = this.video.nativeElement.duration;
        
      //   // Iniciar la reproducción después de configurar el tiempo actual
      //   this.video.nativeElement.play();
      // });
    }

  }

  private loadVideoWithHLS(currentVideo: string) {
    const config = {
      maxBufferLength: 30,  // Configura un buffer máximo de 30 segundos
      maxMaxBufferLength: 60, // Buffer máximo de 60 segundos
      initialLiveManifestSize: 3 // Número de fragmentos iniciales que cargará HLS.js
    };
  
    this.hls = new HLS(config);  // Inicializa HLS con el nuevo config
    this.hls.loadSource(currentVideo);
    this.hls.attachMedia(this.video.nativeElement);
    
    this.video.nativeElement.addEventListener('loadedmetadata', () => {
      // Aquí puedes buscar el segmento más reciente y establecer el tiempo actual del video
      this.video.nativeElement.currentTime = this.video.nativeElement.duration;
      // Iniciar la reproducción después de configurar el tiempo actual
      //this.video.nativeElement.play();
    });
  
    // Manejo de errores de HLS.js
    this.hls.on(HLS.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case HLS.ErrorTypes.NETWORK_ERROR:
            console.error("Error de red: ", data);
            this.hls.startLoad(); // Intenta cargar el stream de nuevo
            break;
          case HLS.ErrorTypes.MEDIA_ERROR:
            console.error("Error de medios: ", data);
            this.hls.recoverMediaError(); // Intenta recuperar el error de medios
            break;
          default:
            console.error("Error fatal no recuperable: ", data);
            this.hls.destroy(); // Destruye la instancia de HLS si no se puede recuperar
            break;
        }
      }
    });
  }

};