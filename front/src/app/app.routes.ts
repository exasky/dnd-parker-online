import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/guard/auth.guard';
import { IndexComponent } from './index/index.component';
import { ProfileGuard } from './login/guard/profile.guard';
import { CampaignCreatorComponent } from './adventure/component/creator/campaign/campaign-creator.component';
import { AdventureIndexComponent } from './adventure/component/adventure/adventure-index.component';
import { UserListComponent } from './user/component/user-list.component';
import { UserDetailComponent } from './user/component/user-detail.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},

    {
      path: '', canActivate: [AuthGuard], children: [
        {path: '', component: IndexComponent},
        {
          path: 'campaign-creator', canActivate: [ProfileGuard], data: {roles: ['ROLE_GM']}, children: [
            {path: '', component: CampaignCreatorComponent},
            {path: ':id', component: CampaignCreatorComponent},
          ]
        },
        {path: 'adventure/:id', component: AdventureIndexComponent},
        {path: 'users', canActivate: [ProfileGuard], data: {roles: ['ROLE_GM']}, component: UserListComponent},
        {path: 'user-detail', component: UserDetailComponent}
      ]
    },

    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];
