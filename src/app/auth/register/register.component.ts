import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.action';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isLoading: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<AppState>
  ) { 
    this.form = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this._store.select('ui')
    .pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(ui => this.isLoading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  crearUsuario() {

    if(this.form.invalid) return;

    const {nombre, correo, password} = this.form.value;

    this._store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    this._authService.createUser(nombre, correo, password)
      .then(credentials => {
        console.log(credentials);
        // Swal.close();
        this._store.dispatch(ui.stopLoading());
        this._router.navigate(['/'])
      })
      .catch(err => {
        this._store.dispatch(ui.stopLoading());
        Swal.fire({
          title: 'Error!',
          text: err?.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      })

  }
}
