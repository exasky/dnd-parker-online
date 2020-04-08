import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdventureComponent} from "./adventure/adventure.component";
import {IndexComponent} from "./index/index.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./login/guard/auth.guard";
import {CampaignCreatorComponent} from "./adventure/component/creator/campaign/campaign-creator.component";
import {UserListComponent} from "./user/component/user-list.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},

  {
    path: '', canActivate: [AuthGuard], children: [
      {path: '', component: IndexComponent},
      {path: 'campaign-creator', component: CampaignCreatorComponent},
      {path: 'campaign-creator/:id', component: CampaignCreatorComponent},
      {path: 'adventure/:id', component: AdventureComponent},
      {path: 'users', component: UserListComponent}
    ]
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
