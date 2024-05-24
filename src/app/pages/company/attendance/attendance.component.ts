import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventContentArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from 'src/app/core/services/company.service';
import { ToastrService } from 'ngx-toastr';

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
  tempAttandance: any = [];
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
    this.editEvent = clickInfo.event;
    const selectedDate = this.editEvent.start;

    const formatDate = (date: Date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
    };

    const formattedSelectedDate = formatDate(selectedDate);
    this.tempAttandance = [];

    this.attendanceList.forEach((element: any) => {
      const formattedElementDate = formatDate(element.date);
      if (formattedElementDate === formattedSelectedDate) {
        debugger
        this.tempAttandance.push(element);
      }
    });

    this.modalService.open(this.editmodalShow, { centered: true });
  }


  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  closeEventModal() {
    this.modalService.dismissAll();
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
      this.employeeSelections = [];
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

}
