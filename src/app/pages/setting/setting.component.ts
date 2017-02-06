import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {Router} from '@angular/router';

@Component({
    selector: 'setting',
    templateUrl: '../setting/setting.component.html',
    styleUrls: ['../setting/setting.component.css']
})
export class SettingComponent {

    person: FirebaseObjectObservable<any>;
    userId: string = '';

    // userNameSet: string = '';
    userEmailSet: string = '';
    userTelSet: string = '';
    userBirthSet: string = '';
    userTownSet: string = '';
    userWorkSet: string = '';
    userStadySet: string = '';

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.userId = user.auth.uid;
            this.person = this.af.database.object(`/people/${this.userId}`);
          }
        });
    }

    settingSet() {
        // if ( this.userNameSet != '') {
        //     this.person.update({
        //         userSet: this.userNameSet
        //     });
        // }
        if ( this.userEmailSet != '') {
            this.person.update({
                emailSet: this.userEmailSet
            });
        }
        if ( this.userTelSet != '' ) {
            this.person.update({
                telSet: this.userTelSet
            });
        }
        if ( this.userBirthSet != '' ) {
            this.person.update({
                birthSet: this.userBirthSet
            });
        }
        if ( this.userTownSet != '' ) {
            this.person.update({
                townSet: this.userTownSet
            });
        }
        if ( this.userWorkSet != '' ) {
            this.person.update({
                workSet: this.userWorkSet
            });
        }
        if ( this.userStadySet != '' ) {
            this.person.update({
                stadySet: this.userStadySet
            });
        }
    }
}
