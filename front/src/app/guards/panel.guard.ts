import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PanelGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userParam = route.params['sala'];
    const protectedRoute = route.routeConfig?.path; // Obtén la ruta protegida
    console.log('Ruta protegida:', userParam);

    if (localStorage.getItem('tokenLogin')) {

        const Rol = localStorage.getItem("Rol")
    
        if (Rol === "administrador"){
          return true;
        }
        else{
          return false;
        }
    
        
      
    } else {
      this.router.navigate([`/`]);
      return false;
    }
  }
}
