import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {

    userEmail: string = '';
    userPassword: string = '';

    constructor(private router: Router, public af: AngularFire) {}
    loginGoogle() {
      this.af.auth.login({
          provider: AuthProviders.Google,
          method: AuthMethods.Redirect
      });
      this.router.navigate(['/']);
    }

    loginFacebook() {
        this.af.auth.login({
            provider: AuthProviders.Facebook,
            method: AuthMethods.Redirect
        });
        this.router.navigate(['/']);
    }
    loginGitGub() {
        this.af.auth.login({
            provider: AuthProviders.Github,
            method: AuthMethods.Redirect
        });
        this.router.navigate(['/']);
    }
    // loginPassword() {
    //     if ( this.userEmail != '' && this.userPassword != '' ) {
    //         this.af.auth.login({
    //             email: this.userEmail,
    //             password: this.userPassword
    //         },
    //         {
    //             provider: AuthProviders.Password,
    //             method: AuthMethods.Password
    //         });
    //     } else {
    //         alert('error');
    //     }
    // }
}
