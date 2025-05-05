document.addEventListener('DOMContentLoaded', function () {
    const weekViewBtn = document.getElementById('week-view');
    const calendarRows = document.querySelectorAll('.calendar-row'); // Select all week rows
    const currentDate = new Date();

    // Function to calculate the current week number (1-based)
    function getWeekNumber(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const days = Math.floor(diff / oneDay);
        return Math.ceil(days / 7);
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

    // Event listener for the week view button
    weekViewBtn.addEventListener('click', toggleWeekView);
});