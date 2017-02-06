import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
// import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';


@Component({
    selector: 'messages',
    templateUrl: 'messages.component.html',
    styleUrls: ['messages.component.css']
})
export class MessagesComponent implements OnInit {

    people: Observable<any>;
    // items: FirebaseListObservable<any>;
    userId: string = '';
    userImg: string = '';
    filter: FirebaseListObservable<any>;
    root: FirebaseListObservable<any>;

    arr: any = [];

    constructor(public router: Router, public af: AngularFire) {
        // this.people = this.af.database.list(`people`)
        //     .map(items => {
        //         const filtered = items.filter(item => item.user.indexOf('а') != -1);
        //         return filtered;
        //     });
    }

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.userId = user.auth.uid;
            this.userImg = user.auth.photoURL;
            this.people = this.af.database.list(`/people/${this.userId}/privatChats/`, {
              query: {
                orderByChild: 'date'
              }
            }).map(items => {
                const filtered = items.filter(item => item.date != undefined);
                return filtered;
            });
          }
        });
        // this.people = this.af.database.list(`/people`, {
        //   query: {
        //     // orderByKey: true,
        //     // equalTo: '6NC8StftpsNkuElLySDvRD0qkA52'
        //   }
        // });
    }
    massagePerson(id) {
        this.router.navigate(['/privat', id]);
    }
}
