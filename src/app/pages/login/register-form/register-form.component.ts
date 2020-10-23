import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SettingsState } from 'src/app/settings/settings.models';
import { LoginService } from '../service/login.service';
import { TokenStorageService } from '../service/token-storage.service';
import RegisterHelper from './register-helper';

const LOGIN_PATH = '/login/log';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  public registerform: FormGroup;
  public isIncorrectLoginCredentials: boolean = false;
  public emailSended: boolean = false;
  public emailExist: boolean = false;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private store: Store<{settings: SettingsState}>,
    private tokenStorage: TokenStorageService,
    private router: Router,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this.createRegisterUserForm();
  }

  createRegisterUserForm(){
    this.registerform = this.fb.group({
      username: [null, Validators.required],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])
     ],
     password: [null, Validators.compose([
        Validators.required,
        /* RegisterHelper.patternValidator(/\d/, { hasNumber: true }), */
        RegisterHelper.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        RegisterHelper.patternValidator(/[a-z]/, { hasSmallCase: true }),
        /* RegisterHelper.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        {
          hasSpecialCharacters: true
        }), */
        Validators.minLength(8)]) 
     ],
     confirmPassword: [null, Validators.compose([Validators.required])]
    },
    {
       // check whether our password and confirm password match
       validator: RegisterHelper.passwordMatchValidator
    });
 }

  async onSubmit() {console.log(this.registerform);
    //this.emailExist = true;
    let userReg = {
      username: this.registerform.value.username,
      email: this.registerform.value.email,
      password: this.registerform.value.password,
      confirmPassword: this.registerform.value.confirmPassword
    }
    this.loginService.register(userReg).subscribe(
      data => {
        this.showEmailSendedMessage();
      },
      err => {
        this.setErrorLogin(err);
      }
    );
  }

  showEmailSendedMessage(){
    this.emailSended = true;
  }

  setErrorLogin(err: any){
    this.isIncorrectLoginCredentials = true;
  }

  goToLogin(){
    this.router.navigate([LOGIN_PATH]);
  }

}
