import { Injectable, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';

@Injectable()
export class LoginService {

    constructor(private af: AngularFire){}

    // user() {
    //     this.af.auth.subscribe(user => {
    //         if(user) {
    //
    //         }
    //     });
    // }
}
