import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { Routes, RouterModule } from '@angular/router';
import { EmojiModule } from 'angular2-emoji';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { LoginService } from './services/login.service';
import { NoAuthGuard } from './services/no-auth-guard.service';


import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';
import { PeopleComponent } from './pages/people/people.component';
import { HomeComponent } from './pages/home/home.component';
import { PersonComponent } from './pages/person/person.component';
import { PrivatComponent } from './pages/privat/privat.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { SettingComponent } from './pages/setting/setting.component';


const appRoutes: Routes =[
    { path: '', component: HomeComponent },
    { path: 'person/:id', component: PersonComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'people', component: PeopleComponent },
    { path: 'privat/:id', component: PrivatComponent },
    { path: 'messages', component: MessagesComponent },
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
    { path: 'setting', component: SettingComponent },
    { path: '**', redirectTo: '' }
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
    ChatComponent,
    PeopleComponent,
    HomeComponent,
    PersonComponent,
    PrivatComponent,
    MessagesComponent,
    SettingComponent,
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
    }),
    NgbModule.forRoot()
  ],
  providers: [NoAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
