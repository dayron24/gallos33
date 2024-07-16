import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;
const Port = environment.PORT;
const config: SocketIoConfig = 
{ url:`${apiUrl}:${Port}`, options: {} };
//{ url:'http://localhost:81' , options: {} };



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,HttpClientModule,AppRoutingModule,SocketIoModule.forRoot(config)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
