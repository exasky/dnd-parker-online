import { CommonModule } from "@angular/common";
import { Component, HostBinding, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
  @HostBinding("style.flex-grow") flexGrow = "1";
  @HostBinding("class") cssClasses = "d-flex justify-content-center align-items-center flex-column";

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue()) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.get("username").value, this.loginForm.get("password").value).subscribe({
      next: () => this.router.navigate([this.returnUrl]),
      error: () => {
        this.loading = false;
        this.loginForm.reset({});
      },
    });
  }
}
