import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PrivateComponent } from './private/private.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'private', component: PrivateComponent, canActivate: [authGuard] },
    { path: 'unauthorized', component: UnauthorizedComponent }
];