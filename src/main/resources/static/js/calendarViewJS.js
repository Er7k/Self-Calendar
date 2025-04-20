

document.addEventListener('DOMContentLoaded', function() {
    const calendarDates = document.getElementById('calendar-dates');
    const calendarHeader = document.querySelector('.calendar-header');
    const calendarDays = document.querySelector('.calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const dayViewBtn = document.getElementById('dayView');
    const dayViewSection = document.getElementById('day-view');
    const dayTitle = document.getElementById('day-title');
    const activityList = document.getElementById('activity-list');
    const newActivityInput = document.getElementById('new-activity');
    const addActivityBtn = document.getElementById('add-activity');
    const weekViewBtn = document.getElementById('weekView');
    const monthViewBtn = document.getElementById('monthView');
    const yearViewBtn = document.getElementById('yearView');

    let currentDate = new Date();
    let currentView = 'month';
    let activities = {};

    function renderCalender(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthNames = ["January", "February",
            "March", "April", "May", "June", "July", "August",
            "September", "October", "November", "December"];
        monthYear.textContent = `${monthNames[month]} ${year}`;

        calendarDates.innerHTML = "";

        if (currentView === 'day') {
            const today = new Date();
            const dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            dayTitle.textContent = `${dayOfWeekNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]}, ${today.getFullYear()}`;


            dayViewSection.style.display = 'block';

            const todayActivities = activities[today.toDateString()] || [];
            activityList.innerHTML = "";
            todayActivities.forEach((activity, index) => {
                const li = document.createElement('li');
                li.textContent = activity;
                activityList.appendChild(li);
            });



        } else if (currentView === 'month') {
            const firstDay = new Date (year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();

            const startOffset = firstDay === 0 ? 6 : firstDay - 1;

            const prevMonthLastDate = new Date(year, month, 0).getDate();

            for (let i = startOffset; i > 0; i--) {
                const day = prevMonthLastDate - i + 1;
                const div = document.createElement('div');
                div.classList.add('grey');
                div.textContent = day;
                calendarDates.appendChild(div);
            }

            for (let day = 1; day<= lastDate; day++) {
                const div = document.createElement('div');
                div.classList.add('dayInMonth');
                div.setAttribute('data-day', day);
                div.textContent = day;
                calendarDates.appendChild(div);
            }

            const totalCells = startOffset + lastDate;
            const nextDays = 42 - totalCells;

            for (let i = 1; i <= nextDays; i++) {
                const div = document.createElement('div');
                div.classList.add('grey');
                div.textContent = i;
                calendarDates.appendChild(div);
            }
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        renderCalendar(currentDate);
    });

    nextBtn.addEventListener('click', () => {
        if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        renderCalender(currentDate);
    });

    dayViewBtn.addEventListener('click', () => {
        currentView = 'day';
        renderCalender(currentDate);
    });

    monthViewBtn.addEventListener('click', () => {
        currentView = 'month';
        dayViewSection.style.display = 'none';
        calendarDates.style.display = 'grid';

        renderCalender(currentDate);
    });

    addActivityBtn.addEventListener('click', () => {
        const newActivity = newActivityInput.value.trim();
        if (newActivity) {
            const todayString = currentDate.toDateString();
            if (!activities[todayString]) {
                activities[todayString] = [];
            }
            activities[todayString].push(newActivity);
            renderCalender(currentDate);
            newActivityInput.value = "";

        }
    });

    renderCalender(currentDate);
});