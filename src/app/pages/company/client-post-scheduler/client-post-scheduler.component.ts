import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, EventApi, EventClickArg, EventContentArg } from '@fullcalendar/core';

import Swal from 'sweetalert2';
import { CompanyService } from 'src/app/core/services/company.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-client-post-scheduler',
  templateUrl: './client-post-scheduler.component.html',
  styleUrl: './client-post-scheduler.component.scss'
})
export class ClientPostSchedulerComponent implements OnInit {
  // bread crumb items
  @Input() clientdata: any;

  calendarEvents: any[] = [];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  submitted = false;
  // event form
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;
  scheduleList: any = [];
  schedulerModel: any = {};
  editModel: any = {};
  private modalRef?: NgbModalRef;
  designerlist: any = [];
  designTypeList: any = [
    { name: 'Post' },
    { name: 'Reel' },
    { name: 'Story' },

  ]
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
  ) {
    this.setupDraggableEvents();
  }

  ngOnInit(): void {
    this.clientdata
    
    this._fetchData();
    // Validation
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      designer: ['', [Validators.required]]
    });

    // Edit Data Get
    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editDescription: [''],
      editDesigner: ['', [Validators.required]],
    });
  }

  /***
   * Calendar Set
   */
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
    initialEvents: this.calendarEvents, // Initially empty
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    droppable: true, // Allows things to be dropped onto the calendar
    // drop: this.handleEventReceive.bind(this)
  };
  currentEvents: EventApi[] = [];

  customizeEventContent(eventInfo: EventContentArg) {
    const eventEl = document.createElement('div');
    eventEl.innerHTML = `<div>${eventInfo.event.title}</div>`;
    return { domNodes: [eventEl] };
  }

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
    this.getAllDesigner();

    this.getAllTodoListDetails();
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
      editDescription: clickInfo.event.extendedProps.description,
      editDesigner: clickInfo.event.extendedProps.designerid,
    });
    this.modalService.open(this.editmodalShow, { centered: true });
  }

  /**
   * Events bind in calendar
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  /**
   * Close event modal
   */


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
      const description = this.formData.get('description')!.value;

      this.schedulerModel.clientid = this.clientdata.id;
      this.schedulerModel.managerid = localStorage.getItem('Eid');
      this.schedulerModel.date = this.newEventDate.startStr;
      this.schedulerModel.title = title;
      this.schedulerModel.description = description;
      
      this.companyService.SaveSchedulerDetails(this.schedulerModel).subscribe((res: any) => {
        this.scheduleList = res;
        this.getAllTodoListDetails();
        this.toastr.success('Todo Details Successfully Added.', 'Submitted', { timeOut: 3000 });
        this.closeEventModal();
        // this.modalRef?.close();

      });

      this.position();
      this.formData.reset();
      this.modalRef?.close();
      // this.modalService.dismissAll();
    }
    this.submitted = true;
  }
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      description: '',
    });

  }
  closeSpecificModal(modal: NgbModalRef) {
    modal.close();
  }

  getAllTodoListDetails() {
    this.companyService.getAllSchedulerList(this.clientdata.id).subscribe((res: any) => {
      this.scheduleList = res;
      if (res && res.length > 0) {
        this.calendarEvents = res.map((element: any) => ({
          id: element.id,
          title: element.title,
          description: element.description,
          start: new Date(element.date),
          allDay: false
        }));
        this.calendarOptions.events = [...this.calendarEvents]; // update events in calendarOptions
      }
    });
  }
  getAllDesigner() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.designerlist = res.filter((employee: any) => employee.role === 'Designer');
    })
  }

  /**
   * save edit event data
   */
  editEventSave() {
    const editTitle = this.formEditData.get('editTitle')!.value;
    const editDescription = this.formEditData.get('editDescription')!.value;
    const editDesigner = this.formEditData.get('editDesigner')!.value;
    this.editEvent.setProp('title', editTitle);
    this.editEvent.setProp('description', editDescription);
    this.editModel.id = this.editEvent.id;
    this.editModel.title = editTitle;
    this.editModel.description = editDescription;
    this.companyService.updateSchedulerById(this.editModel).subscribe((res: any) => {
      this.scheduleList = res;
      this.getAllTodoListDetails();
      this.toastr.success('Todo Details Successfully Updated.', 'Updated', { timeOut: 3000 });
      this.closeEventModal();
      this.modalRef?.close();
    });
    this.position();
    this.formEditData.reset();
    // this.modalService.dismissAll();
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
    this.companyService.removeSchedulerDataById(this.editEvent._def.publicId).subscribe((res: any) => {
      this.scheduleList = res;
      this.getAllTodoListDetails();
    });
    this.modalRef?.close();

    // this.modalService.dismissAll();
  }

  setupDraggableEvents() {
    const containerEl = document.getElementById('external-events');
    if (containerEl) {
      const draggableEl = containerEl.querySelectorAll('.external-event');

      draggableEl.forEach(el => {
        el.addEventListener('dragstart', function (e) {
          const dragEvent = e as DragEvent;
          dragEvent.dataTransfer?.setData('text/plain', (dragEvent.target as HTMLElement).getAttribute('data-event') || '');
        });
      });

      containerEl.addEventListener('dragend', function (e) {
        e.preventDefault();
      });
    }
  }
}