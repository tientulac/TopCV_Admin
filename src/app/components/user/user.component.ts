import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent implements OnInit {

  checkAdmin: any = false;
  checkActive: any;
  roleSelect: any;
  genderSelect: any;
  companySelect: any;

  AddForm = new FormGroup({
    full_name: new FormControl(null, Validators.required),
    user_name: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    // dob: new FormControl(null),
    address: new FormControl(null),
    company_code: new FormControl(null),
  })

  ngOnInit(): void {
    this.getListAccount();
    this.getListRole();
    this.checkIsAdmin();
    this.getListCompany()
  }

  showConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete these items?</i>',
      // nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => {
        this.accountService.delete(id).subscribe(
          (res: any) => {
            if (res) {
              this.toastr.success('Delete Success !');
              this.getListAccount();
            }
            else {
              this.toastr.warning('Delete Fail !');
              this.getListAccount();
            }
          }
        )
      }
    });
  }

  showConfirmUpdateVIP(id: any): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to update this user to VIP?</i>',
      // nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => {
        this.updateVIP(id);
      }
    });
  }

  showAddModal(title: any, dataEdit: any): void {
    this.isDisplay = true;
    this.titleModal = title;
    this.selected_ID = null;
    if (dataEdit != null) {
      this.isInsert = false;
      this.roleSelect = dataEdit.role_code ?? '';
      this.companySelect = dataEdit.company_code;
      // this.genderSelect = dataEdit.gender;
      this.checkActive = dataEdit.active;
      this.checkAdmin = dataEdit.admin;
      this.selected_ID = dataEdit._id;
      this.AddForm.patchValue({
        full_name: !dataEdit ? '' : dataEdit.full_name,
        email: !dataEdit ? '' : dataEdit.email,
        // dob: !dataEdit ? '' : dataEdit.dob.substring(0,10),
        address: !dataEdit ? '' : dataEdit.address,
      });
    }
    else {
      this.isInsert = true;
      this.AddForm.reset();
    }
  }

  handleOk(): boolean {
    var req: any = {
      full_name: this.AddForm.value.full_name,
      email: this.AddForm.value.email,
      // dob: this.AddForm.value.dob,
      address: this.AddForm.value.address,
      // gender: this.genderSelect,
      admin: this.checkAdmin,
      active: this.checkActive,
      role_code: this.roleSelect ?? '',
      company_code: this.companySelect,
      created_at: null,
      updated_at: null,
      deleted_at: null,
    }
    if (!req.role_code || !req.company_code) {
      this.toastr.warning('You must select role and company');
      return false;
    }
    if (this.AddForm.valid) {
      if (this.selected_ID) {
        req.updated_at = new Date();
        this.accountService.updateInfor(req, this.selected_ID).subscribe(
          (res: any) => {
            if (res) {
              this.toastr.success('Success !');
              this.getListAccount();
            }
            else {
              this.toastr.success('Fail !');
            }
          }
        );
      }
      else {
        req.created_at = new Date();
        req.user_name = this.AddForm.value.user_name;
        req.password = '123';
        if (this.listAccount.filter((x: any) => x.user_name == req.user_name).length > 0) {
          this.toastr.warning('The user name was existed');
          return false;
        }
        this.accountService.insert(req).subscribe(
          (res: any) => {
            if (res) {
              this.toastr.success('Success !');
              this.getListAccount();
            }
            else {
              this.toastr.success('Fail !');
            }
          }
        );
      }
      this.isDisplay = false;
      return true;
    }
    else {
      {
        Object.values(this.AddForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        return false;
      }
    }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isDisplay = false;
  }

  banAccount(id: any) {
    this.accountService.updateInfor({ active: false, isVIP: 0 }, id).subscribe(
      (res: any) => {
        if (res) {
          this.toastr.success('Success !');
          this.getListAccount();
        }
        else {
          this.toastr.success('Fail !');
        }
      }
    );
  }

  activeAccount(id: any) {
    this.accountService.updateInfor({ active: true }, id).subscribe(
      (res: any) => {
        if (res) {
          this.toastr.success('Success !');
          this.getListAccount();
        }
        else {
          this.toastr.success('Fail !');
        }
      }
    );
  }

  updateVIP(id: any) {
    this.accountService.updateInfor({ isVIP: 3 }, id).subscribe(
      (res: any) => {
        if (res.StatusCode == 200) {
          this.toastr.success('Success !');
          this.getListAccount();
        }
        else {
          this.toastr.success('Fail !');
        }
      }
    );
  }
}
