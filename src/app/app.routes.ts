import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AddTasksComponent } from './components/admin/tasks/add-tasks/add-tasks.component';
import { EditTasksComponent } from './components/admin/tasks/edit-tasks/edit-tasks.component';
import { AdminComponent } from './components/admin/admin.component';
import { ViewTaskComponent } from './shared/view-tasks/view-tasks.component';
import { ManageUserRoleComponent } from './components/admin/manage-user-role/manage-user-role.component';
import { TaskDetailsComponent } from './components/member/task-details/task-details.component';
import { MemberComponent } from './components/member/member.component';
import { AuthGuard } from './core/guards/auth.guard';
import { EditDetailsComponent } from './shared/edit-details/edit-details.component';



export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},
    {
        path: 'dashboard/admin',
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [AuthGuard],
        data: { role: 'admin' }
    },
    {
        path: 'admin/add',
        loadComponent: () =>
          import('./components/admin/tasks/add-tasks/add-tasks.component').then(
            (m) => m.AddTasksComponent
          ),
        canActivate: [AuthGuard],
        data: { role: 'admin' },
      },
      {
        path: 'admin/edit/:id',
        loadComponent: () =>
          import('./components/admin/tasks/edit-tasks/edit-tasks.component').then(
            (m) => m.EditTasksComponent
          ),
        canActivate: [AuthGuard],
        data: { role: 'admin' },
      },
      {
        path: 'admin/manage-users',
        loadComponent: () =>
          import('./components/admin/manage-user-role/manage-user-role.component').then(
            (m) => m.ManageUserRoleComponent
          ),
        canActivate: [AuthGuard],
        data: { role: 'admin' },
      },
      {
        path: 'view/:id',
        loadComponent: () => import('./shared/view-tasks/view-tasks.component').then(m => m.ViewTaskComponent),
        canActivate: [AuthGuard],
        data: { roles: ['reporter','admin'] }
      },
      {
        path: 'edituser/:id',
        loadComponent: () => import('./shared/edit-details/edit-details.component').then(m => m.EditDetailsComponent),
        canActivate: [AuthGuard],
        data: { roles: ['reporter','admin'] }
      },
      {
        path: 'dashboard/member',
        loadComponent: () => import('./components/member/member.component').then(m => m.MemberComponent),
        canActivate: [AuthGuard],
        data: { role: 'member' }
      },
      {
        path: 'member/task/:id',
        loadComponent: () =>
          import('./components/member/task-details/task-details.component').then(
            (m) => m.TaskDetailsComponent
          ),
        canActivate: [AuthGuard],
        data: { role: 'member' },
      }

];
