import { Component ,OnInit} from '@angular/core';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class UsuariosComponent implements OnInit {
  users: any[] = []; // Asegúrate de ajustar el tipo de datos según la estructura de tu modelo de usuario
  editingUser: any = null;
  editedUser: any = {};
  image: any = null;
  showDeleteModal: boolean = false;
  selectedUser: any = null;
  filteredUsers: any[] = [];
  searchTerm: string = '';
  
  constructor(private userService: UsersService,private router:Router) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = this.sortUsersAlphabetically(users);
      this.filteredUsers = this.users; // Inicializa filteredUsers con todos los usuarios
    });
  }

  // Función para filtrar usuarios
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openEditMenu(user: any): void {
    this.editingUser = user;
    // Copia los valores del usuario para la edición
    this.editedUser = { ...user };
  }

  handleImageChange(event: any): void {
    const input = event.target;
    const file = input.files[0];
    this.image = input.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     this.imagePreview = reader.result as string;
    //   };
    //   reader.readAsDataURL(file);
    // } else {
    //   this.imagePreview = null;
    // }
  }

  saveChanges(user: any): void {
    // Llama a tu servicio para guardar los cambios en el usuario
    if (this.image != null) {
      this.userService.editUserImage(user._id, this.editedUser,this.image).subscribe(() => {
        this.editingUser = null;
          this.userService.getUsers().subscribe(users => this.users = users);
          alert("Usuario actualizado!");
      });
    }
    else{
    this.userService.editUser(user._id, this.editedUser).subscribe(() => {
      this.editingUser = null;
        this.userService.getUsers().subscribe(users => this.users = users);
        alert("Usuario actualizado!");
    });
  }
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  getImage(username: string): any {

    return this.userService.getImageUrl(username);
  }
  volver(){
    this.router.navigate([`/Admin`]);
  }

  private sortUsersAlphabetically(users: any[]): any[] {
    return users.sort((a, b) => {
      if (a.username.toLowerCase() < b.username.toLowerCase()) {
        return -1;
      }
      if (a.username.toLowerCase() > b.username.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
  estadoBan(user:any) :String{
    if (user.rol === 'baneado'){
      return 'Desbanear'
    }
    else{
      return 'Banear'
    }
  }
  async banearUsuario(user:any){
    if (user.rol === 'baneado'){
      this.userService.desBanUser(user.username).subscribe(() => {
        this.userService.getUsers().subscribe(users => this.users = users);
        alert("Usuario desbaneado!");
      });
    }
    else{
      this.userService.banUser(user.username).subscribe(() => {
        this.userService.getUsers().subscribe(users => this.users = users);
        alert("Usuario baneado!");
      });
    }

  }
  async eliminarUsuario(user:any){

      this.userService.deleteUser(user.username).subscribe(() => {
        alert("usuario eliminado");
        this.userService.getUsers().subscribe(users => this.users = users);
        
      });
  }
  openDeleteConfirm(user: any): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  confirmDelete(): void {
    if (this.selectedUser) {
      this.userService.deleteUser(this.selectedUser.username).subscribe(() => {
        alert("Usuario eliminado");
        this.userService.getUsers().subscribe(users => this.users = users);
        this.closeDeleteModal();
      });
    }
  }
}
