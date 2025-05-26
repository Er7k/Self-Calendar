document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('event-description');
    const counter = document.getElementById('char-count');
    const maxLength = textarea.getAttribute('maxlength');

    const dateInput = document.getElementById('event-date');
    const startTimeInput = document.getElementById('event-start');
    const endTimeInput = document.getElementById('event-end');

    const addEventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('title-input');
    const eventColorInput = document.getElementById('event-color');

    let events = [];

    /* FOR: DATE AND TIME SET AS DEFAULT TODAY'S DATE AND CURRENT TIME */
    if (dateInput && startTimeInput && endTimeInput) {
        const now = new Date();
        dateInput.value = now.toISOString().split('T')[0];

        const roundedHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();
        const startHour = Math.min(roundedHour, 22);
        const endHour = Math.min(startHour + 2, 23);

        const formatTime = hour => `${hour.toString().padStart(2, '0')}:00`;

        startTimeInput.value = formatTime(startHour);
        endTimeInput.value = formatTime(endHour);
    }

    /* FOR: CHARACTER COUNT IN DESCRIPTION BOX */
    textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
    });


    /*==== FOR MAKING SURE THE END-TIME > THE START-TIME==== */
    function parseTime(timeStr) {
        const [hour, minute] = timeStr.split(':').map(Number);
        return { hour, minute };
    }
    function formatTime(hour, minute = 0) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }



    /*==========FOR START TIME-INPUT=========*/
    startTimeInput.addEventListener('change', () => {
        const { hour: startHour, minute: startMin } = parseTime(startTimeInput.value);

        let newEndHour = startHour + 2;
        let newEndMin = startMin;

        if (newEndHour >= 24) {
            newEndHour = 23;
            newEndMin = 59;
        }

        endTimeInput.value = formatTime(newEndHour, newEndMin);
    });




    /*========FOR END TIME-INPUT========*/
    endTimeInput.addEventListener('change', () => {
        const start = parseTime(startTimeInput.value);
        const end = parseTime(endTimeInput.value);

        const startTotal = start.hour * 60 + start.minute;
        const endTotal = end.hour * 60 + end.minute;

        if(endTotal <= startTotal) {
            let correctedHour = start.hour;
            let correctedMinute = start.minute + 1;

            if(correctedMinute >= 60) {
                correctedMinute = 0;
                correctedHour += 1;
            }
            if(correctedHour >= 24) {
                correctedHour = 23;
                correctedMinute = 59;
            }

            endTimeInput.value = formatTime(correctedHour, correctedMinute);
        }

    });



    /* TO DISABLE THE START- AND END-TIME INPUT WHEN ALL-DAY-CHECKBOX IS CLICKED */
    function getDefaultTimes() {
        const now = new Date();
        const roundedHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();
        const startHour = Math.min(roundedHour, 22);
        const endHour = Math.min(startHour + 2, 23);

        const formatTime = (hour, minute = 0) =>
            `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        return {
            start: formatTime(startHour),
            end: formatTime(endHour)
        };
    }

    allDayCheckbox.addEventListener('change', () => {
        if(allDayCheckbox.checked) {
            startTimeInput.value = '00:01';
            endTimeInput.value = '23:59';
            startTimeInput.disabled = true;
            endTimeInput.disabled = true;
        } else {
            const times = getDefaultTimes();
            startTimeInput.value = times.start;
            endTimeInput.value = times.end;
            startTimeInput.disabled = false;
            endTimeInput.disabled = false;
        }
    });

    const toggleCategoryFormBtn = document.getElementById('toggle-category-form');
    const categoryForm = document.getElementById('category-form');
    const saveCategoryBtn = document.getElementById('save-category');
    const categoryNameInput = document.getElementById('input-category-name');
    const categoryColorInput = document.getElementById('input-category-color');
    const categoryList = document.getElementById('category-list');

// Show/hide form
    toggleCategoryFormBtn.addEventListener('click', () => {
        categoryForm.style.display = categoryForm.style.display === 'none' ? 'flex' : 'none';
    });

// Load categories
    function loadCategories() {
        const categories = JSON.parse(localStorage.getItem('eventCategories') || '[]');
        categoryList.innerHTML = '';

        categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'category-tag';
            li.style.backgroundColor = cat.color;
            li.textContent = cat.name;

            li.addEventListener('click', () => {
                document.querySelectorAll('.category-tag').forEach(c => c.classList.remove('active'));
                li.classList.add('active');
            });

            categoryList.appendChild(li);
        });
    }

// Save new category
    saveCategoryBtn.addEventListener('click', () => {
        const name = categoryNameInput.value.trim();
        const color = categoryColorInput.value;

        if (!name) return;

        const existing = JSON.parse(localStorage.getItem('eventCategories') || '[]');
        if (existing.some(c => c.name === name)) {
            alert("Category already exists!");
            return;
        }

        existing.push({ name, color });
        localStorage.setItem('eventCategories', JSON.stringify(existing));

        categoryNameInput.value = '';
        categoryColorInput.value = '#000000';
        categoryForm.style.display = 'none';
        loadCategories();
    });

    loadCategories();

    /*========SAVE NEW EVENT TO CALENDAR AND RE-RENDER CALENDAR========*/
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eventDate = dateInput.value;
        const eventTitle = document.getElementById('title-input').value.trim();
        const activeCategory = document.querySelector('.category-tag.active');
        // Read color from the active category
        const eventColor = activeCategory ? activeCategory.style.backgroundColor : '#000000';
        const startTime = document.getElementById('event-start').value;
        const endTime = document.getElementById('event-end').value;
        const description = document.getElementById('event-description').value;

        if (!eventTitle || !eventDate) {
            alert("Please fill in both the date and the event title!");
            return;
        }

        // Clear form
        eventTitleInput.value = '';
        eventColorInput.value = '#000000'; // This should probably be handled elsewhere
        const today = new Date();
        dateInput.value = today.toISOString().split('T')[0];

        let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

        const eventDetails = {
            date: eventDate,
            title: eventTitle,
            startTime: startTime,
            endTime: endTime,
            category: activeCategory ? activeCategory.textContent : 'Uncategorized',
            color: activeCategory ? activeCategory.style.backgroundColor : '#000000',
            description: description,
        };

        events.push(eventDetails);

        localStorage.setItem('calendarEvents', JSON.stringify(events));

        renderMonthView(new Date());  // Re-render the calendar to include the new event

        const activeCategoryTag = document.querySelector('.category-tag.active');
        if (activeCategoryTag) {
            activeCategoryTag.classList.remove('active');  // Remove active class after submission
        }
    });

});

