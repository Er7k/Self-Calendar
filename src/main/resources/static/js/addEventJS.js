

/*document.addEventListener('DOMContentLoaded', function () {
    const addEventButton = document.getElementById('add-event-button');
    const sidebarContainer = document.querySelector('.sidebar-container');
    const addEventForm = document.getElementById('event-form');

    const eventDateInput = document.getElementById('event-date');
    const eventTitleInput = document.getElementById('title-input');
    const eventColorInput = document.getElementById('event-color');

    // 🔁 Toggle sidebar flip
    addEventButton.addEventListener('click', () => {
        sidebarContainer.classList.toggle('sidebar-flip');
        addEventButton.classList.toggle('clicked');
    });

    // ✅ Save new event and re-render calendar
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eventDate = eventDateInput.value;
        const eventTitle = document.getElementById('title-input').value.trim();
        const eventColor = document.getElementById('event-color').value;

        if (!eventTitle || !eventDate) {
            alert("Please fill in both the date and the event title!");
            return;


        }

        displayEventOnCalendar(eventDate, {
            title: eventTitle,
            color: eventColor
        });


        // Clear form
        eventTitleInput.value = '';
        eventDateInput.value = '';
        eventColorInput.value = '#3f72af';
        sidebarContainer.classList.remove('sidebar-flip');
        addEventButton.classList.remove('clicked');

        // 🔄 Re-render calendar to apply changes (this uses your existing render function)
        if (typeof renderMonthView === 'function') {
            renderMonthView(new Date());
        }
    });
});
*/