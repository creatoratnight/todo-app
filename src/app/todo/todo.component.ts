import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoService } from '../service/todo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  catId: string;
  category: Object;
  todos: Array<object>;
  todoValue: string;
  todoDueDate: string = '0';
  dataStatus: string = "Add";
  todoId: string;
  todayDate: Date = new Date();
  dd: string;
  mm: string;
  yyyy: string;
  today: string;
  nextWeekDate: Date = this.todayDate;
  ddNextWeek: string;
  mmNextWeek: string;
  yyyyNextWeek: string;
  todayNextWeek: string;

  constructor(private todoService: TodoService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.catId = this.activatedRoute.snapshot.paramMap.get('id');
    this.dd = String(this.todayDate.getDate()).padStart(2, '0');
    this.mm = String(this.todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    this.yyyy = String(this.todayDate.getFullYear());
    this.today = this.yyyy + '-' + this.mm + '-' + this.dd;
    this.nextWeekDate.setDate(this.nextWeekDate.getDate() + 7);
    this.ddNextWeek = String(this.nextWeekDate.getDate()).padStart(2, '0');
    this.mmNextWeek = String(this.nextWeekDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    this.yyyyNextWeek = String(this.nextWeekDate.getFullYear());
    this.todayNextWeek = this.yyyyNextWeek + '-' + this.mmNextWeek + '-' + this.ddNextWeek;
    this.todoService.loadCategory(this.catId).subscribe(val => {
      this.category = val;
    })
    this.todoService.loadTodos(this.catId).subscribe(val => {
      this.todos = val;
    })
  }

  onSubmit(f:NgForm) {
    if (this.dataStatus == "Add") {
      let todo = {
        todo: f.value.todoText,
        isCompleted: false,
        todoDueDate: f.value.todoDueDate != 0 ? f.value.todoDueDate : null
      }
  
      this.todoService.saveTodo(this.catId, todo);
      f.resetForm();
      this.todoDueDate = "0";
    } else if (this.dataStatus == "Update") {
      this.todoService.updateTodo(this.catId, this.todoId, f.value.todoText, f.value.todoDueDate);
      f.resetForm();
      this.dataStatus = "Add"
    }
    
  }

  onEdit(todo: string, id: string, dueDate: string) {
    this.todoValue = todo;
    this.dataStatus = "Update";
    this.todoId = id;
    this.todoDueDate = dueDate;
  }

  onDelete(id:string) {
    this.todoService.deleteTodo(this.catId, id);
  }

  completeTodo(todoId:string, isCompleted:boolean) {
    if (isCompleted) {
      this.todoService.markUncomplete(this.catId, todoId);
    } else {
      this.todoService.markComplete(this.catId, todoId);
    }
  }
}
