import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../service/category.service';
import { TodoService } from '../service/todo.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupsService } from '../service/groups.service';

@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Are you sure you want to delete this category?</h4>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-delete-modal-no" (click)="modal.dismiss('cancel click')">No</button>
    <button type="button" class="btn btn-delete-modal-yes" (click)="modal.close('Ok click')">Yes</button>
  </div>
  `,
  styleUrls: ['./category.component.css']
})
export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  color: Array<any> = ['#e7845e', '#fc0184', '#f6b93f', '#9224a7'];
  categories: Array<object> = [];
  categoryGroups: Array<object> = [];
  categoryGroup: string= "Uncategorized";
  categoryName: string = "";
  dataStatus: string = "Add";
  catId : string;
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
  deleteConfirmName: string;

  constructor( private categoryService: CategoryService, private todoService: TodoService, private groupsService: GroupsService, private modalService: NgbModal ) { }

  ngOnInit(): void {
    this.dd = String(this.todayDate.getDate()).padStart(2, '0');
    this.mm = String(this.todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    this.yyyy = String(this.todayDate.getFullYear());
    this.today = this.yyyy + '-' + this.mm + '-' + this.dd;
    this.nextWeekDate.setDate(this.nextWeekDate.getDate() + 7);
    this.ddNextWeek = String(this.nextWeekDate.getDate()).padStart(2, '0');
    this.mmNextWeek = String(this.nextWeekDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    this.yyyyNextWeek = String(this.nextWeekDate.getFullYear());
    this.todayNextWeek = this.yyyyNextWeek + '-' + this.mmNextWeek + '-' + this.ddNextWeek;

    let subCat = this.categoryService.loadCategories().subscribe(val => {
      this.categories = [];
      let catsData = val;
      for (let catData of catsData) {
        let subTodo = this.todoService.loadTodos(catData.id).subscribe(val => {
          let todos = val;
          let state = 0;
          for (let todo of todos) {
            if (Date.parse(this.today) >= Date.parse(todo.data.todoDueDate) && todo.data.isCompleted == false) {
              state = 2;
            }
            if (Date.parse(this.todayNextWeek) > Date.parse(todo.data.todoDueDate) && todo.data.isCompleted == false && state != 2) {
              state = 1;
            }
          }
          this.categories.push({id: catData.id, data: catData.data, categoryDueState: state});
          subTodo.unsubscribe();
        })
      }
      subCat.unsubscribe();
    });

    let subGroups = this.groupsService.loadGroups().subscribe(val => {
      this.categoryGroups = [...val, {data: {group: 'Uncategorized'}}];
      console.log(this.categoryGroups);
      subGroups.unsubscribe();
    });
  }

  onSubmit(f:NgForm) {
    if (this.dataStatus == "Add") {
      let randomNumber = Math.floor(Math.random() * this.color.length);
      let todoCategory = {
        category: f.value.categoryName,
        categoryGroup: f.value.categoryGroup,
        colorCode: this.color[randomNumber],
        todoCount: 0
      }
      this.categoryService.saveCategory(todoCategory);
      f.resetForm();
      this.categoryGroup = "Uncategorized";
    } else if (this.dataStatus == "Update") {
      this.categoryService.updateCategory(this.catId, f.value.categoryName, f.value.categoryGroup);
      f.resetForm();
      this.dataStatus = "Add";
      this.categoryGroup = "Uncategorized";
    }
    
  }

  onEdit(category: string, group: string, id: string) {
    this.categoryName = category;
    this.dataStatus = "Update";
    this.catId = id;
    this.categoryGroup = group;
    console.log(this.categoryGroup);
  }

  onDelete(id:string, category:string) {
    this.categoryService.deleteCategory(id);
  }

  openModal(catId:string, category:string) {
    let modalRef = this.modalService.open(NgbdModalConfirmAutofocus, {centered: true, windowClass: 'delete-modal'});
    modalRef.result.then((data) => {
      //on close
      console.log(catId);
      this.categoryService.deleteCategory(catId);
    }, (reason) => {
      //on dismiss
    });
  }
}
