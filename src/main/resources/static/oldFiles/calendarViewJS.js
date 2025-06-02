

/*document.addEventListener('DOMContentLoaded', function() {
    const calendarDates = document.getElementById('calendar-dates');
    const monthYear = document.getElementById('month-year');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const weekViewBtn = document.getElementById('week-view');
    const monthViewBtn = document.getElementById('month-view');

    let currentDate = new Date();
    let currentView = 'month';


    function renderMonthView(date) {
        const year = date.getFullYear();
        const month = date.getMonth;

        const monthNames = ["January", "February",
            "March", "April", "May", "June", "July", "August",
            "September", "October", "November", "December"];
        monthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        calendarDates.innerHTML = "";

        for (let i = startOffset; i > 0; i--) {
            const day = prevMonthLastDate - i + 1;
            calendarDates.innerHTML += `<div class="grey">${day}</div>`;
        }

        for (let day = 1; day <= lastDate; day++) {
            calendarDates.innerHTML += `<div class="dayInMonth">${day}</div>`;
        }

        const totalCells = startOffset + lastDate;
        const nextDays = 42 - totalCells;

        for (let i = 1; i <= nextDays; i++) {
            calendarDates.innerHTML += `<div class="grey">${i}</div>`;
        }
    }

    function renderWeekView() {
        const today = new Date();
        const currentDay = today.getDay();
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(monday);
            currentDay.setDate(monday.getDate() + i);
            weekDates.push(currentDay);
        }

        calendarDates.innerHTML = '';

        weekDates.forEach(date => {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day-cell');
            dayCell.innerText = `${date.getDate()}`;
            calendarDates.appendChild(dayCell);
        });
    }

    function toggleCalendarFlip() {
        const calendarContainer = document.querySelector('.calendar-container');

    }


    function renderCalender(date) {
        const year = date.getFullYear();
        const month = date.getMonth();



        calendarDates.innerHTML = "";

        if (currentView === 'day') {
            const today = new Date();
            const dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            dayTitle.textContent = `${dayOfWeekNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]}, ${today.getFullYear()}`;


            dayViewSection.style.display = 'block';




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



    renderCalender(currentDate);
}); */