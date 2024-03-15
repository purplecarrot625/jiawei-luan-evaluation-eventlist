// Event listeners
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
    '<button class="createButton"><svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>Save</button><button class="cancelButton"><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>Cancel</button>';
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("createButton")) {
    const row = e.target.closest("tr");
    const eventName = row.cells[0].querySelector("input").value;
    const eventStart = row.cells[1].querySelector("input").value;
    const eventEnd = row.cells[2].querySelector("input").value;

    if (eventName === "" || eventStart === "" || eventEnd === "") {
      alert("Please enter all fields");
    } else {
      const event = new Event(eventName, eventStart, eventEnd);
      eventController.addEvent(event);
    }
  }

  if (e.target && e.target.classList.contains("updateButton")) {
    const row = e.target.closest("tr");
    const eventId = e.target.dataset.id;
    const eventName = row.cells[0].querySelector("input").value;
    const eventStart = row.cells[1].querySelector("input").value;
    const eventEnd = row.cells[2].querySelector("input").value;

    if (eventName !== "" && eventStart !== null && eventEnd !== null) {
      const updatedEvent = new Event(eventName, eventStart, eventEnd);
      eventController.updateEvent(eventId, updatedEvent);
    } else {
      alert("Please fill in all fields");
    }
  }

  if (e.target && e.target.classList.contains("cancelButton")) {
    const row = e.target.closest("tr");
    location.reload();
  }
});

