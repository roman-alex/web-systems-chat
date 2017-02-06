import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'privat',
    templateUrl: 'privat.component.html',
    styleUrls: ['privat.component.css']
})
export class PrivatComponent implements OnInit, AfterViewChecked {

    private id: any;
    private subscription: Subscription;

    itemsInterlocutor: FirebaseListObservable<any>;
    itemInfo: FirebaseObjectObservable<any>;
    itemInterlocutorChatInfo: FirebaseObjectObservable<any>;
    itemChatInfo: FirebaseObjectObservable<any>;
    itemInterlocutorChatDate: FirebaseObjectObservable<any>;
    itemChatDate: FirebaseObjectObservable<any>;
    items: FirebaseListObservable<any>;
    newMessage: string = '';
    user = {};
    userName: string = '';
    userImg: string = '';
    userId: string = '';
    userEmail: string = '';

    itemInfoUser: string = '';
    itemInfoImg: string = '';

    constructor(private activateRoute: ActivatedRoute, public router: Router, public af: AngularFire) {
        this.subscription = activateRoute.params.subscribe(params=>this.id=params['id']);
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('emojiInput') private emojiInput;

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            // set info this user
            this.user = user;
            this.userName = user.auth.displayName;
            this.userImg = user.auth.photoURL;
            this.userId = user.auth.uid;
            this.userEmail = user.auth.email;

            this.itemChatDate = this.af.database.object(`/people/${this.userId}/privatChats/${this.id}`);
            this.itemInterlocutorChatDate = this.af.database.object(`/people/${this.id}/privatChats/${this.userId}`);
            this.itemInterlocutorChatInfo = this.af.database.object(`/people/${this.id}/privatChats/${this.userId}/info`);
            this.itemChatInfo = this.af.database.object(`/people/${this.userId}/privatChats/${this.id}/info`);
            this.itemInfo = this.af.database.object(`/people/${this.id}`, { preserveSnapshot: true });
            this.itemsInterlocutor = this.af.database.list(`/people/${this.id}/privatChats/${this.userId}/chat`);
            this.items = this.af.database.list(`/people/${this.userId}/privatChats/${this.id}/chat`);

            this.itemInterlocutorChatInfo.update({
                user: this.userName,
                img: this.userImg,
            });
            this.itemInfo.subscribe(
                val => {
                    this.itemInfoUser =  val.val().user;
                    this.itemInfoImg = val.val().img;
                    this.itemChatInfo.update({
                        user: this.itemInfoUser,
                        img: this.itemInfoImg
                    });
                }
            );
            this.itemChatInfo.update({
                read: true
            });
          }
          else {
            this.user = {uid: ''};
          }
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
        this.itemChatInfo.update({
            read: true
        });
    }

    sendMessage() {
        if (this.emojiInput.input != '') {
            this.itemPush();
            this.emojiInput.input = '';
            this.scrollToBottom();
        } else {
            alert('Введите сообщение');
        }
    }

    deleteItem(key: string) {
        this.itemsInterlocutor.remove(key);
        this.items.remove(key);
    }

    submitMessage(event) {
        if (event.which === 13 && this.emojiInput.input != '') {
            event.preventDefault();
            this.itemPush();
            this.emojiInput.input = '';
            this.scrollToBottom();
        }
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    itemPush() {
        this.inspectionInput('http://');
        this.inspectionInput('https://');
        this.itemsInterlocutor.push({
            text: this.emojiInput.input,
            user: this.userName,
            img: this.userImg,
            uid: this.userId,
            data: Date.now()
        });
        this.items.push({
            text: this.emojiInput.input,
            user: this.userName,
            img: this.userImg,
            uid: this.userId,
            data: Date.now()
        });
        this.itemInterlocutorChatInfo.update({
            read: false,
            lastMessage : this.emojiInput.input,
            lastMessageImg : this.userImg
        });
        this.itemChatInfo.update({
            lastMessage : this.emojiInput.input,
            lastMessageImg : this.userImg,
            read: true
        });
        this.itemChatDate.update({
            date: 0 - Date.now()
        });
        this.itemInterlocutorChatDate.update({
            date: 0 - Date.now()
        });
    }

    inspectionInput(val) {
        let message: string = this.emojiInput.input;
        if ( message.indexOf('<iframe') != -1) {
                this.emojiInput.input = 'Я Олень, який хотів добавити <b>iframe</b> і положити сайт. Але Рома вже пофіксив цей баг';
        } else if ( message.indexOf(val) != -1 && message.indexOf('<img') == -1) {
            let arr = message.split(' ');
            for (let i = 0; i < arr.length; i++) {
                if ( arr[i].indexOf(val) != -1 ) {
                    arr[i] = `<a href="${arr[i]}" target="_blank">${arr[i]}</a>`
                }
            }
            this.emojiInput.input = arr.join(' ');
        }
    }

    // loadImg(e) {
    //   var files = e.target.files[0];
    //   console.log(files, this.af);
    // }
}
