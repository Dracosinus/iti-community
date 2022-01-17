import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserQueries } from '../../services/user.queries'

class UserRegistrationFormModel {
  username = "";
  password = "";
  confirmPassword = "";
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild("f")
  form: NgForm;

  model = new UserRegistrationFormModel();

  constructor(
    private router: Router,
    private userService: UserService,
    private userQueries: UserQueries
  ) { }

  ngOnInit(): void {
  }

  async submit() {

    // TODO  Vérifier que la confirmation de mot de passe correspond au mot de passe
    if (this.form.form.invalid || this.model.password !== this.model.confirmPassword) {
      console.error("Une erreur est survenue. Veuillez vérifier que votre mot de passe et sa confirmation sont identiques.");
      return;
    }

    if(await this.userQueries.exists(this.model.username)){
      console.error("Une erreur est survenue. Ce nom d'utilisateur existe déjà.");
      return;
    }

    // TODO Enregistrer l'utilisateur via le UserService
    this.userService.register(this.model.username, this.model.password);
    this.goToLogin();
  }

  goToLogin() {
    this.router.navigate(["/splash/login"]);
  }
}
