import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.action';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<AppState>
  ) { 
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._store.select('ui')
    .pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(ui => this.loading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  login() {
    if(this.form.invalid) return;
    const {email, password} = this.form.value;

    this._store.dispatch(ui.isLoading())

    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })


    this._authService.loginUser(email, password)
      .then(credentials => {
        console.log(credentials);
        // Swal.close()
        this._store.dispatch(ui.stopLoading())
        this._router.navigate(['/'])
      })
      .catch(err => {
        this._store.dispatch(ui.stopLoading())
        Swal.fire({
          title: 'Error!',
          text: err?.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      })
  }

}
