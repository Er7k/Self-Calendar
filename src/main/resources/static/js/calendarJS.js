document.addEventListener('DOMContentLoaded', function() {
  const calendarDates = document.getElementById('calendar-dates');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');

  let currentDate = new Date();

  function renderCalendar(date) {
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

    // Add empty divs for days before the first day
    for (let i = startOffset; i > 0; i--) {
      const day = prevMonthLastDate - i + 1;
      calendarDates.innerHTML  += `<div class="grey">${day}</div>`;
    }

    // Fill in the actual days
    for (let day = 1; day <= lastDate; day++) {
      calendarDates.innerHTML += `<div class="dayInMonth">${day}</div>`;
    }

    // 3. Add next month's dates to fill the rest of the grid
    const totalCells = startOffset + lastDate;
    const nextDays = 42 - totalCells; // Fill up to 6 weeks, 42 = 6 rows, 35 = 5

    for (let i = 1; i <= nextDays; i++) {
      calendarDates.innerHTML += `<div class="grey">${i}</div>`;
    }
  }

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

// Initial render
  renderCalendar(currentDate);
});
