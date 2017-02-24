import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {

    person: FirebaseObjectObservable<any>;
    user = <any>{};

    constructor( public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.person = this.af.database.object(`/people/${user.auth.uid}`);
          }
        });
    }
}
