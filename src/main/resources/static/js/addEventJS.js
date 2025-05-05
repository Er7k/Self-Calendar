document.addEventListener('DOMContentLoaded', function() {
    const addEventButton = document.getElementById('add-event-button');
    const sidebarContainer = document.querySelector('.sidebar-container');
    const addEventForm = document.getElementById('event-form');
    const saveEventBtn = addEventForm.querySelector('button[type="submit"]');
    const eventDateInput = document.getElementById('event-date');
    const eventTitleInput = document.getElementById('event-title');

    const eventContainer = document.querySelector('.calendar-dates');
    let events = {};

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function generateCalendar(month, year) {
        eventContainer.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const firstDayIndex = firstDay.getDay();

        const totalDaysInMonth = new Date(year, month, + 1, 0).getDate();

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            eventContainer.appendChild(emptyCell);
        }

        for (let day = 1; day <= totalDaysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;

            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayDiv.dataset.date = fullDate;

            if (events[fullDate]) {
                events[fullDate].forEach(event=> {
                    const eventMarker = document.createElement('i');
                    eventMarker.classList.add('div');
                    eventMarker.style.fontSize = '1.2rem';
                    eventMarker.style.color = event.color;
                    dayDiv.appendChild(eventMarker);
                });
            }
            eventContainer.appendChild(dayDiv);
        }
    }

    generateCalendar(currentMonth, currentYear);

    document.getElementById('prev-month').addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        } generateCalendar(currentMonth, currentYear);
    });

    addEventButton.addEventListener('click', () => {
        sidebarContainer.classList.toggle('sidebar-flip');
        addEventButton.classList.toggle('clicked');
    });

    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventDate = eventDateInput.value;
        const eventTitle = eventTitleInput.value.trim();
        const eventColor = document.getElementById('event-color').value;

        if (eventDate && eventTitle) {
            if (!events[eventDate]) {
                events[eventDate] = [];
            }

            const eventDetails = {
                title: eventTitle,
                color: eventColor  // Default color for the dot
            };

            events[eventDate].push(eventDetails);
            displayEventOnCalendar(eventDate, eventDetails);

            eventDateInput.value = '';
            eventTitleInput.value = '';
            document.getElementById('event-color').value = '#3f72af';

            sidebarContainer.classList.remove('sidebar-flip');
        } else {
            alert("Please fill in both the date and the event title!");
        }
    });

    function displayEventOnCalendar(date, eventDetails) {
        const dayElements = document.querySelectorAll('.calendar-dates div');
        dayElements.forEach((day) => {

            const calendarDate = day.dataset.date;

            if (calendarDate === date) {
                // Create the icon element for the event
                const eventMarker = document.createElement('div');  // Corrected this line
                eventMarker.classList.add('event-marker');
                eventMarker.textContent = eventDetails.title;  // Set the color of the icon (default color)

                eventMarker.style.backgroundColor = eventDetails.color;
                // Append the icon to the day cell
                day.appendChild(eventMarker);
            }
        });
    }
});