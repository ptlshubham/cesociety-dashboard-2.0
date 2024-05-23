import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventContentArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CompanyService } from 'src/app/core/services/company.service';
import { ToastrService } from 'ngx-toastr';
import { category, createEventId } from './data';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  category!: any[];
  submitted = false;
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

  calendarEvents: EventInput[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.formEditData = this.fb.group({
      employeeStatus: this.fb.array([])
    });
    this.getAllEmployeeDetails();
  }

  ngOnInit(): void {
    this.getAllAttandanceDetails();
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }
    ];
    this.submitted = false;
    // Validation
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
    eventContent: this.customizeEventContent.bind(this),
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap',
    events: this.calendarEvents,
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
  customizeEventContent(eventInfo: EventContentArg) {
    const eventEl = document.createElement('div');
    eventEl.innerHTML = `<div>${eventInfo.event.title}</div>`;
    return { domNodes: [eventEl] };
  }
  openModal(event?: any) {
    this.newEventDate = event;
    this.modalService.open(this.modalShow, { centered: true });
  }


  handleEventClick(clickInfo: EventClickArg) {
    debugger
    // const event = this.calendarEvents.find(e => e.id === eventId);
    // if (event) {
    //   this.selectedEvent = event;
    //   this.initializeEditForm(event);
    //   // Open your modal here
    // }
    this.editEvent = clickInfo.event;
    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory: clickInfo.event.classNames[0],
    });
    this.modalService.open(this.editmodalShow, { centered: true });
  }
  initializeEditForm(event: any) {
    const employeeStatus = this.formEditData.get('employeeStatus') as FormArray;
    employeeStatus.clear();

    this.employeeList.forEach((employee:any) => {
      const status = event.attendance.find((a:any) => a.employeeId === employee.id)?.status || 'Absent';
      employeeStatus.push(this.fb.group({
        employeeId: [employee.id],
        status: [status]
      }));
    });
  }

  // radioSelected(employeeId: number, status: string) {
  //   const employeeStatus = this.formEditData.get('employeeStatus') as FormArray;
  //   const control = employeeStatus.controls.find(c => c.value.employeeId === employeeId);
  //   if (control) {
  //     control.patchValue({ status });
  //   }
  // }
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  closeEventModal() {
    this.modalService.dismissAll();
  }
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 1000,
    });
  }

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

      this.position();
      this.attendance.reset();
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  editEventSave() {
    // const updatedEvent = {
    //   ...this.selectedEvent,
    //   attendance: this.formEditData.value.employeeStatus
    // };
    // console.log(updatedEvent);
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
    this.formEditData.reset();
    this.modalService.dismissAll();
  }

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
      this.staffModel.role = localStorage.getItem('Role');
    });
  }

  getAllAttandanceDetails() {
    this.companyService.getAttandanceData().subscribe((res: any) => {
      this.attendanceList = res;
      if (res && res.length > 0) {
        res.forEach((element: any) => {
          let color = '';
          if (element.status === 'Present') {
            color = 'bg-success text-white';
          } else if (element.status === 'Work From Home') {
            color = 'bg-warning text-white';
          } else if (element.status === 'Leave') {
            color = 'bg-danger text-white';
          }

          const date = new Date(element.date);
          const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());

          this.calendarEvents.push({
            id: element.id,
            title: element.name + ' : ' + element.status,
            start: start,
            className: color,
            allDay: false
          });
        });
        this.calendarOptions.events = [...this.calendarEvents]; // update events in calendarOptions
        debugger
      }
    });
  }

  saveAttendenceDetails() {
    this.companyService.SaveAttendanceDetails(this.employeeSelections).subscribe((res: any) => {
      this.attendanceList = res;
      this.getAllAttandanceDetails();
      this.toastr.success('Attendence Done Successfully.', 'Updated', { timeOut: 3000 });
      this.closeEventModal();
    });
  }

  radioSelected(employeeId: any, option: string) {
    const index = this.employeeSelections.findIndex((selection: any) => selection.employeeId === employeeId);
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
  }
  editAttendance(employeeId: any, option: string) {
    // Assuming this.employeeSelections contains the selected data for editing
    const selection = this.employeeSelections.find((sel: any) => sel.employeeId === employeeId && sel.option === option);
    if (selection) {
      this.formEditData.patchValue({
        editTitle: option,
        // editCategory: selection.category // Assuming there's a category property in selection
      });
    }
  }


}
