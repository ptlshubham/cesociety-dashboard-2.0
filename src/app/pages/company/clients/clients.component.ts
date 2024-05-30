import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
import { Howl } from 'howler';
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
  clientModel: any = {};
  category!: any[];
  isOpen: boolean = false;
  isUpdate: boolean = false;

  searchQuery: string = '';
  designerlist: any = [];
  managerlist: any = []
  clientsData: any = [];
  hasclientdata: boolean = false;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  clientlogo: any = null;
  isDesignerChange: boolean = false;
  isManagerChange: boolean = false;
  employeeList: any = [];
  clientlist: any = []

  validationForm!: FormGroup;
  page = 1;
  pageSize = 50;
  collectionSize = 0;
  paginateData: any = [];
  assignedEmpData: any = [];
  assignedDesignerList: any = [];
  assignedManagerList: any = [];
  breadCrumbItems!: Array<{}>;
  comapanyRole: any = localStorage.getItem('Role');

  formData!: UntypedFormGroup;
  filterClientList: any = [];
  selectedClientData: any = {};
  sound: any = new Howl({
    src: ['assets/audio/notification.mp3']
  });
  roleWiseData: any = [];
  constructor(
    public formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
    private modalService: NgbModal,

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
  };
  currentEvents: EventApi[] = [];

  private _fetchData() {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }];


  }
  get f() { return this.validationForm.controls }

  handleMediaChange(event: any) {
    this.formatSelectedMedia(this.clientModel.media);
    this.selectedMediaList(event);
  }
  designerChange(event: any) {
    this.isDesignerChange = true;
  }
  managerChange(event: any) {
    this.isManagerChange = true;
  }

  formatSelectedMedia(mediaArray: any[]): string {
    const formattedMedia = mediaArray.map(media => media.name).join(', ');
    this.clientModel.selectedmedia = formattedMedia;
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
        this.clientsData = res;
        this.toastr.success('Client Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.clientModel = {};
        this.validationForm.markAsUntouched();
        this.BackToTable()
      });
    }
  }
  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      let pendingRequests = res.length;

      if (pendingRequests === 0) {
        this.clientsData = res;
        this.getEmployeeWiseData();
        return;
      }

      res.forEach((element: any, index: number) => {
        const mediaArray = element.media.split(',').map((item: any) => item.trim());
        res[index].mediaArray = mediaArray;

        this.companyService.getAssignedEmpDetailsById(element.id).subscribe((data: any) => {
          res[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
          res[index].assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
          pendingRequests--;

          if (pendingRequests === 0) {
            this.clientsData = res;
            this.getEmployeeWiseData();
          }
        });
      });
    });
  }

  getEmployeeWiseData() {
    const eid = Number(localStorage.getItem('Eid')); // Convert eid to a number
    this.roleWiseData = []; // Initialize or clear the roleWiseData array

    // Helper function to filter clients by assigned roles
    const filterByRole = (roleKey: string) => {
      this.clientsData.forEach((element: any) => {
        element[roleKey].forEach((assigned: any) => {
          if (assigned.empid === eid) {
            this.roleWiseData.push(element);
          }
        });
      });
    };

    // Determine the role and filter accordingly
    if (this.comapanyRole === 'Designer') {
      filterByRole('assignedDesigners');
    } else if (this.comapanyRole === 'Manager' || this.comapanyRole === 'SubAdmin') {
      filterByRole('assignedManagers');
    }

    // Assign index to each element and set collection size
    const dataToProcess = this.roleWiseData.length ? this.roleWiseData : this.clientsData;
    dataToProcess.forEach((element: any, index: number) => {
      element.index = index + 1;
    });

    this.collectionSize = dataToProcess.length;
    this.filterClientList = [...dataToProcess];

    // Call pagination function
    this.getPagintaion();
  }

  applySearchFilter() {
    debugger
    this.page = 1; // Reset the page when the search query changes

    // Determine the correct data set to filter
    const dataToFilter = this.comapanyRole === 'Designer' ? this.roleWiseData : this.clientsData;

    // Apply search filter
    this.filterClientList = dataToFilter.filter((client: any) =>
      client.name.toLowerCase().includes(this.searchQuery.toLowerCase())

    );

    // Call pagination function
    this.getPagintaion();
  }

  getPagintaion() {
    this.paginateData = this.filterClientList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
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
    const mediaArray = data.media.split(',').map((mediaType: string) => mediaType.trim());

    // Map the media types to their corresponding objects in the medialist
    this.clientModel.media = mediaArray.map((mediaType: string) => {
      return this.medialist.find((media: any) => media.name === mediaType);
    });

    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.designerlist = res.filter((employee: any) => employee.role === 'Designer');
      this.managerlist = res.filter((employee: any) => employee.role === 'Manager');
    })
    this.companyService.getAssignedEmpDetailsById(data.id).subscribe((data: any) => {
      const assignedDesignerList = data.filter((employee: any) => employee.role === 'Designer');
      const assignedManagerList = data.filter((employee: any) => employee.role === 'Manager');
      this.clientModel.designers = assignedDesignerList;
      this.clientModel.managers = assignedManagerList;
    })

    this.imageUrl = 'http://localhost:9000' + data.logo;
    this.clientModel.profile = data.logo;
    this.clientModel = data;
    this.isOpen = true;
    this.isUpdate = true;
    this.isDesignerChange = false;
    this.isManagerChange = false;
  }
  updateClientDetails() {
    if (this.clientlogo != null || undefined) {
      this.clientModel.profile = this.clientlogo;
    }
    if (this.isDesignerChange) {
      var updatedDesigners: any = [];
      this.clientModel.designers.forEach((element: any) => {
        if (this.clientModel.designers.length) {
          updatedDesigners.push({ empid: element.id });
        }
        this.clientModel.updatedDesigners = updatedDesigners;
      });
    }
    else {
      this.clientModel.updatedDesigners = this.clientModel.designers
    }
    if (this.isManagerChange) {
      var updatedManagers: any = [];
      this.clientModel.managers.forEach((element: any) => {
        if (this.clientModel.managers.length) {
          updatedManagers.push({ empid: element.id });
        }
        this.clientModel.updatedManagers = updatedManagers;

      });
    }
    else {
      this.clientModel.updatedManagers = this.clientModel.managers
    }

    // this.clientModel.designers;
    // this.clientModel.managers

    this.companyService.updateClientData(this.clientModel).subscribe((res: any) => {
      this.clientsData = res;
      this.toastr.success('Update Staff Details Successfully.', 'Updated', { timeOut: 3000, });
      this.getClientsDetails();
      this.isOpen = false;
    })
  }
  BackToTable() {
    this.isOpen = false;
    this.isUpdate = false;
    this.validationForm.markAsUntouched();
    this.getClientsDetails();
  }
  openClientCalander(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }

  extraLarge(exlargeModal: any, data: any) {
    this.selectedClientData = data;
    this.modalService.open(exlargeModal, { size: 'xl', windowClass: 'modal-holder', centered: true });
  }

  playSound() {
    this.sound.play();
  }
  getAllClientDetails(id: any) {
    this.companyService.getClientDetailsById(id).subscribe((res: any) => {
      this.clientlist = res;
    })
  }
}
