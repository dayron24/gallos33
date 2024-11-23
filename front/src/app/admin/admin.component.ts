import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { UsersService } from '../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone:true,
  imports:[MenuComponent,CommonModule],
})
export class AdminComponent {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private route: ActivatedRoute,
  
   
  ) {}
  irChats()
  {
    this.router.navigate([`/Panel`]);
  }
  irRegistro(){
    this.router.navigate(['/Register']);
  }
  irUsuarios(){
    this.router.navigate(['/Usuarios']);
  }
  irIniciarStream(){
    this.router.navigate(['/IniciarStream']);
  }
  irPM2(){
    this.router.navigate(['/Reiniciar']);
  }


  isSidebarOpen = false;
  username: string = localStorage.getItem('nombreUsuario') ?? '';
  userPhoto: string = this.getImage(this.username);

  public getImage(username: string): any {

    return this.usersService.getImageUrl(username);
  }


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

    // Navigate to the dynamic route based on the 'user' parameter

    this.router.navigate([`Login`]);
    // Otra lógica de cierre de sesión que puedas necesitar...
  }
  inicio(){
    this.router.navigate([`/`]);
  }
  
}
