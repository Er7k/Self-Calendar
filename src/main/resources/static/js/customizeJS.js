

document.addEventListener('DOMContentLoaded', function () {

    localStorage.removeItem('calendarPreferences');

    const prefs= localStorage.getItem('calendarPreferences');

    if(!prefs) {
        document.getElementById('welcome-screen').style.display = 'block';
        document.getElementById('main-calendar').style.display = 'none';
    } else {
        const { layout, style, theme, font } = JSON.parse(prefs);

        document.getElementById('main-calendar').classList.add(`layout-${layout}`);
        document.body.classList.add(`style-${style}`);
        document.body.classList.add(`theme-${theme}`);
        document.body.classList.add(`font-${font}`);
    }

    //========================
    // DEFAULT SELECTION VALUES
    //========================

    let selectedLayout = 'no1';
    let selectedTheme = 'light';
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

    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        if (card.dataset.theme === selectedTheme) card.classList.add('selected');

        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedTheme = card.dataset.theme;
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
                theme: selectedTheme,
                font: selectedFont
            };

            localStorage.setItem('calendarPreferences', JSON.stringify(preferences));

            document.getElementById('main-calendar').classList.add(`layout-${selectedLayout}`);
            document.body.classList.add(`style-${selectedStyle}`);
            document.body.classList.add(`theme-${selectedTheme}`);
            document.body.classList.add(`font-${selectedFont}`);

            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('main-calendar').style.display = 'block';

    });





});

