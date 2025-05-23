const input = document.getElementById('inputNumber');

input.addEventListener('keydown', function (e) {
    // Allow only digit keys (0-9) and navigation keys
    if (
        !e.key.match(/^\d$/) &&              // not a digit
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
        e.preventDefault();
    }
});

input.addEventListener('input', function () {
    // Remove any non-digit characters (backup sanitization)
    this.value = this.value.replace(/\D/g, '');

    const value = this.value;

    if (value !== '') {
        const digits = value.length;
        const normalized = value.replace(/^0+/, '') || '0';
        const bits = BigInt(normalized).toString(2).length;

        document.getElementById('outputDigits').value = digits;
        document.getElementById('outputBits').value = bits;
    } else {
        document.getElementById('outputDigits').value = '';
        document.getElementById('outputBits').value = '';
    }
});

// Disable copy, paste, cut, drop, context menu
['copy', 'paste', 'cut', 'drop', 'contextmenu'].forEach(event =>
    input.addEventListener(event, e => e.preventDefault())
);

// Disable drag-over behavior
input.addEventListener('dragover', e => e.preventDefault());

// Block keyboard shortcuts (Ctrl/Command + key)
input.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
    }
});