document.addEventListener('DOMContentLoaded', function() {
  const calendarDates = document.getElementById('calendar-dates');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const weekViewBtn = document.getElementById('week-view');
  const monthViewBtn = document.getElementById('month-view');
  const weekRangeDisplay = document.getElementById('week-range');
  const dayViewBtn = document.getElementById('day-view-button');
  const dayView = document.getElementById('day-view');


  let currentDate = new Date();
  let weekStartDate = new Date();



  /*========THE MONTH VIEW========*/
  window.renderMonthView = function(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // First/Last day of the current month
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    calendarDates.innerHTML = "";

    let dayCounter = 1;
    for (let i = 0; i < 42; i++) {
      let dayNumber, className, cellDate;
      if (i < startOffset) {
        dayNumber = prevMonthLastDate - startOffset + i + 1;
        cellDate = new Date(year, month - 1, dayNumber);
        className = "grey";
      } else if (i >= (startOffset + lastDate)) {
        dayNumber = i - startOffset - lastDate + 1;
        cellDate = new Date(year, month + 1, dayNumber);
        className = "grey";
      } else {
        dayNumber = dayCounter++;
        cellDate = new Date(year, month, dayNumber);
        className = "dayInMonth";
      }

      const isToday = new Date().toDateString() === cellDate.toDateString();
      const extraClass = isToday ? "today" : "";
      const week = Math.floor(i / 7);
      const dateStr = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;

      const cellHTML = `
            <div class="${className} ${extraClass}"
             data-week="${week}"
             data-date="${dateStr}"
             style="transition: all 0.5s ease;"> 
             <div class="day-number">${dayNumber}</div>
            <div class="event-markers"></div>
           </div>
        `;

      calendarDates.innerHTML += cellHTML;

      const cellEl = calendarDates.lastElementChild;
      const storedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      const eventsForThisDate = storedEvents.filter(ev => ev.date === dateStr);

      eventsForThisDate.forEach(ev => {
        displayEventOnCalendar(cellEl, ev);
      });
    }
    renderUpcomingEvents();
  }



  window.renderUpcomingEvents = function () {
    const upcomingContainer = document.getElementById('upcoming-events');
    if (!upcomingContainer) return;

    upcomingContainer.innerHTML = '';
    const allEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const upcoming = allEvents
        .filter(e => new Date(e.date) >= new Date(todayStr))
        .sort((a, b) => {
          return new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`);
        });

    const grouped = {};
    upcoming.forEach(ev => {
      if (!grouped[ev.date]) grouped[ev.date] = [];
      grouped[ev.date].push(ev);
    });

    const max = 4;
    let count = 0;

    for (const date in grouped) {
      if (count >= max) break;

      const isToday = date === todayStr;
      const dateFormatted = isToday
          ? `Today, ${formatShortDate(date)}`
          : `${formatWeekday(date)}, ${formatShortDate(date)}`;

      const dateHeader = document.createElement('p');
      dateHeader.innerHTML = `<strong>${dateFormatted}</strong>`;
      upcomingContainer.appendChild(dateHeader);

      for (const event of grouped[date]) {
        if (count >= max) break;

        const p = document.createElement('p');
        p.textContent = `[${event.startTime} - ${event.endTime}] ${event.title}`;
        upcomingContainer.appendChild(p);

        count++;
      }
    }

    if (count === 0) {
      upcomingContainer.innerHTML = `No upcoming events`;
    }

  };

  function formatShortDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }

  function formatWeekday(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'long' });
  }




  /*========FOR DISPLAYING THE EVENT IN THE CALENDAR========*/
  function displayEventOnCalendar(cellEl, eventDetails) {
    const markerContainer = cellEl.querySelector('.event-markers');

    if (!markerContainer) return;

    const marker = document.createElement('div');
    marker.classList.add('event-marker');
    marker.style.backgroundColor = eventDetails.color || '#000000';


    markerContainer.appendChild(marker);
  }




  function switchToWeekView() {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - dayOfWeek);
    document.querySelector('.calendar-dates').classList.remove('day-view-active');
    updateWeekView();
  }

  function updateWeekView() {
    const start = new Date(weekStartDate);
    currentDate = new Date (start);
    renderMonthView(start);

    const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const weekNumber = Math.floor((offset + weekStartDate.getDate() - 1) / 7);

    const calendarGrid = document.querySelector('.calendar-dates');
    for (let i = 0; i <= 5; i++) {
      calendarGrid.classList.remove(`week-focus-${i}`);
    }
    calendarGrid.classList.add(`week-focus-${weekNumber}`);

    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      const week = parseInt(day.dataset.week);
      const isHighlight = week === weekNumber;
      day.classList.toggle("highlight-week", isHighlight);

      if (isHighlight && day.classList.contains("grey")) {
        day.classList.remove("grey");
        day.classList.add("dayInMonth"); // optional: for consistent styling
      }
    });

    weekRangeDisplay.textContent = formatWeekRange(weekStartDate);
  }

  function switchToDayView() {
    const today = new Date();
    document.querySelector('.calendar-dates').classList.remove('week-view-active');
    document.querySelector('.calendar-dates').classList.add('day-view-active');
    updateDayView(today);
  }


  function switchToMonthView() {
    const calendarGrid = document.querySelector('.calendar-dates');
    for (let i = 0; i <= 5; i++) {
      calendarGrid.classList.remove(`week-focus-${i}`);
      calendarGrid.classList.remove('day-view-active');
    }

    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      day.classList.remove("highlight-week");
    });

    weekRangeDisplay.textContent = "";

    document.querySelector('.calendar-dates').classList.remove('day-view-active');

  }

  function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const optionsStart = { month: 'short', day: 'numeric'};
    const optionsEnd = { month: 'short', day: 'numeric'};

    const startStr = startDate.toLocaleDateString(undefined, optionsStart);
    const endStr = endDate.toLocaleDateString(undefined, optionsEnd);

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startStr} - ${endDate.getDate()}`;
    } else {
      return `${startStr} - ${endStr}`;
    }
  }


  monthViewBtn.addEventListener('click', () => {
    document.querySelector('.wrapper').classList.remove('day-view-active');
    document.querySelector('.sidebar-front').classList.remove('day-view-mode');
    document.querySelector('.sidebar').classList.remove('day-view-expanded');
    document.getElementById('to-do-list').innerHTML = `<p>[to-do-list and other]</p>`
    const calendarDates = document.querySelector('.calendar-dates');
    calendarDates.classList.remove('day-view-active');
    document.querySelector('.calendar-days').classList.remove('day-view-hidden');


    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      day.classList.remove('selected-day');
      day.classList.remove('highlight-week');
    });

    weekRangeDisplay.textContent = "";
    renderMonthView(currentDate);

  });


  prevBtn.addEventListener('click', () => {
    const calendarGrid = document.querySelector('.calendar-dates');
    const isWeekView = [...calendarGrid.classList].some(cls => cls.startsWith("week-focus-"));

    if (isWeekView) {
      weekStartDate.setDate(weekStartDate.getDate() - 7);
      updateWeekView();
    } else {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderMonthView(currentDate);
    }
  });

  nextBtn.addEventListener('click', () => {
    const calendarGrid = document.querySelector('.calendar-dates');
    const isWeekView = [...calendarGrid.classList].some(cls => cls.startsWith("week-focus-"));

    if (isWeekView) {
      weekStartDate.setDate(weekStartDate.getDate() + 7);
      updateWeekView();
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderMonthView(currentDate);
    }
  });

  weekViewBtn.addEventListener('click', switchToWeekView);
  monthViewBtn.addEventListener('click', switchToMonthView);
  document.getElementById('day-view-button').addEventListener('click', switchToDayView);



// Initial render
  renderMonthView(currentDate);




});