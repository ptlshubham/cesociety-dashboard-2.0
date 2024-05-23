
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { category, calendarEvents, createEventId } from './data';
import { CompanyService } from 'src/app/core/services/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  calendarEvents!: any[];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  category!: any[];
  submitted = false;
  // event form
  paginateData: any = [];
  filterData: any = [];
  collectionSize = 0;
  page = 1;
  pageSize = 10;
  staffModel: any = {};
  attendanceList: any = [];
  attendance!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;
  employeeList: any = [];
  employeeSelections: { employeeId: any, option: string, startDate: string }[] = [];


  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,


  ) { }

  ngOnInit(): void {
    this._fetchData();
    this.getAllEmployeeDetails();

    // VAlidation

    //Edit Data Get
    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: [],
    });
    this.attendance = this.formBuilder.group({
      present: ['', Validators.required],
      workfromhome: ['', Validators.required],
      leave: ['', Validators.required]
    });
  }
  get f() { return this.attendance.controls; }

  /***
   * Calender Set
   */
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
    debugger
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
    // this.attendance = this.formBuilder.group({
    //   present: ['', Validators.required],
    //   workfromhome: ['', Validators.required],
    //   Leave: ['', Validators.required]
    // });
    this.modalService.dismissAll();
  }

  /**
   * Event Data Get
   */
  get form() {
    return this.attendance.controls;
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
    if (this.attendance.valid) {
      const title = this.attendance.get('title')!.value;
      const className = this.attendance.get('category')!.value;
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
      this.attendance = this.formBuilder.group({
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
  getPagintaion() {
    this.paginateData = this.filterData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      debugger
      this.staffModel.role = localStorage.getItem('Role')
    })
  }

  saveAttendenceDetails() {
    debugger;
    this.companyService.SaveAttendanceDetails(this.employeeSelections).subscribe((res: any) => {
      this.attendanceList = res;
      this.toastr.success('Attendence Done Successfully.', 'Updated', { timeOut: 3000, });
      this.closeEventModal();
      this.attendanceList = [];
    });
  }

  radioSelected(employeeId: any, option: string) {
    const index = this.employeeSelections.findIndex((selection: any) => selection.employeeId === employeeId);
    debugger
    if (index > -1) {
      this.employeeSelections[index] = {
        employeeId: employeeId,
        option: option,
        startDate: this.newEventDate.startdate
      };
    } else {
      this.employeeSelections.push({
        employeeId: employeeId,
        option: option,
        startDate: this.newEventDate.startStr
      });
    }
    console.log('Employee Selections:', this.employeeSelections);
  }
}
