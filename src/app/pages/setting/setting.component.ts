import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
    selector: 'setting',
    templateUrl: '../setting/setting.component.html',
    styleUrls: ['../setting/setting.component.css']
})
export class SettingComponent {

    person: FirebaseObjectObservable<any>;
    user = <any>{};

    constructor(public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
            if(user) {
                this.person = this.af.database.object(`/people/${user.auth.uid}`);
            }
        });
    }

    settingSet() {
        if ( this.user.emailSet) {
            this.person.update({
                emailSet: this.user.emailSet
            });
        }
        if ( this.user.telSet) {
            this.person.update({
                telSet: this.user.telSet
            });
        }
        if ( this.user.birthSet) {
            this.person.update({
                birthSet: this.user.birthSet
            });
        }
        if ( this.user.townSet) {
            this.person.update({
                townSet: this.user.townSet
            });
        }
        if ( this.user.workSet) {
            this.person.update({
                workSet: this.user.workSet
            });
        }
        if ( this.user.stadySet) {
            this.person.update({
                stadySet: this.user.stadySet
            });
        }
    }
}
