
/*--------AUTHOR: LOVISA--------*/


document.addEventListener('DOMContentLoaded', function() {
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventForm = document.getElementById('addEventForm');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const eventDateInput = document.getElementById('event-date');
    const eventTitleInput = document.getElementById('event-title');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const eventDescriptionInput = document.getElementById('event-description');
    const eventColorInput = document.getElementById('event-color');

    const eventViewPopup = document.getElementById('eventViewPopup');
    const eventTitlePopup = document.getElementById('popup-event-title');
    const eventDatePopup = document.getElementById('popup-event-date');
    const eventDescriptionPopup = document.getElementById('popup-event-description');
    const eventTimePopup = document.getElementById('popup-event-time');
    const eventColorPopup = document.getElementById('popup-event-color');
    const editEventBtn = document.getElementById('editEventBtn');
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    const closeEventPopupBtn = document.getElementById('closeEventPopupBtn');

    let events = {};

    addEventBtn.addEventListener('click', () => {
        addEventForm.style.display = 'block';
    });

    cancelEventBtn.addEventListener('click', () => {
        addEventForm.style.display = 'none';
    });

    saveEventBtn.addEventListener('click', () => {
        const eventDate = eventDateInput.value;
        const eventTitle = eventTitleInput.value.trim();
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const eventDescription = eventDescriptionInput.value.trim();
        const eventColor = eventColorInput.value;

        if (eventDate && eventTitle) {
            if (!events[eventDate]) {
                events[eventDate] = [];
            }

        const eventDetails = {
                title: eventTitle,
                startTime: startTime,
                endTime: endTime,
                description: eventDescription,
                color: eventColor
        };

         events[eventDate].push(eventDetails);

         displayEventOnCalendar(eventDate, eventDetails);

         eventDateInput.value = '';
         eventTitleInput.value = '';
         startTimeInput.value = '';
         endTimeInput.value = '';
         eventDescriptionInput.value = '';
         eventColorInput.value = '#ff0000';
         addEventForm.style.display = 'none';

        } else {
            alert("Please fill in both the date and the event title!");
        }
    });

    function displayEventOnCalendar(date, eventDetails) {
        const dayElements = document.querySelectorAll('.dayInMonth');
        dayElements.forEach((day) => {
            if (day.textContent === new Date(date).getDate().toString()) {
                const eventMarker = document.createElement('div');
                eventMarker.classList.add('event-marker');
                eventMarker.textContent = eventDetails.title;

                eventMarker.style.backgroundColor = eventDetails.color;

                eventMarker.addEventListener('click', () => showEventPopup(date, eventDetails));

                day.appendChild(eventMarker);
            }
        });
    }

    function showEventPopup(date, eventDetails) {
        eventTitlePopup.textContent = eventDetails.title;
        eventDatePopup.textContent = new Date(date).toDateString();
        eventDescriptionPopup.textContent = eventDetails.description || "No description provided.";
        eventTimePopup.textContent = `Time: ${eventDetails.startTime} - ${eventDetails.endTime}`;
        eventColorPopup.style.backgroundColor = eventDetails.color;

        eventViewPopup.style.display = 'block';
        eventViewPopup.dataset.eventDate = date;
        eventViewPopup.dataset.eventTitle = eventDetails.title;
        eventViewPopup.dataset.eventDetails = JSON.stringify(eventDetails);
    }

    closeEventPopupBtn.addEventListener('click', () => {
        eventViewPopup.style.display = 'none';
    });

    deleteEventBtn.addEventListener('click', () => {
        const eventDate = eventViewPopup.dataset.eventDate;
        const eventTitle = eventViewPopup.dataset.eventTitle;

        if (events[eventDate]) {
            events[eventDate] = events[eventDate].filter(event => event !== eventTitle);

            if (events[eventDate].length === 0) {
                delete events[eventDate];
            }
        }

        const dayElements = document.querySelectorAll('.dayInMonth');
        dayElements.forEach((day) => {
            if (day.textContent === new Date(eventDate).getDate().toString()) {
                const eventMarkers = day.querySelectorAll('.event-marker');
                eventMarkers.forEach(marker => {
                    if (marker.textContent === eventTitle) {
                        marker.remove();
                    }
                });
            }
        });

        eventViewPopup.style.display = 'none';

    });

    editEventBtn.addEventListener('click', () => {
        const eventDate = eventViewPopup.dataset.eventDate;
        const eventDetails = JSON.parse(eventViewPopup.dataset.eventDetails);

        eventDateInput.value = eventDate;
        eventTitleInput.value = eventDetails.title;
        startTimeInput.value = eventDetails.startTime;
        endTimeInput.value = eventDetails.endTime;
        eventDescriptionInput.value = eventDetails.description;
        eventColorInput.value = eventDetails.color;

        addEventForm.style.display = 'block';
        eventViewPopup.style.display = 'none';
    });

});