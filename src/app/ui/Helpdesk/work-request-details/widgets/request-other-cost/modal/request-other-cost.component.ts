import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestOtherCostDialogueProvider } from '../providers/request-ither-cost-provider';
import { RequestOtherCostService } from '../services/request-other-cost-services';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-other-cost',
  templateUrl: './request-other-cost.component.html',
  styleUrls: ['./request-other-cost.component.scss'],
  providers: [MessageService]
})
export class RequestOtherCostComponent implements OnInit {
  requestCostData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  requestId: any = 0;
  loggedIdUserName: any;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  @Input() isReadOnly:boolean = false;
  constructor(
    private requestOtherCostDialogueProvider: RequestOtherCostDialogueProvider,
    private messageService: MessageService,
    private requestOtherCostService: RequestOtherCostService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.loggedIdUserName = this.authService.getLoggedInUserId();
  }

  loadRecords(id:any) {
    this.requestOtherCostService.getAllByRquestId(id).subscribe((res: any) => {
      if (res.status != 202) {
        this.requestCostData = res.map((each: any)=>{
          return{
            ...each,
            formatedDateEntered :  this.datePipe.transform(each.dateEntered, 'dd MMMM yyyy')
          }
        })
      }
      else {
        this.requestCostData = [];
      }
     });
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      requestId: this.requestId,
      isView: false,
      showActualCost : false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    }
    this.requestOtherCostDialogueProvider.openDialog(dialogConfig);
    this.requestOtherCostDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.requestId)
      }
    });
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      requestOtherCostId: id,
      requestId: this.requestId,
      isEdit: true,
      isView: false,
      newRecord: false,
      showActualCost : true,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestOtherCostDialogueProvider.openDialog(dialogConfig);
    this.requestOtherCostDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.requestId);
      }
    });
  }

  onDelete(requestPartId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequestoOtherCost(requestPartId);
      },
      key: "grid"
    });
  }

  deleteRequestoOtherCost(requestPartId: any) {
    this.requestOtherCostService.deleteById(requestPartId).subscribe((res: any) => {
      this.messageService.clear();
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'requestPartwarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.requestId);
      }
    },
      error => {
      }
    );
  }
  
  onView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      requestOtherCostId: id,
      requestId: this.requestId,
      isEdit: true,
      isView: true,
      newRecord: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    };
    this.requestOtherCostDialogueProvider.openDialog(dialogConfig);
    this.requestOtherCostDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestPart', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(result.requestId);
      }
    });
  }

}
