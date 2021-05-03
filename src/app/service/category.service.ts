import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private afs: AngularFirestore, private toastr: ToastrService ) { }

  saveCategory(data) {
    this.afs.collection('categories').add({...data, timestamp: firebase.firestore.FieldValue.serverTimestamp()}).then(ref => {
      this.toastr.success('New category saved successfully')
    });
  }

  loadCategories() {
    return this.afs.collection('categories', ref => ref.orderBy('timestamp')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data}
        })
      })
    );
  }

  updateCategory(id:string, updatedCategory, updateCategoryGroup: string) {
    if (updateCategoryGroup == null) {
      updateCategoryGroup = "Uncategorized";
    }
    this.afs.doc('categories/' + id).update({category: updatedCategory, categoryGroup: updateCategoryGroup}).then( () => {
      this.toastr.success('Category updated successfully')
    })
  }

  deleteCategory(id:string) {    
    this.afs.doc('categories/' + id).update({categoryGroup: 'Deleted'}).then( () => {
      this.toastr.success('Category deleted successfully')
    })
  }
}
