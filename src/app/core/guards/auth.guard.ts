import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../services/fireauth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private authService: AuthService
  ) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const role = this.authService.getUserRole();
    console.log('Role:', role);

    if (role) {
      const requiredRole = route.data['role'];
      console.log(requiredRole,"dhshjs")
      if (!requiredRole || role === requiredRole) {
        return true;
      }
    
    if(role=='member'){
      this.router.navigateByUrl('dashboard/member')
  }else{
    this.router.navigateByUrl('dashboard/admin')
  }
}
  this.router.navigateByUrl('login')
  return false;
}
}