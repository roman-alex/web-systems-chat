import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'person',
    templateUrl: './person.component.html',
    styleUrls: ['../home/home.component.css']
})
export class PersonComponent {

    person: FirebaseObjectObservable<any>;
    private id: any;
    private subscription: Subscription;

    constructor(private activateRoute: ActivatedRoute, public router: Router, public af: AngularFire) {
        this.subscription = activateRoute.params.subscribe(params=>this.id=params['id']);
    }

    ngOnInit() {
        this.person = this.af.database.object(`/people/${this.id}`);
    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
