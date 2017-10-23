import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { FeedbackTypeService } from '../services/ProviderAdminServices/feedback-type-master-service.service';
import { MdDialog, MdDialogRef} from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-feedback-complaint-nature-master',
  templateUrl: './feedback-complaint-nature-master.component.html',
  styleUrls: ['./feedback-complaint-nature-master.component.css']
})
export class FeedbackComplaintNatureMasterComponent implements OnInit {

  search_state: any;
  search_serviceline: any;
  search_feedbacktype: any;
  searchForm: boolean = true;
  showTable: boolean = false;
  serviceProviderID: any;
  states = [];
  servicelines = [];
  feedbackTypes = [];
  natureTypes = [];
  providerServiceMapID: any;
  feedbackTypeID: any;
  confirmMessage: any;
  objs = [];
  @ViewChild('searchCNForm') searchCNForm: NgForm;
  @ViewChild('addForm') addForm: NgForm;
  natureExists: boolean = false;
  searchFeedbackNatureArray = [];
  msg = "Complaint Nature already exists";

  constructor(private commonData: dataService, private FeedbackTypeService: FeedbackTypeService, private alertService: ConfirmationDialogsService, public dialog: MdDialog) { }

  ngOnInit() {
    this.serviceProviderID = this.commonData.service_providerID;
    this.FeedbackTypeService.getStates(this.serviceProviderID)
    .subscribe((response)=>{
      console.log("states",response);
      this.states = response;
    })
  }

  getServiceLinesfromSearch(state){
    this.FeedbackTypeService.getServiceLines(this.serviceProviderID,state)
    .subscribe((response)=>{
      console.log("services",response);
      this.servicelines = response;
    })
  }

  findFeedbackTypes(providerServiceMapID){
    this.providerServiceMapID = providerServiceMapID;
    this.FeedbackTypeService.getFeedbackTypes({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response)=>{
      console.log("FeedbackTypes",response);
      this.feedbackTypes = response;
    })
  }

  findFeedbackNature(feedbackTypeID){
     this.feedbackTypeID = feedbackTypeID;
     var tempObj = {
       "feedbackTypeID": this.feedbackTypeID
     }
     this.FeedbackTypeService.getFeedbackNatureTypes(tempObj)
     .subscribe((response)=>{
       console.log("Feedback Nature Types",response);
       this.natureTypes = response;
       this.showTable = true;
     })
  }

  editFeedbackNature(feedbackObj){
    console.log("feedbackObj",feedbackObj);
    let dialog_Ref = this.dialog.open(EditFeedbackNatureModal, {
      width: '500px',
      data: {
        'feedbackObj': feedbackObj,
        'natureTypes': this.natureTypes 
      }
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.findFeedbackNature(this.feedbackTypeID);
      }

    });
  }

  clear(){
    this.searchCNForm.resetForm();
    console.log("state",this.search_state);
    console.log("serviceLine",this.search_serviceline);
    this.natureTypes = [];
    this.showTable = false;
  }

  activeDeactivate(id, flag){
    let obj = {
      "feedbackNatureID": id,
      "deleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm("Are you sure want to "+this.confirmMessage+"?").subscribe((res)=>{
      if (res) {
        console.log("reqObj",obj);
        this.FeedbackTypeService.deleteFeedbackNatureType(obj)
        .subscribe((res)=>{
          this.alertService.alert(this.confirmMessage+"d successfully");
          this.findFeedbackNature(this.feedbackTypeID);
        },
        (err)=>{
          console.log(err);
        })
      }
    },
    (err)=>{
      console.log(err);
    })
  }

  changeTableFlag(flag){
    this.searchForm = flag;
  }

  validateFeedbackNature(feedbackNature){
    // console.log("check",feedbackNature);
    this.natureExists = false;
    this.searchFeedbackNatureArray = this.natureTypes.concat(this.objs);
    console.log("searchArray",this.searchFeedbackNatureArray);
    let count = 0;
    for(var i=0; i< this.searchFeedbackNatureArray.length;i++){
      if(feedbackNature.toUpperCase()===this.searchFeedbackNatureArray[i].feedbackNature.toUpperCase()){
        // console.log("gotcha",feedbacknature,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if(count>0){
      // console.log("error found");
      this.natureExists = true;
    }
  }

  saveComplaintNature(){
    // console.log("dataObj", obj);
    var tempArr = [];
    for(var i=0; i < this.objs.length;i++){
      var tempObj = {
        "feedbackNature": this.objs[i].feedbackNature,
        "feedbackNatureDesc": this.objs[i].feedbackNatureDesc,
        "feedbackTypeID": this.feedbackTypeID,
        "createdBy": "Admin"
      }
      tempArr.push(tempObj);
    }
   
    console.log("reqObj", tempArr);
    this.FeedbackTypeService.saveFeedbackNatureType(tempArr)
    .subscribe((res)=>{
      console.log("response",res);
      this.searchForm = true;
      this.alertService.alert("Feedback Type saved successfully");
      this.addForm.resetForm();
      this.objs = [];
      this.findFeedbackNature(this.feedbackTypeID);
    })
  }

  add_obj(nature,desc){
    var tempObj = {
      "feedbackNature": nature,
      "feedbackNatureDesc": desc
    }
    console.log(tempObj);
    this.objs.push(tempObj);
    this.validateFeedbackNature(nature);
  }

  remove_obj(index){
    this.objs.splice(index,1);
  }

}

@Component({
  selector: 'editFeedbackNatureModal',
  templateUrl: './edit-feedback-nature-dialog.html',
})
export class EditFeedbackNatureModal {

  feedbackNature: any;
  feedbackNatureDesc: any;
  originalNature: any;
  searchFeedbackArray = [];
  natureExists: boolean = false;
  msg = "Complaint Nature already exists";

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
  public FeedbackTypeService: FeedbackTypeService,
  public dialog_Ref: MdDialogRef<EditFeedbackNatureModal>,
  private alertService: ConfirmationDialogsService) { }
  
  ngOnInit() {
    console.log("update this data",this.data);
    this.feedbackNature = this.data.feedbackObj.feedbackNature;
    this.originalNature = this.data.feedbackObj.feedbackNature;
    this.feedbackNatureDesc = this.data.feedbackObj.feedbackNatureDesc;
    this.searchFeedbackArray = this.data.natureTypes;
  }

  update(){
    var tempObj = {
      "feedbackNatureID": this.data.feedbackObj.feedbackNatureID,
      "feedbackNature": this.feedbackNature,
      "feedbackNatureDesc": this.feedbackNatureDesc,
      "modifiedBy": this.data.feedbackObj.createdBy
    }
    
    this.FeedbackTypeService.editFeedbackNatureType(tempObj)
    .subscribe((res)=>{
      this.dialog_Ref.close("success");
      this.alertService.alert("Feedback Type edited successfully");
    })
    
  }

  validateFeedback(feedbackNature){
    console.log("check",feedbackNature);
    this.natureExists = false;
    console.log("searchArray",this.searchFeedbackArray);
    let count = 0;
    for(var i=0; i< this.searchFeedbackArray.length;i++){
      if(feedbackNature.toUpperCase()===this.searchFeedbackArray[i].feedbackNature.toUpperCase() && feedbackNature.toUpperCase()!=this.originalNature.toUpperCase()){
        // console.log("gotcha",feedbackNature,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if(count>0){
      // console.log("error found");
      this.natureExists = true;
    }
  }
}