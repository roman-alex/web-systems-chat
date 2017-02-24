import { Injectable,
    // OnInit
} from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class LoginService {

    defaultImg: string = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg' ;
    newUser: any = false;
    person: FirebaseObjectObservable<any>;

    constructor(private af: AngularFire){}

    // ngOnInit() {
    //     this.af.auth.subscribe(user => {
    //         if(user) {
    //
    //         }
    //     });
    // }

    registration(newUserId) {
        if(this.newUser) {
            this.person = this.af.database.object(`/people/${newUserId}`);
            this.person.update({
                img: this.defaultImg,
                user: this.newUser.user,
                email: this.newUser.email,
                telSet: this.newUser.telSet,
                birthSet: this.newUser.birthSet,
                townSet: this.newUser.townSet,
                workSet: this.newUser.workSet,
                stadySet: this.newUser.stadySet,
                providerId: 'password'
            });
            this.newUser = false;
        } else {
            console.log('error: newUserId');
        }
    }
}
