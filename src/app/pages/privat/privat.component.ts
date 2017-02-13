import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, OnDestroy, Inject} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp } from 'angularfire2';
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
    user = <any>{};
    itemInfoUser: string = '';
    itemInfoImg: string = '';
    storageRef: any;
    // storage: any;

    constructor(@Inject(FirebaseApp) firebaseApp: any, private activateRoute: ActivatedRoute, public router: Router, public af: AngularFire) {
        this.subscription = activateRoute.params.subscribe(params=>this.id=params['id']);

        // this.storage = firebaseApp.storage();
        this.storageRef = firebaseApp.storage().ref();
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('emojiInput') private emojiInput;
    @ViewChild("uploader") private uploader;

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.user.name = user.auth.displayName;
            this.user.img = user.auth.photoURL;
            this.user.id = user.auth.uid;
            this.user.email = user.auth.email;

            this.itemChatDate = this.af.database.object(`/people/${this.user.id}/privatChats/${this.id}`);
            this.itemInterlocutorChatDate = this.af.database.object(`/people/${this.id}/privatChats/${this.user.id}`);
            this.itemInterlocutorChatInfo = this.af.database.object(`/people/${this.id}/privatChats/${this.user.id}/info`);
            this.itemChatInfo = this.af.database.object(`/people/${this.user.id}/privatChats/${this.id}/info`);
            this.itemInfo = this.af.database.object(`/people/${this.id}`, { preserveSnapshot: true });
            this.itemsInterlocutor = this.af.database.list(`/people/${this.id}/privatChats/${this.user.id}/chat`);
            this.items = this.af.database.list(`/people/${this.user.id}/privatChats/${this.id}/chat`);

            this.itemInterlocutorChatInfo.update({
                user: this.user.name,
                img: this.user.img,
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
            user: this.user.name,
            img: this.user.img,
            uid: this.user.id,
            data: Date.now()
        });
        this.items.push({
            text: this.emojiInput.input,
            user: this.user.name,
            img: this.user.img,
            uid: this.user.id,
            data: Date.now()
        });
        this.itemInterlocutorChatInfo.update({
            read: false,
            lastMessage : this.emojiInput.input,
            lastMessageImg : this.user.img
        });
        this.itemChatInfo.update({
            lastMessage : this.emojiInput.input,
            lastMessageImg : this.user.img,
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

    loadImg(e) {

        var files = e.target.files[0];
        var fileImg = '';
        var metadata = {
          contentType: 'image/jpeg/png'
        };

        var uploadTask = this.storageRef.child(`images/${this.user.id}/${Date.now()}-${files.name}`).put(files, metadata);

        uploadTask.on('state_changed', (snapshot) => {
                // this.uploader.nativeElement.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, (error) => {
                console.log('error: ' + error);
            }, () => {
                var downloadURL = uploadTask.snapshot.downloadURL;

                this.itemsInterlocutor.push({
                    fileImgDownload: downloadURL,
                    user: this.user.name,
                    img: this.user.img,
                    uid: this.user.id,
                    data: Date.now()
                });
                this.items.push({
                    fileImgDownload: downloadURL,
                    user: this.user.name,
                    img: this.user.img,
                    uid: this.user.id,
                    data: Date.now()
                });
                this.itemInterlocutorChatInfo.update({
                    read: false,
                    lastMessage : 'image',
                    lastMessageImg : this.user.img
                });
                this.itemChatInfo.update({
                    lastMessage : 'image',
                    lastMessageImg : this.user.img,
                    read: true
                });
                this.itemChatDate.update({
                    date: 0 - Date.now()
                });
                this.itemInterlocutorChatDate.update({
                    date: 0 - Date.now()
                });
        });
    }

    loadFiles(e) {

        var files = e.target.files[0];
        var fileImg = '';
        var metadata = {
          contentType: null
        };

        var obj = files.name.split('.');
        var ext = obj[obj.length -1];

        if(ext=="pdf" || ext=="docx" || ext=="doc" ||  ext=="zip"){
            if(files.size > 20000000) {
                alert('Файл перевищує 20МБ');
            } else {
                var uploadTask = this.storageRef.child(`docs/${this.user.id}/${Date.now()}-${files.name}`).put(files, metadata);

                uploadTask.on('state_changed', (snapshot) => {
                        // this.uploader.nativeElement.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, (error) => {
                        console.log('error: ' + error);
                    }, () => {
                        var downloadURL = uploadTask.snapshot.downloadURL;

                        this.itemsInterlocutor.push({
                            fileDocName: files.name,
                            fileDocDownload: downloadURL,
                            user: this.user.name,
                            img: this.user.img,
                            uid: this.user.id,
                            data: Date.now()
                        });
                        this.items.push({
                            fileDocName: files.name,
                            fileDocDownload: downloadURL,
                            user: this.user.name,
                            img: this.user.img,
                            uid: this.user.id,
                            data: Date.now()
                        });
                        this.itemInterlocutorChatInfo.update({
                            read: false,
                            lastMessage : 'document',
                            lastMessageImg : this.user.img
                        });
                        this.itemChatInfo.update({
                            lastMessage : 'document',
                            lastMessageImg : this.user.img,
                            read: true
                        });
                        this.itemChatDate.update({
                            date: 0 - Date.now()
                        });
                        this.itemInterlocutorChatDate.update({
                            date: 0 - Date.now()
                        });
                });
            }
        } else{
            alert('Невідомий формат документа');
        };
    }
}
