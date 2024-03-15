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
          <button class="updateButton" data-id="${eventId}">Update</button>
          <button class="cancelButton">Cancel</button>
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
                <button class="editButton" data-id="${event.id}">Edit</button>
                <button class="deleteButton" data-id="${event.id}">Delete</button>
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

document.getElementById("addEventButton").addEventListener("click", () => {
  const newRow = eventView.table.insertRow();
  const nameInputCell = newRow.insertCell(0);
  const startInputCell = newRow.insertCell(1);
  const endInputCell = newRow.insertCell(2);
  const actionCell = newRow.insertCell(3);

  nameInputCell.innerHTML = '<input type="text" placeholder="Event Name">';
  startInputCell.innerHTML = '<input type="date">';
  endInputCell.innerHTML = '<input type="date">';

  actionCell.innerHTML =
    '<button class="createButton">Save</button><button class="cancelButton">Cancel</button>';
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("createButton")) {
    const row = e.target.closest("tr");
    const eventName = row.cells[0].querySelector("input").value;
    const eventStart = row.cells[1].querySelector("input").value;
    const eventEnd = row.cells[2].querySelector("input").value;

    const event = new Event(eventName, eventStart, eventEnd);
    eventController.addEvent(event);
  }

  if (e.target && e.target.classList.contains("updateButton")) {
    const row = e.target.closest("tr");
    const eventId = e.target.dataset.id;
    const eventName = row.cells[0].querySelector("input").value;
    const eventStart = row.cells[1].querySelector("input").value;
    const eventEnd = row.cells[2].querySelector("input").value;

    const updatedEvent = new Event(eventName, eventStart, eventEnd);
    eventController.updateEvent(eventId, updatedEvent);
  }

  if (e.target && e.target.classList.contains("cancelButton")) {
    const row = e.target.closest("tr");
    row.remove();
  }
});

