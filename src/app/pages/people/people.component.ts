import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'people',
    templateUrl: 'people.component.html',
    styleUrls: ['people.component.css']
})
export class PeopleComponent implements OnInit {

    people: Observable<any>;

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
            if(user) {
                this.people = this.af.database.list(`/people`).map(items => {
                    const filtered = items.filter(item => item.$key != user.auth.uid);
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
