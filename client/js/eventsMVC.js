const API_URL = "http://localhost:3000/events";

class Event {
  constructor(eventName, startDate, endDate, id) {
    this.eventName = eventName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = id;
  }
}

class EventListView {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    this.table.addEventListener("click", this.handleTableClick.bind(this));
  }

  handleTableClick(e) {
    const eventId = e.target.dataset.id;

    if (e.target.classList.contains("editButton")) {
      const row = e.target.closest("tr");

      const eventName = row.cells[0].innerText;
      const startDate = row.cells[1].innerText;
      const endDate = row.cells[2].innerText;

      row.innerHTML = `
        <td><input type="text" placeholder="Event Name" value="${eventName}"></td>
        <td><input type="date" value="${startDate}"></td>
        <td><input type="date" value="${endDate}"></td>
        <td>
          <button class="updateButton" data-id="${eventId}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>Update</button>
          <button class="cancelButton"><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>Cancel</button>
        </td>
      `;
    } else if (e.target.classList.contains("deleteButton")) {
      eventController.deleteEvent(eventId);
    }
  }

  renderEventList(events) {
    while (this.table.rows.length > 1) {
      this.table.deleteRow(1);
    }

    events.forEach((event) => {
      const row = this.table.insertRow();
      row.setAttribute("data-id", event.id);
      row.innerHTML = `
                <td>${event.eventName}</td> 
                <td>${event.startDate}</td>
                <td>${event.endDate}</td>
               <td>
                <button class="editButton" data-id="${event.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>Edit</button>
                <button class="deleteButton" data-id="${event.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>Delete</button>
                </td>
            `;
    });
  }
}

class EventListController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.fetchEvents();
  }

  fetchEvents() {
    fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        this.view.renderEventList(data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }

  addEvent(event) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
      .then(() => this.fetchEvents())
      .catch((error) => console.error("Error adding event:", error));
  }

  deleteEvent(eventId) {
    fetch(`${API_URL}/${eventId}`, { method: "DELETE" })
      .then(() => this.fetchEvents())
      .catch((error) => console.error("Error deleting event:", error));
  }

  updateEvent(eventId, event) {
    fetch(`${API_URL}/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
      .then(() => this.fetchEvents())
      .catch((error) => console.error("Error updating event:", error));
  }
}

const eventView = new EventListView("eventTable");
const eventController = new EventListController({}, eventView);

