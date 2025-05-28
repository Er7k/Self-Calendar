

document.addEventListener('DOMContentLoaded', function () {
    // Handle panel open/close
    document.querySelectorAll('.panel-header').forEach(header => {
        header.addEventListener('click', () => {
            const panel = header.parentElement;
            const allPanels = document.querySelectorAll('.sidebar-panel');

            if (panel.classList.contains('active')) {
                panel.classList.remove('active');
            } else {
                allPanels.forEach(p => p.classList.remove('active'));
                panel.classList.add('active');
            }
        });
    });
});