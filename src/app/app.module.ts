import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { Routes, RouterModule } from '@angular/router';
import { EmojiModule } from 'angular2-emoji';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { ChatComponent } from './chat.component';


const appRoutes: Routes =[
    { path: 'login', component: LoginComponent},
    { path: 'chat', component: ChatComponent },
    { path: '**', component: LoginComponent }
];

const firebaseConfig = {
    apiKey: "AIzaSyAZ-DXzGDQsemHEzEadlnXaUDSGpu0Set0",
    authDomain: "testchat-483ef.firebaseapp.com",
    databaseURL: "https://testchat-483ef.firebaseio.com",
    storageBucket: "testchat-483ef.appspot.com"
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    EmojiModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig,{
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
