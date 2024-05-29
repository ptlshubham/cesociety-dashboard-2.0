import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, EventApi, EventClickArg, EventContentArg } from '@fullcalendar/core';

import Swal from 'sweetalert2';
import { category } from './data';
import { CompanyService } from 'src/app/core/services/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  calendarEvents: any[] = [];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  category!: any[];
  submitted = false;
  // event form
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;
  todoList: any = [];
  todoModel: any = {};
  editModel: any = {};
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
  ) {
    this.setupDraggableEvents();
  }

  ngOnInit(): void {
    this._fetchData();
    // Validation
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: [''],

    });

    // Edit Data Get
    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: [],
      editDescription: [''],
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
    // BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }];

    // Event category
    this.category = category;

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
      editCategory: clickInfo.event.classNames[0],
      editDescription: clickInfo.event.extendedProps.description,

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
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      description: '',
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
      const description = this.formData.get('description')!.value;


      this.todoModel.empid = localStorage.getItem('Eid');
      this.todoModel.title = title;
      this.todoModel.category = className + ' ' + 'text-white';
      this.todoModel.date = this.newEventDate.startStr;
      this.todoModel.description = description;

      this.companyService.SaveTodoDetails(this.todoModel).subscribe((res: any) => {
        this.todoList = res;
        this.getAllTodoListDetails();
        this.toastr.success('Todo Details Successfully Added.', 'Submitted', { timeOut: 3000 });
        this.closeEventModal();
      });

      this.position();
      this.formData.reset();
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  getAllTodoListDetails() {
    this.companyService.getTodoListDataById(localStorage.getItem('Eid')).subscribe((res: any) => {
      this.todoList = res;
      if (res && res.length > 0) {
        this.calendarEvents = res.map((element: any) => ({
          id: element.id,
          title: element.title,
          description: element.description,
          start: new Date(element.date),
          className: element.category,
          allDay: false
        }));
        this.calendarOptions.events = [...this.calendarEvents]; // update events in calendarOptions
      }
    });
  }

  /**
   * save edit event data
   */
  editEventSave() {
    const editTitle = this.formEditData.get('editTitle')!.value;
    const editCategory = this.formEditData.get('editCategory')!.value;
    const editDescription = this.formEditData.get('editDescription')!.value;
    
    this.editEvent.setProp('title', editTitle);
    this.editEvent.setProp('classNames', editCategory);
    this.editEvent.setProp('description', editDescription);
    this.editModel.id = this.editEvent.id;
    this.editModel.title = editTitle;
    this.editModel.category = editCategory;
    this.editModel.description = editDescription;
    
    this.companyService.updateTodoListDataById(this.editModel).subscribe((res: any) => {
      this.todoList = res;
      this.getAllTodoListDetails();
      this.toastr.success('Todo Details Successfully Updated.', 'Updated', { timeOut: 3000 });
      this.closeEventModal();
    });
    this.position();
    this.formEditData.reset();
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
    this.companyService.removeTodoListDataById(this.editEvent._def.publicId).subscribe((res: any) => {
      this.todoList = res;
      this.getAllTodoListDetails();
    });
    this.modalService.dismissAll();
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

  // handleEventReceive(event: any) {
  //   const eventData = event.draggedEl.getAttribute('data-event');
  //   event.event.setProp('title', eventData);
  // }

  // handleEventReceive(event: any) {
  //   const eventData = event.draggedEl.getAttribute('data-event');
  //   event.event.setProp('title', eventData);
  // }
}
