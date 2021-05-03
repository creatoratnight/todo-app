import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GroupsService } from '../service/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: Array<object>;
  dataStatus: string = "Add";
  groupValue: string;
  groupId: string;

  constructor(private groupService: GroupsService) { }

  ngOnInit(): void {
    this.groupService.loadGroups().subscribe(val => {
      this.groups = val;
    })
  }

  onSubmit(f:NgForm) {
    if (this.dataStatus == "Add") {
      let group = {
        group: f.value.groupName
      }
  
      this.groupService.saveGroup(group);
      f.resetForm();
    } else if (this.dataStatus == "Update") {
      this.groupService.updateGroup(this.groupId, f.value.groupName);
      f.resetForm();
      this.dataStatus = "Add"
    }
    
  }

  onEdit(group: string, id: string) {
    this.groupValue = group;
    this.dataStatus = "Update";
    this.groupId = id;
  }

  onDelete(id:string) {
    this.groupService.deleteGroup(id);
  }
}
