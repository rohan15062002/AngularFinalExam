import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/services/fireauth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input()title:string=""

  constructor(private authService:AuthService,private router:Router){}

  goHome(){
   const role = this.authService.getUserRole();
   if(role==="admin"){
     this.router.navigateByUrl('dashboard/admin')
   }
   else{
     this.router.navigateByUrl('dashboard/member')
   }
  }

  logout(){
   this.authService.logout()
 }
 edit(){
   console.log("edit")
   this.router.navigateByUrl(`edituser/${this.authService.getUserId()}`)
 }
}
