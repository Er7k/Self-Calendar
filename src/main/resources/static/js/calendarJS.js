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

  function renderMonthView(date) {
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

    // Clear previous dates
    calendarDates.innerHTML = "";

    attachDayClickListeners();

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

      calendarDates.innerHTML += `<div class="${className} ${extraClass}" data-week="${week}" style="transition: all 0.5s ease;">${dayNumber}</div>`;
    }
  }

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

  function renderWeekHourView(weekStartDate) {
    const weekHoursContainer = document.querySelector('.calendar-week-hours');
    weekHoursContainer.innerHTML = "";

    const hours = [];
    for (let h = 0; h < 24; h++) {
      const hourStr = h.toString().padStart(2, '0') + ":00";
      hours.push(`<div class="hour-label">${hours.join('')}</div>`);
    }

    const timeColumn = `<div class="time-column">${hours.join('')}</div>`;

    const dayColumns = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + i);
      const columnHours = Array(24).fill(`<div class="hour-block"></div>`).join('');
      dayColumns.push(`<div class="day-column">${columnHours}</div>`);
    }

    weekHoursContainer.innerHTML = timeColumn + dayColumns.join('');
  }


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


// Initial render
  renderMonthView(currentDate);

  function attachDayClickListeners() {
    const allDays = document.querySelectorAll('#calendar-dates > div');

    allDays.forEach(day => {
      day.addEventListener('click', () => {
        // Clear previous selection
        allDays.forEach(d => d.classList.remove('selected-day'));

        day.classList.add('selected-day');
        document.querySelector('.calendar-dates').classList.add('day-view-active');

      });
    });
  }

});

