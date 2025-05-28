document.addEventListener('DOMContentLoaded', function () {
    const weekViewBtn = document.getElementById('week-view');
    const dayViewBtn = document.getElementById('day-view-button');
    const calendarRows = document.querySelectorAll('.calendar-row'); // Select all week rows
    const currentDate = new Date();
    const allDays = document.querySelectorAll('.calendar-dates > div');
    const calendarContainer = document.querySelector('.calendar-dates');
    const expandedDayContainer = document.querySelector('expanded-day');
    const expandedDayHeader = document.querySelector('.expanded-day .day-header');

    let weekStartDate = new Date();

    // Function to calculate the current week number (1-based)
    function getWeekNumber(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const days = Math.floor(diff / oneDay);
        return Math.ceil(days / 7);
    }

    function formatDateForHeader(date) {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const weekday = weekdays[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];

        return `${weekday}, the ${dayOfMonth}${getDaySuffix(dayOfMonth)} of ${month}`;
    }

    // Function to get the suffix for the day (e.g., 1st, 2nd, 3rd, 21st, etc.)
    function getDaySuffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Function to toggle the week view (expand current week and collapse others)
    function toggleWeekView() {
        const currentWeekNumber = getWeekNumber(currentDate); // Get the current week number
        calendarRows.forEach((row, index) => {
            if (index + 1 === currentWeekNumber) {
                // Expand the current week row
                row.classList.add('expanded');
                row.classList.remove('collapsed', 'blurred');
            } else {
                // Collapse and blur other week rows
                row.classList.add('collapsed');
                row.classList.add('blurred');
                row.classList.remove('expanded');
            }
        });
    }


    function toggleDayView(clickedDay) {
        const currentDay = clickedDay || currentDate.getDate();
        allDays.forEach(day => {
            if (parseInt(day.textContent) === currentDay) {
                day.classList.add('expanded-day');
                day.classList.remove('collapsed', 'blurred');
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDay);
                expandedDayHeader.textContent = formatDateForHeader(dayDate);
                expandedDayContainer.classList.add('show-expanded');
            } else {
                day.classList.add('collapsed');
                day.classList.add('blurred');
                day.classList.remove('expanded-day');
            }
        });

        document.querySelector('.calendar-days').classList.add('hide-weekdays');

    }

    // Event listener for the week view button
    weekViewBtn.addEventListener('click', function () {
        toggleWeekView();  // Toggle the week view
        // Remove day-view-active class when switching back to week view
        document.querySelector('.calendar-dates').classList.remove('day-view-active');
        document.querySelector('.calendar-dates').classList.remove('hide-weekdays');
    });

    // Event listener for the day view button
    dayViewBtn.addEventListener('click', function () {
        toggleDayView();  // Toggle the day view
        // Remove week-view-active class when switching to day view
        document.querySelector('.calendar-dates').classList.add('day-view-active');
    });



    allDays.forEach(day => {
        day.addEventListener('click', function() {
            toggleDayView(parseInt(day.textContent));
        });
    });

    document.styleSheets[0].insertRule(`
        .calendar-dates > div.expanded-day {
            position: absolute;
            top: 30%;
            left: 25%;
            width: 50%;
            height: 50%;
            color: black;
            transform: translate(-25%, -15%);
            transform: scale(1.5);
            font-size: 1.5rem;
            background-color: white;
            transform: scale(1.5);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            z-index: 2;
            transition: all 0.5s ease;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 20px;
            box-sizing: border-box;
            border-radius: 10px;
        }
    `, document.styleSheets[0].cssRules.length);

    document.styleSheets[0].insertRule(`
        .dayInMonth.expanded-day {
           background: blue;
        }
    `, document.styleSheets[0].cssRules.length);



    document.styleSheets[0].insertRule(`
        .expanded-day .day-header {
        font-size: 1.5rem;
        margin-bottom: 15px;
        color: #333;
        }
        `, document.styleSheets[0].cssRules.length);



    // CSS for collapsed and blurred days
    document.styleSheets[0].insertRule(`
        .calendar-dates > div.collapsed {
            transform: scale(1);
            filter: blur(2px);
            opacity: 0.3;
            font-size: 0.8rem;
            transition: all 0.5s ease;
        }
    `, document.styleSheets[0].cssRules.length);

    document.styleSheets[0].insertRule(`
        .calendar-days.hide-weekdays {
            display: none;
        }
    `, document.styleSheets[0].cssRules.length);

    // Optional: Highlight the "today" date
    allDays.forEach(day => {
        if (parseInt(day.textContent) === currentDate.getDate()) {
            day.classList.add('today');
        }
    });

});