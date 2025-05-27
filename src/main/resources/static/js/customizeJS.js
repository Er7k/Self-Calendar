

document.addEventListener('DOMContentLoaded', function () {

   localStorage.removeItem('calendarPreferences');

    const prefs= localStorage.getItem('calendarPreferences');

    if(!prefs) {
        document.getElementById('welcome-screen').style.display = 'block';
        document.getElementById('main-calendar').style.display = 'none';
    } else {
        const { layout, style, backgroundColor, accentColor, font, textColor, borderColor } = JSON.parse(prefs);

        document.getElementById('main-calendar').classList.add(`layout-${layout}`);
        document.body.classList.add(`style-${style}`);
        document.body.classList.add(`font-${font}`);

        if (backgroundColor) {
            document.body.style.setProperty('--bg-color', backgroundColor);
        }
        if (accentColor) {
            document.body.style.setProperty('--accent-color', accentColor);
        }
        if (textColor) {
            document.body.style.setProperty('--text-color', textColor);
            selectedTextColor = textColor;
        }
        if (borderColor) {
            document.body.style.setProperty('--border-color', borderColor);
        }

    }

    //========================
    // DEFAULT SELECTION VALUES
    //========================

    let selectedLayout = 'no1';
    let selectedFont = 'default';
    let selectedStyle = 'classic';
    let selectedBackgroundColor = '#87CEFA';
    let selectedAccentColor = '#ffffff';
    let selectedTextColor = '#000000';
    let selectedBorderColor = '#000000';


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

    //==================================
    // HANDLE BACKGROUND COLOR SELECTION
    //==================================

    const backgroundCards = document.querySelectorAll('.bg-card');
    backgroundCards.forEach(card => {
        const bgColor = card.querySelector('.bg-preview')?.style.backgroundColor;
        if (bgColor === selectedBackgroundColor) card.classList.add('selected');

        card.addEventListener('click', () => {
            backgroundCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedBackgroundColor = bgColor;
            document.body.style.setProperty('--bg-color', selectedBackgroundColor);
        });

    });

    //==============================
    // HANDLE ACCENT COLOR SELECTION
    //==============================
    const accentCards = document.querySelectorAll('.accent-color');
    accentCards.forEach(card => {
        const accent = card.querySelector('.accent-color-preview')?.style.backgroundColor;
        if (accent === selectedAccentColor) card.classList.add('selected');

        card.addEventListener('click', () => {
            accentCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedAccentColor = accent;
            document.body.style.setProperty('--accent-color', selectedAccentColor);
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
    // HANDLE TEXT COLOR SELECTION
    //=============================
    const textColorCards = document.querySelectorAll('.text-color');
    textColorCards.forEach(card => {
        const textColor = card.dataset.textcolor;

        if (textColor === selectedTextColor) card.classList.add('selected');

        card.addEventListener('click', () => {
            textColorCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedTextColor = textColor;
            document.body.style.setProperty('--text-color', selectedTextColor);
        });
    });

    //==============================
    // HANDLE BORDER COLOR SELECTION
    //==============================
    const borderColorCards = document.querySelectorAll('.border-color');
    borderColorCards.forEach(card => {
        const borderColor = card.dataset.border;
        if (borderColor === selectedBorderColor) card.classList.add('selected');

        card.addEventListener('click', () => {
            borderColorCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedBorderColor = borderColor;
            document.body.style.setProperty('--border-color', selectedBorderColor);
        });
    });



    //=============================
    // HANDLE SAVE + APPLY SETTINGS
    //=============================

    document.getElementById('save-preferences').addEventListener('click', () => {

            const preferences = {
                layout: selectedLayout,
                style: selectedStyle,
                font: selectedFont,
                backgroundColor: selectedBackgroundColor,
                accentColor: selectedAccentColor,
                textColor: selectedTextColor,
                borderColor: selectedBorderColor
            };

            localStorage.setItem('calendarPreferences', JSON.stringify(preferences));

            document.getElementById('main-calendar').classList.add(`layout-${selectedLayout}`);
            document.body.classList.add(`style-${selectedStyle}`);
            document.body.classList.add(`font-${selectedFont}`);
            document.body.style.setProperty('--bg-color', selectedBackgroundColor);
            document.body.style.setProperty('--accent-color', selectedAccentColor);
            document.body.style.setProperty('--text-color', selectedTextColor);
            document.body.style.setProperty('--border-color', selectedBorderColor);

            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('main-calendar').style.display = 'block';

    });

});

