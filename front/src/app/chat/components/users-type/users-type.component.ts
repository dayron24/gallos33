import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Meta } from '@angular/platform-browser';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-users-type',
    templateUrl: './users-type.component.html',
    styleUrls: ['./users-type.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule,NgIf],
})
export class UsersTypeComponent implements OnInit {
  public formMessage = new UntypedFormGroup({
    message: new UntypedFormControl('')
  });
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public image:File;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private meta: Meta
  ) {
    
    this.image = new File([], "empty.txt", { type: "text/plain" });
  }

  ngOnInit(): void {
    const room = this.route.snapshot.paramMap.get('id');

    this.formMessage.patchValue({ room });
    
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' });
  }

  sendMessage(): void {
    const username:string = localStorage.getItem('nombreUsuario') || '----'
    //const date: Date = new Date();
    if ((this.formMessage.value['message']  !== null)  && (this.formMessage.value['message']  !== '' ) || (this.image)){

      console.log(this.formMessage.value);

      const { message, room } = this.formMessage.value;
      // Enviar mensaje con imagen si está disponible
      if (this.image && this.image.name !== 'empty.txt') {
        this.chatService.sendMessageWithImage({ username, message, room },this.image);
      } else {
        this.chatService.sendMessage({ username, message, room });
      }
      this.formMessage.controls['message'].reset();
      this.fileInput.nativeElement.value = '';
      this.image = new File([], "empty.txt", { type: "text/plain" });
    }

  }
  selectFile() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.log("File input not available");
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.image = file;
      console.log('Archivo seleccionado:', file);
    }
  }
  esAdmin(): boolean {
    // Ejemplo de condición, ajusta según tus necesidades

    const nombreUsuario = localStorage.getItem("nombreUsuario")

    const esNombreValido = nombreUsuario === "Dayron" || nombreUsuario === "Charal";

    return esNombreValido;
  }

}
