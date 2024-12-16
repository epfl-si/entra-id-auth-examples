import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { JsonPipe, AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, JsonPipe, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private readonly oidcSecurityService = inject(OidcSecurityService);
  isAuthenticated = false;
  userData$ = this.oidcSecurityService.userData$;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );  
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => {
      console.log('Logged out:', result);
    });
  }

}