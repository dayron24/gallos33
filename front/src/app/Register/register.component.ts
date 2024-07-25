import { NgIf } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { Component } from '@angular/core';
import { Injectable,inject } from '@angular/core';
import {UsersService} from '../services/users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[MenuComponent,NgIf,ReactiveFormsModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  formulario: FormGroup;
  imagePreview: string | null = null;

  constructor(private router: Router, private userService: UsersService) {
    this.formulario = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      image: new FormControl(),
      tipoUsuario: new FormControl(),
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
    console.log(this.image);
    if (this.image){

    const selectorValue = this.formulario.get('tipoUsuario')?.value;
    if (selectorValue == null){
      this.formulario.get('tipoUsuario')?.patchValue("usuario");
    }
    console.log(this.formulario.value)
    const response = await this.userService.register(this.formulario.value,this.image);
    console.log(response);
    alert(response.data);
    // if (!response.error) {

   }
   else{
    alert("Debe seleccionar una foto");
   }
  }
  volver(){
    this.router.navigate([`/Admin`]);
  }
}

