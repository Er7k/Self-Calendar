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



  /*==========================*/
  /*      THE MONTH VIEW      */
  /*==========================*/
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
      cellEl.addEventListener('click', () => {
        const clickedDate = new Date(dateStr);
        updateDayView(clickedDate);
      });
    }
    renderUpcomingEvents();
  }
  function switchToMonthView() {
    const calendarGrid = document.querySelector('.calendar-dates');

    for (let i = 0; i <= 5; i++) {
      calendarGrid.classList.remove(`week-focus-${i}`);
    }

    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      day.classList.remove("highlight-week", "collapsed", "blurred", "expanded-day");

      const hourBlocks = day.querySelectorAll('.hour-block');
      hourBlocks.forEach(block => block.remove());
    });

    document.getElementById('week-range').textContent = "";

    // Re-render month view cleanly
    renderMonthView(currentDate);

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
  function formatDateForHeader(date) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const weekday = weekdays[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    return `${weekday}, the ${dayOfMonth}${getDaySuffix(dayOfMonth)} of ${month}`;
  }

  /*==========================*/
  /*      THE WEEK VIEW       */
  /*==========================*/
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
        day.classList.add("dayInMonth");
      }
    });

    weekRangeDisplay.textContent = formatWeekRange(weekStartDate);

    const visibleWeekCells = document.querySelectorAll('.calendar-dates .highlight-week');
    visibleWeekCells.forEach(cell => {
      if (cell.querySelector('.hours-container')) return;

      const dateStr = cell.getAttribute("data-date");
      const date = new Date(dateStr);
      const weekday = date.toLocaleDateString('en-GB', {weekday: 'short', });
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'short' });

      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.innerHTML = `<strong>${weekday} ${day} ${month}</strong>`;
      cell.appendChild(dayHeader);

      const hoursContainer = document.createElement('div');
      hoursContainer.className = 'hours-container';

      for (let hour = 0; hour < 24; hour++) {
        const hourBlock = document.createElement('div');
        hourBlock.className = 'hour-block';
        hourBlock.textContent = `${String(hour).padStart(2, '0')}:00`;

        const todayStr = new Date().toISOString().split('T')[0];
        if (dateStr === todayStr && hour === new Date().getHours()) {
          hourBlock.classList.add('current-hour');
        }
        hoursContainer.appendChild(hourBlock);
      }
      cell.appendChild(hoursContainer);
    });
  }
  function renderHoursInHighlightedWeek() {
    const allDays = document.querySelectorAll('#calendar-dates > div');

    highlightedDays.forEach(dayEl => {
      dayEl.innerHTML = '';

      const date = new Date(dayEl.dataset.date);
      const dayHeader = document.createElement('div');
      dayHeader.classList.add('day-header');
      dayHeader.innerHTML = `<strong>${date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>`;
      dayEl.appendChild(dayHeader);

      const hourList = document.createElement('div');
      hourList.classList.add('hour-list');

      for (let hour = 0; hour < 24; hour++) {
        const hourBlock = document.createElement('div');
        hourBlock.classList.add('hour-block');
        hourBlock.textContent = `${String(hour).padStart(2, '0')}:00`;
        hourList.appendChild(hourBlock);
      }
      dayEl.appendChild(hourList);

    });
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

  /*==========================*/
  /*       THE DAY VIEW       */
  /*==========================*/

  function renderExpandedDayContent(cell, dateStr) {
    const date = new Date(dateStr);
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'short'});
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short'});

    cell.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'day-header';
    header.innerHTML = `<strong>${weekday} ${day} ${month}</strong>`;
    cell.appendChild(header);

    const hoursContainer = document.createElement('div');
    hoursContainer.className = 'hours-container';

    for (let hour = 0; hour < 24; hour++) {
      const hourBlock = document.createElement('div');
      hourBlock.className = 'hour-block';
      hourBlock.textContent = `${String(hour).padStart(2, '0')}:00`;

      if (dateStr === new Date().toISOString().split('T')[0] && hour === new Date().getHours()) {
        hourBlock.classList.add('current-hour');
      }

      hoursContainer.appendChild(hourBlock);
    }

    cell.appendChild(hoursContainer);
  }

  function formatWeekday(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'long' });
  }
  function formatShortDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }
  function updateDayView(date) {
    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      const isMatch = day.dataset.date === date.toISOString().split('T')[0];

      if (isMatch) {
        day.classList.add('expanded-day');
      } else {
        day.classList.add('collapsed');
      }
    });

    document.querySelector('.calendar-days').classList.add('hide-weekdays');
    document.querySelector('.wrapper').classList.add('day-view-active');
  }

  function switchToDayView(dateStr) {
    const calendar = document.querySelector('.calendar-dates');
    if (calendar.classList.contains('day-view-active')) return; // already in day view

    calendar.classList.add('day-view-active');

    const allCells = document.querySelectorAll('.calendar-dates > div');
    allCells.forEach(cell => {
      const isMatch = cell.getAttribute('data-date') === dateStr;

      const prevHours = cell.querySelector('.hours-container');
      if (prevHours) prevHours.remove();
      const prevHeader = cell.querySelector('.day-header');
      if (prevHeader) prevHeader.remove();

      if (isMatch) {
        cell.classList.add('expanded-day');
        cell.classList.remove('collapsed', 'blurred');
        renderExpandedDayContent(cell, dateStr);
      } else {
        cell.classList.remove('expanded-day');
        cell.classList.add('collapsed', 'blurred');
      }

    });

    document.querySelector('.calendar-days').classList.add('hide-weekdays');
    document.querySelector('.wrapper').classList.add('day-view-active');
  }

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

  function exitDayView() {
    isInDayView = false;
    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      day.classList.remove('expanded-day', 'collapsed', 'blurred');

      const hourBlock = day.querySelector('.hours-container');
      if (hourBlock) hourBlock.remove();
      const header = day.querySelector('.day-header');
      if (header) header.remove();
    });
    document.querySelector('.calendar-days').classList.remove('hide-weekdays');
    document.querySelector('.wrapper').classList.remove('day-view-active');
    document.querySelector('.calendar-dates').classList.remove('day-view-active');
  }




  /*==========================*/
  /* FOR DISPLAY IN CALENDAR  */
  /*==========================*/
  function displayEventOnCalendar(cellEl, eventDetails) {
    const markerContainer = cellEl.querySelector('.event-markers');

    if (!markerContainer) return;

    const marker = document.createElement('div');
    marker.classList.add('event-marker');
    marker.style.backgroundColor = eventDetails.color || '#000000';


    markerContainer.appendChild(marker);
  }
  function smoothTransition(callback) {
    const calendarGrid = document.querySelector('.calendar-dates');
    calendarGrid.classList.add('week-transitioning');

    setTimeout(() => {
      callback();
      calendarGrid.classList.remove('week-transitioning');
    }, 200);
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


  /*==========================*/
  /*          BUTTONS         */
  /*==========================*/
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

  weekViewBtn.addEventListener('click', () => {
    smoothTransition(() => {
      exitDayView();
      switchToWeekView();
    });
  });
  monthViewBtn.addEventListener('click', () => {
    smoothTransition(() => {
      exitDayView();
      switchToMonthView();

    });
  });
  dayViewBtn.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    switchToDayView(today); // Use today's date
  });


// Initial render
  renderMonthView(currentDate);




});