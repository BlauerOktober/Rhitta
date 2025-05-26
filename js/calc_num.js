const input = document.getElementById('inputNumber');
const outputDigits = document.getElementById('outputDigits');
const outputBits = document.getElementById('outputBits');
const alertBox = document.getElementById('inputNumberAlert');

input.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    return;
  }

  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];

  if (!e.key.match(/^\d$/) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
});

input.addEventListener('input', function () {
  const rawValue = this.value;
  const cleanedValue = rawValue.replace(/\D/g, '');

  if (rawValue !== cleanedValue) {
    const removedChars = rawValue
      .split('')
      .filter(ch => /\D/.test(ch))
      .join('');
    alertBox.textContent = `⚠️ Removed invalid character(s): ${removedChars}`;
  } else {
    alertBox.textContent = '';
  }

  this.value = cleanedValue;

  if (cleanedValue !== '') {
    const digits = cleanedValue.length;
    const normalized = cleanedValue.replace(/^0+/, '') || '0';
    const bits = BigInt(normalized).toString(2).length;

    outputDigits.value = digits;
    outputBits.value = bits;
  } else {
    outputDigits.value = '';
    outputBits.value = '';
  }
});

['copy', 'cut', 'drop', 'contextmenu'].forEach(event =>
  input.addEventListener(event, e => e.preventDefault())
);

input.addEventListener('dragover', e => e.preventDefault());

/* const input = document.getElementById('inputNumber');

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
}); */