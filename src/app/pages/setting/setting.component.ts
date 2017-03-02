import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
    selector: 'setting',
    templateUrl: '../setting/setting.component.html',
    styleUrls: ['../setting/setting.component.css']
})
export class SettingComponent {

    person: FirebaseObjectObservable<any>;
    user = <any>{};

    @ViewChild("telSet") telSet: any;
    @ViewChild("emailSet") emailSet: any;
    @ViewChild("birthSet") birthSet: any;
    @ViewChild("townSet") townSet: any;
    @ViewChild("workSet") workSet: any;
    @ViewChild("stadySet") stadySet: any;

    constructor(public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
            if(user) {
                this.person = this.af.database.object(`/people/${user.auth.uid}`);
            }
        });
    }

    settingSet() {
        this.person.update({
            telSet: this.telSet.nativeElement.value,
            emailSet: this.emailSet.nativeElement.value,
            birthSet: this.birthSet.nativeElement.value,
            townSet: this.townSet.nativeElement.value,
            workSet: this.workSet.nativeElement.value,
            stadySet: this.stadySet.nativeElement.value
        });
    }
}
