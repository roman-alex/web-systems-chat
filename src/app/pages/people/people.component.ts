import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'people',
    templateUrl: 'people.component.html',
    styleUrls: ['people.component.css']
})
export class PeopleComponent implements OnInit {

    people: Observable<any>;
    userId: string = '';

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.userId = user.auth.uid;
            this.people = this.af.database.list(`/people`).map(items => {
                const filtered = items.filter(item => item.$key != this.userId);
                return filtered;
            });
          }
        });
    }

    routPerson(id) {
        this.router.navigate(['/person', id]);
    }
    massagePerson(id) {
        this.router.navigate(['/privat', id]);
    }
}
