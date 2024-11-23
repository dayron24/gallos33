
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './Register/register.component';
import {ActivatedRouteSnapshot} from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { PanelGuard } from './guards/panel.guard';
import { AdminComponent } from './admin/admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { IniciardorStreamsComponent } from './iniciardor-streams/iniciardor-streams.component';
import { StreamControlComponent } from './reiniciar-server/reiniciar-server.component'

const routes: Routes = [

  {
    path: '',
    component:IndexComponent
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Admin',
    component:AdminComponent,
    canActivate:[PanelGuard]
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Usuarios',
    component:UsuariosComponent,
    canActivate:[PanelGuard]
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'IniciarStream',
    component:IniciardorStreamsComponent,
    canActivate:[PanelGuard]
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Reiniciar',
    component:StreamControlComponent,
    canActivate:[PanelGuard]
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Panel',
    component:PanelComponent,
    canActivate:[PanelGuard]
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Register',
    component:RegisterComponent
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Login',
    component:LoginComponent
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'Login/:sala/:port',
    component:LoginComponent
    // loadChildren: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'live/:sala/:port',
    canActivate:[LoginGuard],
    data: {
      guardSnapshot: ActivatedRouteSnapshot, // Pasa el ActivatedRouteSnapshot al guard
    },
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),LoginComponent],
  exports: [RouterModule],
})
export class AppRoutingModule {}
