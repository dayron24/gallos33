import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule,NgIf } from '@angular/common';
import { UsersService } from '../services/users.service';
import { FormControl, FormGroup,FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciardor-streams',
  templateUrl: './iniciardor-streams.component.html',
  styleUrls: ['./iniciardor-streams.component.css'],
  standalone:true,
  imports:[MenuComponent,CommonModule,FormsModule,NgIf,ReactiveFormsModule],
})
export class IniciardorStreamsComponent {
  formulario : FormGroup;
  imagePreview: string | null = null;
  public claveStream = '';
  public urlStream = '';
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
  ){
    this.formulario = new FormGroup({
      tituloStream: new FormControl(),
      image: new FormControl(),
      numeroStream: new FormControl()
    });
  }
  public image:any;
  handleImageChange(event: any): void {
    const input = event.target;
    const file = input.files[0];
    this.image = input.files[0];;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
    }
  }

  async onSubmit() {
    console.log("Inicio de sesión");

    var url = 'rtmp://64.23.244.141';
    const selectorValue = this.formulario.get('numeroStream')?.value;

    let fechaActual = new Date();

    // Obtiene el día, mes y año actual
    let dia = fechaActual.getDate();
    let mes = fechaActual.getMonth() + 1; // Los meses se indexan desde 0, por lo que se agrega 1
    let año = fechaActual.getFullYear();
    
    // Formatea la fecha como "dd/mm/yyyy"
    let fechaFormateada = `${dia}-${mes}-${año}`;
    let tituloStream = this.formulario.get('tituloStream')?.value;
  
    if (selectorValue == 1) {
      
      this.claveStream = `Stream1-${fechaFormateada}`;
      this.urlStream = `${url}:${1935}/live`
      const response = await this.usersService.setClaveStream('1',tituloStream,this.image,this.claveStream);
      alert(response.data);

    } else if (selectorValue == 2) {
      this.claveStream = `Stream2-${fechaFormateada}`;
      this.urlStream = `${url}:${1936}/live`
      const response = await this.usersService.setClaveStream('2',tituloStream,this.image,this.claveStream);

      alert(response.data);
      
    } else if (selectorValue == 3) {
      this.claveStream = `Stream3-${fechaFormateada}`;
      this.urlStream = `${url}:${1937}/live`
      const response = await this.usersService.setClaveStream('3',tituloStream,this.image,this.claveStream);


      alert(response.data);
  
    }
  }
  Volver(){
    this.router.navigate([`/Admin`]);
  }

}
