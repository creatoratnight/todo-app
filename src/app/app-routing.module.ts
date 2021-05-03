import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { GroupComponent } from './group/group.component';
import { GroupsComponent } from './groups/groups.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  { path: '', component: CategoryComponent },
  { path: 'todo/:id', component: TodoComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'group/:id', component: GroupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
