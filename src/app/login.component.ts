import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    user = {};
    userName: string = '';
    userImg: string = '';

    constructor(private router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.user = user;
            this.userName = user.auth.displayName;
            this.userImg = user.auth.photoURL;
          }
          else {
            this.user = {uid: ''};
          }
        });
    }

    login() {
      this.af.auth.login({
          provider: AuthProviders.Google,
          method: AuthMethods.Redirect
      });
      this.router.navigate(['/chat']);
    }

}
