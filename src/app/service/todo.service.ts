import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor( private afs: AngularFirestore, private toastr: ToastrService ) { }
  saveTodo(id:string, data) {
    this.afs.collection('categories').doc(id).collection('todos').add(data).then(ref => {
      this.afs.doc('categories/' + id).update({todoCount: firebase.firestore.FieldValue.increment(1)});
      this.toastr.success('New todo saved successfully')
    });
  }

  loadTodos(id:string) {
    return this.afs.collection('categories').doc(id).collection("todos").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data}
        })
      })
    );
  }

  updateTodo(catId:string, todoId:string, updateData:string) {
    this.afs.collection("categories").doc(catId).collection("todos").doc(todoId).update({todo: updateData }).then(() => {
      this.toastr.success("Todo updated successfully")
    })
  }

  deleteTodo(catId:string, todoId:string) {
    this.afs.collection("categories").doc(catId).collection("todos").doc(todoId).delete().then(() => {
      this.afs.doc('categories/' + catId).update({todoCount: firebase.firestore.FieldValue.increment(-1)});
      this.toastr.success("Todo deleted successfully")
    })
  }

  markComplete(catId:string, todoId:string) {
    this.afs.collection("categories").doc(catId).collection("todos").doc(todoId).update({isCompleted: true }).then(() => {
      this.toastr.success("Todo completed successfully")
    })
  }

  markUncomplete(catId:string, todoId:string) {
    this.afs.collection("categories").doc(catId).collection("todos").doc(todoId).update({isCompleted: false }).then(() => {
      this.toastr.success("Todo reset successfully")
    })
  }
}