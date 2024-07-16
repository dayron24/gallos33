import { MenuComponent } from './../../../menu/menu.component';
import { Component, OnInit ,OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UsersChatComponent } from '../../components/users-chat/users-chat.component';
import { UsersRoomsComponent } from '../../components/users-rooms/users-rooms.component';
import { VideoPlayerComponent } from 'src/app/reproductor/reproductor.component';
import { UsersTypeComponent } from '../../components/users-type/users-type.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { CommonModule } from '@angular/common';
import { Subscription,of,Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-chat-page',
    templateUrl: './chat-page.component.html',
    styleUrls: ['./chat-page.component.css'],
    standalone: true,
    imports: [UsersRoomsComponent,CommonModule, UsersChatComponent,UsersTypeComponent,VideoPlayerComponent,MenuComponent],
})
export class ChatPageComponent implements OnInit,OnDestroy{
  public textButton = 'desactivar scroll'
  constructor(private usersService: UsersService,
    private route: ActivatedRoute,private router: Router,
    private chatService: ChatService,
    private sharedService: SharedService
  ) {}
  private chatSubscription: Subscription | undefined;
  private booleanStateSubscription: Subscription | undefined;
  ngOnInit(): void {
    this.route.params.subscribe( params=> {//TODO js, ts, node
      const variableValue = params['sala'];
      this.chatService.leaveRoom();
      this.chatService.initChat();
      console.log(variableValue);
      const username:string= localStorage.getItem("nombreUsuario") || "";
      this.chatService.joinRoom(variableValue,username); //voy a trtar de usar solo un canal
    });
    this.chatSubscription = this.chatService.getUsersCount().subscribe((count: any) => {
      // Lógica que quieres ejecutar cuando chat$ se actualiza
      this.connectedUsers = count;
    });
    this.booleanStateSubscription = this.sharedService.currentBooleanState.subscribe(state => {
      this.textButton = state ? 'activar scroll' : 'desactivar scroll';
    });
  
  }
  ngOnDestroy() {
    this.chatSubscription?.unsubscribe();
    this.booleanStateSubscription?.unsubscribe();
  }


  public connectedUsers:any;
  isSidebarOpen = false;
  username: string = localStorage.getItem('nombreUsuario') ?? '';
  userPhoto: string = this.getImage(this.username);

  public getImage(username: string): any {

    return this.usersService.getImageUrl(username);
  }

  userService = inject(UsersService);
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    // Puedes agregar lógica para cerrar la sesión aquí si es necesario
  }
  logout() {
    // Lógica para cerrar sesión, por ejemplo, limpiar tokens y redirigir a la página de inicio de sesión.
    // Aquí también puedes agregar la lógica para limpiar cualquier otro dato que necesites.
    localStorage.removeItem('tokenLogin');
    localStorage.removeItem('nombreUsuario');
    const userParam = this.route.snapshot.paramMap.get('sala');
    // Navigate to the dynamic route based on the 'user' parameter

    this.router.navigate([`/`]);
    // Otra lógica de cierre de sesión que puedas necesitar...
  }
  inicio(){
    this.router.navigate([`/`]);
  }
  esAdmin(): boolean {
    // Ejemplo de condición, ajusta según tus necesidades

    const nombreUsuario = localStorage.getItem("nombreUsuario")

    const esNombreValido = nombreUsuario === "Dayron" || nombreUsuario === "Charal";

    return esNombreValido;
  }
  toggleBooleanState() {
    this.sharedService.currentBooleanState.pipe(take(1)).subscribe(state => {
      this.sharedService.changeBooleanState(!state);
    });
    
  }
}
