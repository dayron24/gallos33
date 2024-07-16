import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BehaviorSubject ,Observable,Subject} from 'rxjs';
import axios from 'axios';
import FormData from 'form-data';
import * as path from 'path';
require('dotenv').config();
const URL = process.env.URL || 'http://localhost:3000';

@WebSocketGateway(81, {
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  public URI = `${URL}/api/mensajes`;
  
  
  afterInit(server: any) {
   
    console.log('Esto se ejecuta cuando inicia');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Hola alguien se conecto al socket 👌👌👌');
 
 
  }

  handleDisconnect(client: any) {
    
    const connectedClients = this.server.engine.clientsCount;
   this.server.emit('leave_user');
    
  
  }



@SubscribeMessage('event_join')
async handleJoinRoom(client: Socket, payload: any) {
  const {room, username} = payload;
  client.join(`room_${room}`);

  try {
    // Hacer una solicitud GET al servidor para obtener la lista de mensajes
    const response = await axios.get(`${this.URI}/obtenerMensajesBySala/${room}`);
    
    // Enviar los mensajes al cliente que se unió a la sala
    client.emit('mensajeSala', response.data);
    //this.server.to(`room_${room}`).emit('new_user');
    
    console.log(response.data);
  } catch (error) {
    console.error('Error al obtener la lista de mensajes:', error);
  }
}

@SubscribeMessage('event_message') //TODO Backend
handleIncommingMessage(
  client: Socket,
  payload: { username:string; message: string;date:Date ; room: string },
) {

  console.log("payload:", payload);
  const { username,message,room } = payload;
  const date = new Date();
const mensajeToDB = {username,message,room,date};

axios.post(`${this.URI}/enviarMensaje`, mensajeToDB)
  .then(response => {
    console.log('Solicitud POST exitosa:', response.data.messageId);
    const _id = response.data.messageId;
    console.log('id: ',_id);
    const image = '';
    const data = {_id,username,message,image,date};
    console.log("data:", data);
    this.server.to(`room_${room}`).emit('new_message',  data);
  })
  .catch(error => {
    console.error('Error al enviar la solicitud POST:', error);
  });

};


@SubscribeMessage('event_message_with_image') //TODO Backend
handleIncommingMessageImage(
  client: Socket,
  payload: { username:string; message: string;date:Date ; room: string;_id:any },
) {

  console.log("payload:", payload);
  const {_id, username,message,room } = payload;
  const date = new Date();
  console.log(`${this.URI}/get-image-path/${_id}`);
  // axios.get(`${this.URI}/get-image-path/${_id}`)
  // .then(response => {
   // console.log('Solicitud POST exitosa:', response.data.imagePath);
   // const image = response.data.imagePath;
   // console.log(image);
    const image = 'image';
    const data = {_id,username,message,image,date};
    console.log("data:", data);
    this.server.to(`room_${room}`).emit('new_message_with_image',  data);
//   });
  //});
};


  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room:string) {
    console.log(`chao room_${room}`)
    client.leave(`room_${room}`);
    //this.server.to(`room_${room}`).emit('leave_user');
    
  }

  @SubscribeMessage('getDateNow') // Nuevo evento para obtener la fecha en el backend
  handleGetDateNow(client: Socket) {
    const currentDate = new Date();
    client.emit('getDate', currentDate);
  }
  @SubscribeMessage('borrarMensaje')
  async handleBorrarMensaje(client: Socket, mensajeId: string) {
    try {
      // Lógica para borrar el mensaje en el backend y la base de datos
      // ...

      // Emitir evento a todos los clientes para que actualicen sus listas
      this.server.emit('mensajeBorrado', mensajeId);
      axios.delete(`${this.URI}/borrarMensaje/${mensajeId}`);
    } catch (error) {
      console.error('Error al borrar el mensaje:', error);
    }
  }

  @SubscribeMessage('usersCount') // Nuevo evento para obtener la fecha en el backend
  handleUsersCount(client: Socket) {
  const connectedClients = this.server.engine.clientsCount;
  console.log(connectedClients);
  this.server.emit('getUsersCount', connectedClients);
  }
}
