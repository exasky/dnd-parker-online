import { Routes } from "@angular/router";
import { CampaignCreatorComponent } from "./adventure/component/creator/campaign/campaign-creator.component";
import { IndexComponent } from "./index/index.component";
import { authGuard } from "./login/guard/auth.guard";
import { profileGuard } from "./login/guard/profile.guard";
import { UserDetailComponent } from "./user/component/user-detail.component";
import { UserListComponent } from "./user/component/user-list.component";

export const routes: Routes = [
  { path: "login", loadComponent: () => import("./login/login.component").then((m) => m.LoginComponent) },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () => import("./home/home.component").then((m) => m.HomeComponent),
    children: [
      { path: "", component: IndexComponent },
      {
        path: "campaign-creator",
        canActivate: [profileGuard],
        data: { roles: ["ROLE_GM"] },
        children: [
          { path: "", component: CampaignCreatorComponent },
          { path: ":id", component: CampaignCreatorComponent },
        ],
      },
      {
        path: "adventure/:id",
        loadComponent: () =>
          import("./adventure/component/adventure/adventure-index.component").then((m) => m.AdventureIndexComponent),
      },
      { path: "users", canActivate: [profileGuard], data: { roles: ["ROLE_GM"] }, component: UserListComponent },
      { path: "user-detail", component: UserDetailComponent },
    ],
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];
