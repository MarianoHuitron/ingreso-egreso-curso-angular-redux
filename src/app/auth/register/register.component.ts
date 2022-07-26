import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) { 
    this.form = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    
  }

  crearUsuario() {

    if(this.form.invalid) return;

    const {nombre, correo, password} = this.form.value;

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    this._authService.createUser(nombre, correo, password)
      .then(credentials => {
        console.log(credentials);
        Swal.close();
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
