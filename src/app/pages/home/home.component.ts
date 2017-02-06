import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import {Router} from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {

    person: FirebaseObjectObservable<any>;
    userId: string = '';
    userName: string = '';
    userImg: string = '';

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.userId = user.auth.uid;
            this.userName = user.auth.displayName;
            this.userImg = user.auth.photoURL;

            this.person = this.af.database.object(`/people/${this.userId}`);
          }
        });
    }
}
