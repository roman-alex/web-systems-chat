import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {

    user = <any>{};
    valid: boolean = false;

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
    loginPassword() {
        if ( this.user.email && this.user.password ) {
            this.af.auth.login({
                email: this.user.email,
                password: this.user.password
            },
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            });
            this.router.navigate(['/']);
        } else {
            this.valid = true;
        }
    }
}
