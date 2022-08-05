import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subject, takeUntil } from 'rxjs';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private _store: Store<AppState>
  ) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      if(fuser) {
        this.firestore.doc(`${fuser.uid}/user`).valueChanges()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((fireUser: any) => {
            const user = User.fromFirebase(fireUser);            
            this._store.dispatch(authActions.setUser({user}));
          })
      } else {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._store.dispatch(authActions.unSetUser());
      }

    })
  }


  createUser(name: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        if(user) {
          const newUser = new User(user.uid, name, email );
          return this.firestore.doc(`${user.uid}/user`)
            .set({...newUser})
        }
        return Promise.resolve();
      })
  }

  loginUser(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fuser => fuser !== null)
    );
  }

}
