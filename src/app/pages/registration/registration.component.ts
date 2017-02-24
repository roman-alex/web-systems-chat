import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { LoginService } from '../../services/login.service';

@Component({
    selector: 'registration',
    templateUrl: 'registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent {

    user = <any>{};
    valid: boolean = false;

    constructor(private router: Router, public af: AngularFire, public loginService: LoginService) {}

    createUser() {
        if ( this.user.email && this.user.password && this.user.user && this.user.telSet && this.user.birthSet && this.user.townSet && this.user.workSet && this.user.stadySet) {
            this.af.auth.createUser({
                email: this.user.email,
                password: this.user.password
            });
            this.loginService.newUser = this.user;
            this.router.navigate(['/']);
        } else {
            this.valid = true;
        }
    }
}
