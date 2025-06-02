document.addEventListener('DOMContentLoaded', function() {
  const calendarDates = document.getElementById('calendar-dates');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const weekViewBtn = document.getElementById('week-view');
  const monthViewBtn = document.getElementById('month-view');
  const weekRangeDisplay = document.getElementById('week-range');


  let currentDate = new Date();
  let weekStartDate = new Date();
  let isWeekView = false;


<<<<<<< Updated upstream
  /*========THE MONTH VIEW========*/
  window.renderMonthView = function(date) {
    console.log('renderMonthView called with date:', date, 'Events: ', window.events)
=======
  /*==========================*/
  /*      THE MONTH VIEW      */
  /*==========================*/
  window.renderMonthView = function (date) {
>>>>>>> Stashed changes
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
  };

  /*========FOR DISPLAYING THE EVENT IN THE CALENDAR========*/
  function displayEventOnCalendar(cellEl, eventDetails) {
    const markerContainer = cellEl.querySelector('.event-markers');

    if (!markerContainer) return;

    // Create the event marker
    const marker = document.createElement('div');
    marker.classList.add('event-marker');
    marker.style.backgroundColor = eventDetails.color || '#000000';

    // Add the event tooltip (this part was already done in your code)
    const tooltip = document.createElement('div');
    tooltip.classList.add('event-tooltip');
    tooltip.innerHTML = `
        <strong>Title:</strong> ${eventDetails.title}<br>
        <strong>Time:</strong> ${eventDetails.startTime} - ${eventDetails.endTime}<br>
        <strong>Category:</strong> ${eventDetails.category}<br>
        <strong>Description:</strong> ${eventDetails.description || 'No description'}
    `;

    tooltip.style.backgroundColor = eventDetails.color || '#000000';
    marker.appendChild(tooltip);


    // Add the marker to the marker container
    markerContainer.appendChild(marker);

    // Handle tooltip visibility (hover behavior)
    marker.addEventListener('mouseenter', function() {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = 1;

      const rect = marker.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
      tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
    });

    marker.addEventListener('mouseleave', function() {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = 0;
    });
  }

<<<<<<< Updated upstream



  function switchToWeekView() {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - dayOfWeek);
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


=======
>>>>>>> Stashed changes
  function switchToMonthView() {
    const calendarGrid = document.querySelector('.calendar-dates');
    for (let i = 0; i <= 5; i++) {
      calendarGrid.classList.remove(`week-focus-${i}`);
    }

    const allDays = document.querySelectorAll('#calendar-dates > div');
    allDays.forEach(day => {
      day.classList.remove("highlight-week");
    });

    weekRangeDisplay.textContent = "";
<<<<<<< Updated upstream
=======
    renderMonthView(currentDate);

    // Re-render month view cleanly
>>>>>>> Stashed changes
    renderMonthView(currentDate);
  }

<<<<<<< Updated upstream
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


=======
>>>>>>> Stashed changes
  monthViewBtn.addEventListener('click', () => {
    document.querySelector('.wrapper').classList.remove('day-view-active');
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
<<<<<<< Updated upstream
=======

  function formatDateForHeader(date) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
>>>>>>> Stashed changes


<<<<<<< Updated upstream
  prevBtn.addEventListener('click', () => {
    const calendarGrid = document.querySelector('.calendar-dates');
    const isWeekView = [...calendarGrid.classList].some(cls => cls.startsWith("week-focus-"));
=======
    return `${weekday}, the ${dayOfMonth}${getDaySuffix(dayOfMonth)} of ${month}`;
  }

  /*==========================*/
  /*      THE WEEK VIEW       */
  /*==========================*/

  function switchToWeekView() {


    const startOfWeek = getStartOfWeek(weekStartDate);
    const endOfWeek = getEndOfWeek(startOfWeek);

    renderWeekView(startOfWeek, endOfWeek);
  }

  function getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(date.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  function getEndOfWeek(startOfWeek) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  function renderWeekView(weekStartDate) {
    const calendarDates = document.getElementById('calendar-dates');
    calendarDates.innerHTML = ""; // ✅ Clear before rendering

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + i);

      const isoDate = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
      const monthName = date.toLocaleDateString('en-GB', { month: 'short' });

      const hoursHTML = Array.from({ length: 24 }, (_, h) => {
        const hourStr = `${h.toString().padStart(2, '0')}:00`;
        return `<div class="hour-block">${hourStr}</div>`;
      }).join('');

      calendarDates.innerHTML += `
      <div class="dayInMonth" data-date="${isoDate}">
        <div class="day-header">${dayName} ${date.getDate()} ${monthName}</div>
        <div class="hours-container">
          ${hoursHTML}
        </div>
      </div>
    `;
    }
  }


  function renderDayHeaderAndHours(dayEl, date) {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'short'});
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    dayHeader.innerHTML = `${weekday} ${day} ${month}`;
    dayEl.appendChild(dayHeader);

    const hoursContainer = document.createElement('div');
    hoursContainer.className = 'hours-container';

    for (let hour = 0; hour < 24; hour++) {
      const hourBlock = document.createElement('div');
      hourBlock.className = 'hour-block';
      hourBlock.textContent = `${String(hour).padStart(2, '0')}:00`;

      const todayStr = new Date().toISOString().split('T')[0];
      if (date.toISOString().split('T')[0] === todayStr && hour === new Date().getHours()) {
        hourBlock.classList.add('current-hour');
      }
      hoursContainer.appendChild(hourBlock);
    }
    dayEl.appendChild(hoursContainer);
  }

  switchToWeekView();




    /*==========================*/
    /*       THE DAY VIEW       */

    /*==========================*/

    function renderExpandedDayContent(cell, dateStr) {
      const date = new Date(dateStr);
      const weekday = date.toLocaleDateString('en-GB', {weekday: 'short'});
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', {month: 'short'});

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
      return d.toLocaleDateString('en-GB', {weekday: 'long'});
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
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
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
    function displayEventOnCalendar(cellEl, event) {

      const markerContainer = cellEl.querySelector('.event-markers');
      if (!markerContainer) return;

      const marker = document.createElement('div');
      marker.classList.add('event-marker');
      marker.style.backgroundColor = event.color || '#000000';


      markerContainer.appendChild(marker);
    }

    function smoothTransition(callback) {
      const calendarGrid = document.querySelector('.calendar-dates');
      calendarGrid.style.transition = 'opacity 0.3s ease';
      calendarGrid.style.opacity = '0';

      setTimeout(() => {
        callback();
        calendarGrid.style.opacity = '1';
      }, 300);
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
      if (isWeekView) {
        weekStartDate.setDate(weekStartDate.getDate() - 7);
>>>>>>> Stashed changes

        switchToWeekView();
      } else {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderMonthView(currentDate);
      }
    });

    nextBtn.addEventListener('click', () => {

      if (isWeekView) {

<<<<<<< Updated upstream
  weekViewBtn.addEventListener('click', switchToWeekView);
  monthViewBtn.addEventListener('click', switchToMonthView);

=======
        weekStartDate.setDate(weekStartDate.getDate() + 7);
        switchToWeekView();
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderMonthView(currentDate);
      }
    });

    weekViewBtn.addEventListener('click', () => {
      isWeekView = true;
      switchToWeekView();
    });
    monthViewBtn.addEventListener('click', () => {
      isWeekView = false;
      switchToMonthView();
    });
    dayViewBtn.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      switchToDayView(today); // Use today's date
    });
>>>>>>> Stashed changes


// Initial render
    renderMonthView(currentDate);


  });
