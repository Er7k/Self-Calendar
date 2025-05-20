document.addEventListener('DOMContentLoaded', function() {

    const textarea = document.getElementById('event-description');
    const counter = document.getElementById('char-count');
    const maxLength = textarea?.getAttribute('maxlength');
    const dateInput = document.getElementById('event-date');
    const startTimeInput = document.getElementById('event-start');
    const endTimeInput = document.getElementById('event-end');
    const allDayCheckbox = document.getElementById('all-day');
    const addEventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('title-input');
    const eventColorInput = document.getElementById('event-color');
    const categoryTags = document.querySelectorAll('.category-tag');
    const addNewCategoryButton = document.getElementById('add-new');
    const categoryEditModal = document.getElementById('category-edit-modal');
    const categoryList = document.getElementById('category-list');
    const saveCategoriesBtn = document.getElementById('save-categories');
    const closeModalBtn = document.getElementById('close-modal');
    const eventModeButton = document.querySelector('.sidebar-add-event-mode');
    const taskModeButton = document.querySelector('.sidebar-add-task-mode');
    const eventForm = document.querySelector('.sidebar-event-form');
    const todoList = document.querySelector('.sidebar-to-do-list');

    let events = [];

    const userId = localStorage.getItem('userId');
    console.log('Retrieved userId from localstorage', userId)
    if (!userId) {
        console.error('User is not logged in');
        alert('Please log in to view events');
        window.location.href = '/login';
        return;
    }

    function fetchEvents() {
        console.log("Fetching events for userId" + userId);
        fetch(`/api/events?userId=${userId}`)
            .then(response => {
                console.log('Fetch response:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched events:', data);
                events = data.map(event => ({...event, color: '#FF0000'}));
                window.events = events;
                console.log('Updated events array:', events);
                window.renderMonthView(new Date());
            })
            .catch(error => {
                console.error('Failed to fetch events:', error.message);
                alert('Failed to load events. Please try again.');
            });
    }
    fetchEvents();

    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
        });
    }

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

    /*==== FOR MAKING SURE THE END-TIME > THE START-TIME==== */
    function parseTime(timeStr) {
        const [hour, minute] = timeStr.split(':').map(Number);
        return { hour, minute };
    }

    function formatTime(hour, minute = 0) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    function parseLocalDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
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

    /*========SAVE NEW EVENT TO CALENDAR AND RE-RENDER CALENDAR========*/
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();


        const eventDate = dateInput.value;
        const eventTitle = eventTitleInput.value.trim();
        const activeCategory = document.querySelector('.category-tag.active');
        const eventColor = '#FF0000'; // Hardcoded for testing
        const startTime = startTimeInput.value + ":00";
        const endTime = endTimeInput.value + ":00";
        const description = textarea.value;
        const allDay = allDayCheckbox.checked;

        if (!eventTitle || !eventDate) {
            alert("Please fill in both the date and the event title!");
            return;
        }

        const categoryName = activeCategory ? activeCategory.textContent : 'None';

        const eventDetails = {
            userId: parseInt(userId),
            title: eventTitle,
            date: eventDate,
            startTime: startTime,
            endTime: endTime,
            description: description,
            color: eventColor,
            recurring: false,
            allDay: allDay,
            category: categoryName
        };

        console.log('Saving event:', eventDetails);
        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventDetails)
        })
            .then(response => {
                console.log('POST response:', {status: response.status, ok: response.ok});
                if (!response.ok) {
                    throw new Error(`Failed to save event: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(savedEvent => {
                console.log('Event saved:', savedEvent);
                fetchEvents()
                //savedEvent.color = eventColor;
                //events.push(savedEvent);
                //window.renderMonthView(new Date());
                // Clear form
                eventTitleInput.value = '';
                eventColorInput.value = '#000000';
                dateInput.value = new Date().toISOString().split('T')[0];
                textarea.value = '';
                if (activeCategory) {
                    activeCategory.classList.remove('active');
                }
            })
            .catch(error => {
                console.error('Error saving event:', error.message);
                alert('Failed to save event to server');
            });
    });

    const categories = [
        { id: 'cat-1', name: 'Work', color: '#F8F25DFF'},
        { id: 'cat-2', name: 'School', color: '#48cd48'},
        { id: 'cat-3', name: 'Personal', color: '#00bbff'},
        { id: 'cat-4', name: 'Important', color: '#f84444'},
    ];

    function renderCategories() {
        categoryList.innerHTML = '';

        categories.forEach((category, index) => {
            const row = document.createElement('div');
            row.classList.add('category-row');
            row.dataset.index = index;

            const color = category.color || '#000000';


            row.innerHTML = `
            <div class="category-info">
               <button class="category-name-button" style="background-color: ${color};">
                   ${category.name}
               </button>
            </div>
            <div class="category-actions">
                <button class="edit-category-btn">
                    <i class="fa-solid fa-pen"></i>         
                </button>
                <button class="delete-category-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

            row.querySelector('.edit-category-btn').addEventListener('click', function () {
                const newName = prompt('Edit Category Name: ', category.name);
                const newColor = prompt('Edit Category Color(Hex): ', category.color);
                if (newName && newColor) {
                    categories[index] = {name: newName, color: newColor};
                    renderCategories();
                }
            });

            row.querySelector('.delete-category-btn').addEventListener('click', function () {
                if (confirm('Are you sure you want to delete the "${category.name}" category?')) {
                    categories.splice(index, 1);
                    renderCategories();
                }
            });
            categoryList.appendChild(row);
        });

    // Add "Add New Category" row
        const addRow = document.createElement('div');
        addRow.classList.add('category-row', 'add-new-category');
        addRow.innerHTML = '<span>+</span> Add New Category';

        addRow.addEventListener('click', function() {
            const newName = prompt('Enter new category name: ');
            const newColor = prompt('Enter new category color(Hex): ');
            if (newName && newColor) {
                categories.push({ name: newName, color: newColor});
                renderCategories();
            }
        });

        categoryList.appendChild(addRow);
    }

    addNewCategoryButton.addEventListener('click', function() {
        categoryEditModal.style.display = 'flex';
        renderCategories();
    });

    closeModalBtn.addEventListener('click', function() {
        categoryEditModal.style.display = 'none';
    });



    categoryTags.forEach(category => {
        category.addEventListener('click', function() {
            categoryTags.forEach(cat => cat.classList.remove('active'));

            category.classList.add('active');

            const selectedColor = category.getAttribute('data-color');
            console.log(selectedColor);
        });
    });


// Optionally close the modal if clicked outside the modal content area
    window.addEventListener('click', function(event) {
        if (event.target === categoryEditModal) {
            categoryEditModal.style.display = 'none'; // Hide the modal if clicked outside
        }
    });

// Show event form content by default
eventForm.classList.add('active');
todoList.classList.remove('active'); // Make sure to-do list is hidden by default

// Show event form when eventModeButton is clicked
    eventModeButton.addEventListener('click', function() {
        eventForm.classList.add('active'); // Show event form
        todoList.classList.remove('active'); // Hide to-do list
    });

// Show to-do list content when taskModeButton is clicked
    taskModeButton.addEventListener('click', function() {
        todoList.classList.add('active'); // Show to-do list
        eventForm.classList.remove('active'); // Hide event form
    });
});





