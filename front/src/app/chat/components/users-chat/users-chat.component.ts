
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UsersTypeComponent } from '../users-type/users-type.component';
import { NgFor, AsyncPipe } from '@angular/common';
import { ElementRef ,ViewChild} from '@angular/core';
import { Subscription,of,Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService } from './../../../services/users.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SharedService } from 'src/app/services/shared.service';


@Component({
    selector: 'app-users-chat',
    templateUrl: './users-chat.component.html',
    styleUrls: ['./users-chat.component.css'],
    standalone: true,
    imports: [NgFor, UsersTypeComponent, AsyncPipe, CommonModule]
})
export class UsersChatComponent implements OnInit, OnDestroy {
  private chatSubscription: Subscription | undefined;
  @ViewChild('chatContainer', { read: ElementRef })
  chatContainer: ElementRef | undefined;
  public scrollable: boolean = true;
  public chat$ = this.chatService.chat$;

  constructor(
    private chatService: ChatService,
    private usersService: UsersService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sharedService.currentBooleanState.subscribe(state => {
      this.scrollable = !state;
    });

    this.chatSubscription = this.chatService.chat$.subscribe(messages => {

      if (this.scrollable) {
        this.scrollToBottom();
      }
      this.cd.detectChanges(); // Detectar cambios manualmente
    });
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  sanitizeMessage(message: string): string {
    var result = message;
    if (!message.startsWith('http://') && !message.startsWith('https://')) {
      result = 'https://' + message;
    }
    return result;
  }

  isValidLink(str: string): boolean {
    const urlPattern = new RegExp(
      '^(?:https?:\\/\\/)?' +
      '((?:[a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' +
      '(?::\\d+)?(?:\\/[-a-z\\d%_.~+]*)*' +
      '(?:\\?[;&a-z\\d%_.~+=-]*)?' +
      '(?:#[-a-z\\d_]*)?$', 'i'
    );
    return urlPattern.test(str);
  }

  public formatDate(date: Date): string {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMin = Math.round(diffMs / 60000);

    if (diffMin < 1) {
      return 'hace unos segundos';
    } else if (diffMin === 1) {
      return 'hace 1 minuto';
    } else if (diffMin < 60) {
      return `hace ${diffMin} minutos`;
    } else if (diffMin < 120) {
      return 'hace 1 hora';
    } else if (diffMin < 1440) {
      const diffHrs = Math.floor(diffMin / 60);
      return `hace ${diffHrs} horas`;
    } else if (diffMin < 2880) {
      return 'hace 1 día';
    } else {
      const diffDays = Math.floor(diffMin / 1440);
      return `hace ${diffDays} días`;
    }
  }

  public getImage(username: string): any {
    return this.usersService.getImageUrl(username);
  }

  public getImageMsj(id: string): any {
    const response = this.usersService.getImageMsj(id);
    return response;
  }

  public mensajeConImagen(image: any): boolean {
    return image !== '';
  }

  private scrollToBottom(): void {
    const containerElement = this.chatContainer?.nativeElement || null;
    if (containerElement) {
      setTimeout(() => {
        containerElement.scrollTop = containerElement.scrollHeight;
      }, 0);
    }
  }

  eliminarMensaje(mensajeId: string) {
    console.log(`Eliminar mensaje con ID: ${mensajeId}`);
    this.chatService.deleteMessage(mensajeId);
  }

  puedeEliminarMensajes(): boolean {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    return nombreUsuario === "Dayron" || nombreUsuario === "Charal";
  }
}
