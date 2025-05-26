

document.addEventListener('DOMContentLoaded', function () {

    localStorage.removeItem('calendarPreferences');

    const prefs= localStorage.getItem('calendarPreferences');

    if(!prefs) {
        document.getElementById('welcome-screen').style.display = 'block';
        document.getElementById('main-calendar').style.display = 'none';
    } else {
        const { layout, style, background, font } = JSON.parse(prefs);

        document.getElementById('main-calendar').classList.add(`layout-${layout}`);
        document.body.classList.add(`style-${style}`);
        document.body.classList.add(`background-${background}`);
        document.body.classList.add(`font-${font}`);
    }

    //========================
    // DEFAULT SELECTION VALUES
    //========================

    let selectedLayout = 'no1';
    let selectedBackground = 'red1';
    let selectedFont = 'default';
    let selectedStyle = 'classic';


    //========================
    // HANDLE LAYOUT SELECTION
    //========================

    const layoutCards = document.querySelectorAll('.layout-card');
    layoutCards.forEach(card => {
        if (card.dataset.layout === selectedLayout) card.classList.add('selected');

        card.addEventListener('click', () => {
            layoutCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedLayout = card.dataset.layout;
        });
    });

    //=======================
    // HANDLE STYLE SELECTION
    //=======================

    const styleCards = document.querySelectorAll('.style-card');
    styleCards.forEach(card => {
        if (card.dataset.style === selectedStyle) card.classList.add('selected');

        card.addEventListener('click', () => {
            styleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedStyle = card.dataset.styling;
        });
    });

    //=======================
    // HANDLE THEME SELECTION
    //=======================

    const backgroundCards = document.querySelectorAll('.background-card');
    backgroundCards.forEach(card => {
        if (card.dataset.theme === selectedBackground) card.classList.add('selected');

        card.addEventListener('click', () => {
            backgroundCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedBackground = card.dataset.background;
        });

    });

    //======================
    // HANDLE FONT SELECTION
    //======================

    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(option => {
        if (option.dataset.font === selectedFont) option.classList.add('selected');

        option.addEventListener('click', () => {
            fontOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedFont = option.dataset.font;
        });
    });


    //=============================
    // HANDLE SAVE + APPLY SETTINGS
    //=============================

    document.getElementById('save-preferences').addEventListener('click', () => {

            const preferences = {
                layout: selectedLayout,
                style: selectedStyle,
                background: selectedBackground,
                font: selectedFont
            };

            localStorage.setItem('calendarPreferences', JSON.stringify(preferences));

            document.getElementById('main-calendar').classList.add(`layout-${selectedLayout}`);
            document.body.classList.add(`style-${selectedStyle}`);
            document.body.classList.add(`background-${selectedBackground}`);
            document.body.classList.add(`font-${selectedFont}`);

            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('main-calendar').style.display = 'block';

    });





});

