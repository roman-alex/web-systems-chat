import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'messages',
    templateUrl: 'messages.component.html',
    styleUrls: ['messages.component.css']
})
export class MessagesComponent implements OnInit {

    people: Observable<any>;
    userImg: string = '';

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.userImg = user.auth.photoURL;
            this.people = this.af.database.list(`/people/${user.auth.uid}/privatChats/`, {
              query: {
                orderByChild: 'date'
              }
            }).map(items => {
                const filtered = items.filter(item => item.date != undefined);
                return filtered;
            });
          }
        });
    }
    massagePerson(id) {
        this.router.navigate(['/privat', id]);
    }
}
