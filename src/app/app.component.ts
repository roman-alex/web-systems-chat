import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
    people: FirebaseListObservable<any>;
    person: FirebaseObjectObservable<any>;
    // root: FirebaseListObservable<any>;
    chatSubscribe: FirebaseListObservable<any>;
    user = {};
    userName: string = '';
    userImg: string = '';
    userId: string = '';
    userEmail: string = '';
    countMessage: number = 0;
    providerId: string = '';

    @ViewChild("audio") audio: any;

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        // this.root  = this.af.database.list('');
        // this.root.subscribe(
        //     val => console.log(val)
        // );
        this.af.auth.subscribe(user => {
          if(user) {
            // set info this user
            this.providerId = user.auth.providerData[0].providerId;
            this.user = user;
            this.userName = user.auth.displayName;
            this.userImg = user.auth.photoURL;
            this.userId = user.auth.uid;
            this.userEmail = user.auth.email;
            // set person or add new person
            this.person = this.af.database.object(`/people/${this.userId}`);
            this.person.update({
                user: this.userName,
                img: this.userImg,
                email: this.userEmail,
                providerId: this.providerId
            });

            this.chatSubscribe = this.af.database.list(`/people/${this.userId}/privatChats`, { preserveSnapshot: true });
            this.chatSubscribe.subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                    let count = 0;
                    if (snapshot.val().info.read == false ) {
                        ++count;
                    }
                    if (!snapshot.val().info.read && (Date.now() + snapshot.val().date < 2000) ) {
                        this.audio.nativeElement.play();
                    }
                    this.countMessage = count;
                });
            });

          }
          else {
            this.router.navigate(['/login']);
          }
        });
    }

    logout() {
      this.af.auth.logout();
      this.router.navigate(['/login']);
    }
}
