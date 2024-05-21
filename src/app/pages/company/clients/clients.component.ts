import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EventApi, CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { category, calendarEvents, createEventId } from './data';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  multiDefaultOption = 'Adam';
  medialist: any = [
    { name: 'IG' },
    { name: 'FB' },
    { name: 'TW' },
    { name: 'LI' },
    { name: 'GMB' },
    { name: 'YT' },

  ];
  selectedmedialist: any;
  submitted = false;
  clientData: any = []
  staffModel: any = {};
  clientModel: any = {};
  category!: any[];
  isOpen: boolean = false;
  isUpdate: boolean = false;
  editFile: boolean = true;
  removeUpload: boolean = false;
  designerlist: any = [];
  managerlist: any = []
  clientsData: any = [];
  hasclientdata: boolean = false;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  employeeList: any = [];

  cardImageBase64: any;
  clientlogo: any = null;

  validationForm!: FormGroup;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  assignedEmpData: any = [];
  assignedDesignerList: any = [];
  assignedManagerList: any = [];
  breadCrumbItems!: Array<{}>;
  calendarEvents!: any[];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;
  constructor(
    public formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
    private modalService: NgbModal
  ) { }
  ngOnInit(): void {
    this._fetchData();
    this.getStaffDetails();
    this.getClientsDetails();

    // VAlidation
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    //Edit Data Get
    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: [],
    });

    this.validationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      bussinesstype: ['', [Validators.required]],
      media: ['', [Validators.required]],
      post: ['', [Validators.required]],
      story: ['', [Validators.required]],
      reels: ['', [Validators.required]],
      extra: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      designersrole: ['', [Validators.required]],
      instaid: [''],
      instapass: [''],
      facebooklink: [''],
      twitterlink: [''],
      linkedinlink: [''],
      youtubelink: ['']
    });
  }
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    initialEvents: calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];

  /**
   * Event add modal
   */
  openModal(event?: any) {
    this.newEventDate = event;
    this.modalService.open(this.modalShow, { centered: true });
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }];

    // Event category
    this.category = category;

    // Calender Event Data
    this.calendarEvents = calendarEvents;

    // form submit
    this.submitted = false;
  }

  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;
    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory: clickInfo.event.classNames[0],
    });
    this.modalService.open(this.editmodalShow, { centered: true });
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      category: '',
    });
    this.modalService.dismissAll();
  }

  /**
   * Event Data Get
   */
  get form() {
    return this.formData.controls;
  }

  /***
   * Model Position Set
   */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Save the event
   */
  saveEvent() {
    if (this.formData.valid) {
      const title = this.formData.get('title')!.value;
      const className = this.formData.get('category')!.value;
      const calendarApi = this.newEventDate.view.calendar;
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: this.newEventDate.startStr,
        end: this.newEventDate.endStr,
        allDay: this.newEventDate.allDay,
        className: className + ' ' + 'text-white'
      });
      console.log('titl', calendarApi);


      this.position();
      this.formData = this.formBuilder.group({
        title: '',
        category: '',
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  /**
   * save edit event data
   */
  editEventSave() {
    const editTitle = this.formEditData.get('editTitle')!.value;
    const editCategory = this.formEditData.get('editCategory')!.value;

    const editId = this.calendarEvents.findIndex(
      (x) => x.id + '' === this.editEvent.id + ''
    );

    this.editEvent.setProp('title', editTitle);
    this.editEvent.setProp('classNames', editCategory);

    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id: this.editEvent.id,
      classNames: editCategory,
    };
    this.position();
    this.formEditData = this.formBuilder.group({
      editTitle: '',
      editCategory: '',
    });
    this.modalService.dismissAll();
  }

  /**
   * Delete-confirm
   */
  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.deleteEventData();
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
      }
    });
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.dismissAll();
  }
  get f() { return this.validationForm.controls }
  formatSelectedMedia(mediaArray: any[]): string {
    const formattedMedia = mediaArray.map(media => media.name).join(', ');
    this.clientModel.selectedmedia = formattedMedia;
    debugger
    return formattedMedia;
  }
  selectedMediaList(e: any): void {
    this.selectedmedialist = e.target.value;
  }

  getStaffDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.designerlist = res.filter((employee: any) => employee.role === 'Designer');
      this.managerlist = res.filter((employee: any) => employee.role === 'Manager');
    })
  }
  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 200 && img.height === 200) {
        if (event.target.files && event.target.files[0]) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageUrl = reader.result;
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.companyService.SaveClientImage(formdata).subscribe((response) => {
              this.clientlogo = response;
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.editFile = false;
              this.removeUpload = true;

            })
          }
        }
      } else {
        this.imageUrl = 'assets/images/file-upload-image.jpg';
        this.clientlogo = null;
        this.toastr.error('Please upload an image with dimensions of 200x200px', 'Invalid Dimension', { timeOut: 3000, });
      }
    };
  }
  removeUploadedImage() {
    this.clientlogo = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
    })
  }
  SaveClientDetails() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.clientModel.profile = this.clientlogo;
      this.companyService.SaveClientDetails(this.clientModel).subscribe((res: any) => {
        this.clientData = res;
        this.toastr.success('Client Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.clientModel = {};
        this.validationForm.markAsUntouched();
        this.BackToTable()
      });
    }
  }
  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      res.forEach((element: any, index: number) => {
        if (res.length > 0) {
          const mediaArray = element.media.split(',').map((item: any) => item.trim());
          res[index].mediaArray = mediaArray;
          this.companyService.getAssignedEmpDetailsById(element.id).subscribe((data: any) => {
            res[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
            res[index].assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
          })
        }
      });
      this.clientsData = res;
      for (let i = 0; i < this.clientsData.length; i++) {
        this.clientsData[i].index = i + 1;
      }
      this.collectionSize = this.clientsData.length;
      debugger
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.clientsData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  removeClientsDetails(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.companyService.removeClientDetailsById(id).subscribe((req) => {
        })
        Swal.fire('Deleted!', 'Client details has been deleted.', 'success');

      }
    });

  }
  openAddClients() {
    this.isOpen = true;
    this.isUpdate = false;
    this.clientModel = {};
    this.validationForm.markAsUntouched();
    this.clientlogo = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  openUpdateClients(data: any) {
    // this.selectedmedialist = data.media;
    this.imageUrl = 'http://localhost:9000' + data.profile_image
    this.clientModel.profile = data.profile_image;
    this.clientModel = data;
    this.isOpen = true;
    this.isUpdate = true;
  }
  BackToTable() {
    this.isOpen = false;
    this.isUpdate = false;
    this.validationForm.markAsUntouched();
    this.getClientsDetails();
  }
  openAttendance(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }
}
