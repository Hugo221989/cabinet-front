import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { actionSettingsIsAuthenticated } from 'src/app/settings/settings.actions';
import { SettingsState } from 'src/app/settings/settings.models';
import { LoginService } from '../service/login.service';
import { TokenStorageService } from '../service/token-storage.service';

const REGISTER_PATH = '/login/register';
const STUDENTS_PATH = '/students/list';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  public loginInvalid: boolean;
  public isLoggedIn = false;
  public loginform: FormGroup;
  public roles: string[] = [];
  public submitted: boolean;
  private returnUrl: string;
  public isLoginFailed = false;
  public errorMessage = '';
  public isIncorrectLoginCredentials: boolean = false;

  constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService,
        private store: Store<{settings: SettingsState}>,
        private tokenStorage: TokenStorageService,
        public translate: TranslateService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.createUserForm();
      if(this.tokenStorage.isRememberLogin()){

      }
  }

  createUserForm(){
    this.loginform = this.fb.group({
      'username': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'description': new FormControl(''),
      'gender': new FormControl('', Validators.required),
      'rememberLogin': new FormControl(false)
  }); 
  }

  async onSubmit() {
    this.submitted = true;
    let user = {
      username: this.loginform.value.username,
      password: this.loginform.value.password
    }
    this.loginService.login(user).subscribe(
      data => {
        this.dispatchUserAuthentication();
        this.saveUserAndTokenInStorage(data);
        this.setUserRoles();
        this.setLoginVariables();
        this.reloadPage();
      },
      err => {
        this.setErrorLogin(err);
      }
    );
  }

  dispatchUserAuthentication(){
    this.store.dispatch(actionSettingsIsAuthenticated({
      isAuthenticated: true
    }))
  }

  setUserRoles(){
    this.roles = this.tokenStorage.getUser().roles;  
  }

  setLoginVariables(){
    this.isLoginFailed = false;
    this.isLoggedIn = true;
  }

  saveUserAndTokenInStorage(data: any){
    this.tokenStorage.saveToken(data.accessToken);
    this.tokenStorage.saveUser(data);
    this.tokenStorage.rememberLogin(data.rememberLogin);
  }

  setErrorLogin(err: any){
    this.errorMessage = err.error.message;
    this.isLoginFailed = true;
    this.isIncorrectLoginCredentials = true;
  }

  goToRegister(){
    this.router.navigate([REGISTER_PATH]);
  }

  reloadPage() {
    this.router.navigate([STUDENTS_PATH]);
    //window.location.reload();
  }

}
