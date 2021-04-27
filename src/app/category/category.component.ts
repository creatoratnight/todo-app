import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  color: Array<any> = ['#e7845e', '#fc0184', '#f6b93f', '#9224a7'];
  categories: Array<object>;
  categoryName: string = "";
  dataStatus: string = "Add";
  catId : string;

  constructor( private categoryService: CategoryService ) { }

  ngOnInit(): void {
    this.categoryService.loadCategories().subscribe(val => {
      this.categories = val;
    });
  }

  onSubmit(f:NgForm) {
    if (this.dataStatus == "Add") {
      let randomNumber = Math.floor(Math.random() * this.color.length);
      let todoCategory = {
        category: f.value.categoryName,
        colorCode: this.color[randomNumber],
        todoCount: 0
      }
      this.categoryService.saveCategory(todoCategory);
      f.resetForm();
    } else if (this.dataStatus == "Update") {
      this.categoryService.updateCategory(this.catId, f.value.categoryName);
      f.resetForm();
      this.dataStatus = "Add"
    }
    
  }

  onEdit(category: string, id: string) {
    this.categoryName = category;
    this.dataStatus = "Update";
    this.catId = id;
  }

  onDelete(id:string) {
    this.categoryService.deleteCategory(id);
  }
}
