import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) { 
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    if(this.form.invalid) return;
    const {email, password} = this.form.value;

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      }
    })


    this._authService.loginUser(email, password)
      .then(credentials => {
        console.log(credentials);
        Swal.close()
        this._router.navigate(['/'])
      })
      .catch(err => {
        Swal.fire({
          title: 'Error!',
          text: err?.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      })
  }

}
