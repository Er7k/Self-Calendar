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
  const categoryList = document.getElementById('category-list');
  const categoryNameInput = document.getElementById('input-category-name');
  const categoryColorInput = document.getElementById('input-category-color');
  const saveCategoryBtn = document.getElementById('save-category');
  const toggleCategoryFormBtn = document.getElementById('toggle-category-form');

  const defaultCategories = [
    { name: 'Work', color: '#f1c40f' },
    { name: 'School', color: '#3498db' },
    { name: 'Personal', color: '#2ecc71' },
    { name: 'Important', color: '#e74c3c' }
  ];

  if (!localStorage.getItem('eventCategories')) {
    localStorage.setItem('eventCategories', JSON.stringify(defaultCategories));
  }


  let currentDate = new Date();
  let weekStartDate = new Date();



  /*==========================================================================*/
  /*      THE MONTH VIEW                                                      */
  /*==========================================================================*/
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
        const marker = document.createElement('div');
        marker.className = 'event-marker';
        marker.style.backgroundColor = ev.color || '#787676';
        cellEl.querySelector('.event-markers').appendChild(marker);
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

  /*==========================================================================*/
  /*      THE WEEK VIEW                                                       */
  /*==========================================================================*/
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

  /*==========================================================================*/
  /*       THE DAY VIEW                                                       */
  /*==========================================================================*/
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

    const max = 6;
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

     const eventForm = document.getElementById('event-form');
     const textarea = document.getElementById('event-description');
     const counter = document.getElementById('char-count');
     const maxLength = textarea.getAttribute('maxlength');
     const startTimeInput = document.getElementById('event-start');
     const endTimeInput = document.getElementById('event-end');
     const dateInput = document.getElementById('event-date');


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





    /*========SAVE NEW EVENT TO CALENDAR AND RE-RENDER CALENDAR========*/

  if (!localStorage.getItem('eventCategories')) {
    localStorage.setItem('eventCategories', JSON.stringify(defaultCategories));
  }

// === LOAD AND RENDER CATEGORIES ===
  function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('eventCategories') || '[]');
    categoryList.innerHTML = '';

    categories.forEach((cat, index) => {
      const li = document.createElement('li');
      li.className = 'category-tag';
      li.textContent = cat.name;
      li.style.backgroundColor = cat.color;
      li.dataset.index = index;

      li.addEventListener('click', () => {
        document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
        li.classList.add('active');
      });

      categoryList.appendChild(li);
    });
  }

  loadCategories();

// === TOGGLE CATEGORY FORM ===
  toggleCategoryFormBtn.addEventListener('click', () => {
    const form = document.getElementById('category-form');
    form.style.display = form.style.display === 'none' ? 'flex' : 'none';
  });

// === SAVE OR EDIT CATEGORY ===
  saveCategoryBtn.addEventListener('click', () => {
    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;
    if (!name) return;

    const categories = JSON.parse(localStorage.getItem('eventCategories') || '[]');
    const activeIndex = document.querySelector('.category-tag.active')?.dataset.index;

    if (activeIndex !== undefined) {
      categories[activeIndex] = { name, color };
    } else {
      categories.push({ name, color });
    }

    localStorage.setItem('eventCategories', JSON.stringify(categories));
    categoryNameInput.value = '';
    categoryColorInput.value = '#000000';
    loadCategories();
  });

  eventForm.addEventListener('submit', e => {
      e.preventDefault();
      console.log("Form submitted");

      const titleInput = document.getElementById('event-title');
      const title = titleInput ? titleInput.value.trim() : '';

      const dateInput = document.getElementById('event-date');
      const date = dateInput?.value || '';

      const activeCategory = document.querySelector('.category-tag.active');
      const categories = JSON.parse(localStorage.getItem('eventCategories') || '[]');
      const categoryIndex = activeCategory ? activeCategory.dataset.index : 0;
      const category = categories[categoryIndex] || categories[0];
      const categoryName = activeCategory ? activeCategory.textContent : 'Uncategorized';
      const categoryColor = activeCategory ? activeCategory.style.backgroundColor : '#787676';

      const startInput = document.getElementById('event-start');
      const endInput = document.getElementById('event-end');
      const startTime = startInput?.value || '';
      const endTime = endInput?.value || '';

      const descEl = document.getElementById('event-description');
      const description = descEl ? descEl.value : '';

      const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

      events.push({
        title,
        date,
        startTime,
        endTime,
        description,
        category: category.name,
        color: category.color
      });

      localStorage.setItem('calendarEvents', JSON.stringify(events));
      eventForm.reset();

      const [year, month, day] = date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      renderMonthView(selectedDate); // ✅ pass valid Date


    });




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