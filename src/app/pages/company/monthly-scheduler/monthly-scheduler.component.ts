import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventApi, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Swal from 'sweetalert2';
import { category, calendarEvents, createEventId } from './data';
import { CompanyService } from 'src/app/core/services/company.service';



@Component({
  selector: 'app-monthly-scheduler',
  templateUrl: './monthly-scheduler.component.html',
  styleUrl: './monthly-scheduler.component.scss'
})
export class MonthlySchedulerComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  calendarEvents!: any[];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  category!: any[];
  submitted = false;
  monthData: any = [];
  completedData: any = [];

  // event form
  formData!: UntypedFormGroup;
  @Input() clientdata: any;

  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    eventContent: this.customizeEventContent.bind(this),
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
    // select: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  customizeEventContent(eventInfo: EventContentArg) {
    const eventEl = document.createElement('div');
    eventEl.innerHTML = `<div>${eventInfo.event.title}</div>`;
    return { domNodes: [eventEl] };
  }

  currentEvents: EventApi[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService
  ) {
    this.getAllDailyWork();
  }

  ngOnInit(): void {
    this._fetchData();

    //Edit Data Get
    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: [],
    });
  }
  getAllDailyWork() {
    this.companyService.getAllDailyList().subscribe((data: any) => {

      const clientId = this.clientdata.clientid; // Extract clientid
      const [selectedYear, selectedMonth] = this.clientdata.selectedMonth.split('-').map(Number); // Extract and parse year and month

      // Filter the data array based on clientid, year, and month
      const filteredData = data.filter((item: any) => {
        const itemDate = new Date(item.date); // Parse the date string
        const itemYear = itemDate.getFullYear(); // Get year from the date
        const itemMonth = itemDate.getMonth() + 1; // Get month from the date (0-11, so add 1 to match YYYY-MM format)

        return item.clientid == clientId && itemYear == selectedYear && itemMonth == selectedMonth;
      });
      const completedTasks = filteredData.filter((item: any) => item.completeddate != null);
      this.completedData = completedTasks;

      // Store the filtered data in this.clientdata.monthData
      this.monthData = filteredData;

      // Optionally, do something with the filteredData, like updating the UI
      console.log(this.clientdata.monthData);
      if (this.monthData && this.monthData.length > 0) {
        this.calendarEvents = this.monthData.map((element: any) => ({
          id: element.id,
          title: element.title,
          description: element.description,
          start: new Date(element.date),
          allDay: false
        }));
      }
      if (this.completedData.length > 0) {
        const compTasks = this.completedData.map((element: any) => ({
          id: element.id,
          title: element.title,
          description: element.description,
          className: 'bg-success text-white',
          start: new Date(element.date),
          allDay: false
        }));
        this.calendarOptions.events = [...this.calendarEvents, ...compTasks];

      }
    });
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

}
