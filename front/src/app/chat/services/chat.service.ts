import { Socket } from 'ngx-socket-io';
import { BehaviorSubject ,Observable,Subject} from 'rxjs';
import { Injectable,inject } from '@angular/core';
import {HttpClient} from  '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private Port = environment.PORT;
  private baseUrl: string;


  private _users$ = new BehaviorSubject<UserType[]>([
    // {
    //   name: 'TypeScript',
    //   slogan: 'Soy muy estricto! 😉',
    //   avatar: 'https://cdn.worldvectorlogo.com/logos/typescript-2.svg',
    //   id: 'ts',
    // },

  ]);
  public users$ = this._users$.asObservable();

  //public _userCount$ = new BehaviorSubject<number>(0);
  public _userCount$ = this._users$.getValue().length;
  private _chat$ = new BehaviorSubject<ChatType[]>([]);
  public chat$ = this._chat$.asObservable();

  private _room$ = new BehaviorSubject<string | null>(null);
  private username:String = '';

  // Obtener el username del token o asignar 'Anonimo' si no existe




  constructor(private socket: Socket) {
    this.baseUrl = `${this.apiUrl}:444/api/mensajes`;

    socket.fromEvent('new_message').subscribe((data:any) => {
      console.log("data de ingrso:",data);
      const { _id,message, username ,date} = data;
      const image = null;
      const chatObject: ChatType = {
        user: {
          avatar: '',
          name: username,
          id: _id,
          slogan: '',
        },
        message,
        image,
        validImage : false,
        date
      };
      this.setChat(chatObject);
    });

    socket.fromEvent('new_message_with_image').subscribe((data:any) => {
      console.log("data de ingreso:",data);
      const { _id,message, username ,image,date} = data
      console.log('image en el chatservice: ',image);
      const chatObject: ChatType = {
        user: {
          avatar: '',
          name: username,
          id: _id,
          slogan: '',
        },
        message,
        image,
        validImage : true,
        date
      };
      this.setChat(chatObject);
    });

    // socket.fromEvent('disconnect').subscribe(() => {
    //   const lastRoom = this._room$.getValue();
    //   if (lastRoom) this.joinRoom(lastRoom);
    // });
    
    socket.fromEvent('users_change').subscribe((users:any) => {
      this._users$.next(users);
    });

    socket.fromEvent('leave_user').subscribe(() => {
    
      this.getUsersCount();
    });

    socket.fromEvent('mensajeSala').subscribe((data:any) => {
      data.forEach((item: any) => {
      console.log(item);
      const {_id,contenido, image,username ,fecha} = item;
      const message = contenido;
      const date = fecha;
      var validImage = true;
      if (image != ''){
        validImage= true;
      }
      else{
        validImage = false;
      }
      
      const chatObject: ChatType = {
        user: {
          avatar: '',
          name: username,
          id: _id,
          slogan: '',
        },
        message,
        image,
        validImage,
        date
      };
      this.setChat(chatObject);

        // Aquí puedes realizar las operaciones que necesites para cada elemento de la lista
      });

      socket.fromEvent<string>("mensajeBorrado").subscribe((mensajeId) => {
        // Lógica para manejar el evento de borrado
        console.log(`Mensaje con ID ${mensajeId} fue eliminado en otro cliente.`);
        this.eliminarMensaje(mensajeId);
      });
    });
  }


  public setUser(user: UserType): void {
    const current = this._users$.getValue();
    const state = [...current, user];
    this._users$.next(state);
  }

  public setChat(message: ChatType): void {
    //console.log('verificando el isValid: ',message);
    const current = this._chat$.getValue();
    const state = [...current, message];
    this._chat$.next(state);
  }

  public initChat(): void {

    this._chat$.next([]);
  }

  //TODO Enviar mensaje desde el FRONT-> BACKEND
  sendMessage(payload: {username:string, message: string, room?:string }) {
    const roomCurrent = this._room$.getValue();//TODO: js, ts, node
    if (roomCurrent) {
      payload = { ...payload,room: roomCurrent };
      console.log(roomCurrent);
      this.socket.emit('event_message', payload); //TODO FRONT
    }
  }
  sendMessageWithImage(payload: {username:string, message: string ,room?:string,_id?:any },image?:any) {
    const roomCurrent = this._room$.getValue();//TODO: js, ts, node
    if (roomCurrent) {
      const formData = new FormData();
      formData.append('file', image || '');
      formData.append('username', payload.username || '');
      formData.append('message', payload.message || '');
      formData.append('room', roomCurrent || '');
      payload = { ...payload,room: roomCurrent };     
    // Imprimir el contenido de FormData
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    // Realizar la solicitud POST
    this.httpClient.post<any>(`${this.baseUrl}/enviarMensaje-with-image`, formData)
      .subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          // Obtener el ID del mensaje de la respuesta
          const messageId = response.messageId;

          // Actualizar el payload con el _id obtenido
          payload._id = messageId;
          console.log("MENSAJE ID",messageId);

          // Emitir el evento con el payload actualizado
          this.socket.emit('event_message_with_image', payload);

          // Puedes hacer más cosas aquí con la respuesta si es necesario
        },
        (error) => {
          console.error('Error al enviar la solicitud POST:', error);
          // Manejar errores si es necesario
        }
      );
    }
  }

  joinRoom(room: string,username:string): void {
    this.username = username;
    console.log(username);
    this._room$.next(room);
    console.log("room:",this._room$.getValue())
    const payload = {room,username}
    this.socket.emit('event_join', payload);
  }

  leaveRoom(): void {
    const room = this._room$.getValue();
    const username = this.username;
    const payload = {room,username};
    this.socket.emit('event_leave', payload);
    this.getUsersCount();
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }
  deleteMessage(mensajeId:string) {
    this.socket.emit('borrarMensaje',mensajeId);
  }

  getDateNow() {
    this.socket.emit('getDateNow'); // Emite el evento para obtener la fecha del backend
    return this.socket.fromEvent('getDate'); // Devuelve el observable del evento 'getDate'
  }

  public eliminarMensaje(mensajeId: string): void {
    // Filtra los mensajes para excluir el mensaje con el ID proporcionado
    const mensajesActuales = this._chat$.getValue();
    const mensajesFiltrados = mensajesActuales.filter((mensaje) => mensaje.user.id !== mensajeId);

    // Actualiza el estado de la conversación con los mensajes filtrados
    this._chat$.next(mensajesFiltrados);
  }

  public getUsersCount(){
    this.socket.emit('usersCount');
   
    console.log(this.socket.fromEvent('getUsersCount'))
    return this.socket.fromEvent('getUsersCount');
  }
}

interface UserType {
  name: string;
  avatar: string;
  slogan: string;
  id: string;
}

interface ChatType {
  user: UserType;
  message: string;
  date:Date;
  image:any;
  validImage:boolean;
}

