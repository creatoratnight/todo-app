import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor( private afs: AngularFirestore, private toastr: ToastrService ) { }
  saveGroup(data) {
    this.afs.collection('groups').add({...data, timestamp: firebase.firestore.FieldValue.serverTimestamp()}).then(ref => {
      this.toastr.success('New group saved successfully')
    });
  }

  loadGroups() {
    return this.afs.collection("groups", ref => ref.orderBy('timestamp')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data}
        })
      })
    );
  }

  updateGroup(groupId:string, updatedGroup:string) {
    this.afs.collection("groups").doc(groupId).update({group: updatedGroup}).then(() => {
      this.toastr.success("Group updated successfully")
    })
  }

  deleteGroup(groupId:string) {
    this.afs.collection("groups").doc(groupId).delete().then(() => {
      this.toastr.success("Group deleted successfully")
    })
  }
}
