document.getElementById('inputNumber').addEventListener('input', function () {
    const value = this.value.trim();

    // Validate: value should be all digits and not empty
    if (/^\d+$/.test(value)) {
        const digits = value.length;

        // Compute bits using BigInt
        const bits = BigInt(value).toString(2).length;

        document.getElementById('outputDigits').value = digits;
        document.getElementById('outputBits').value = bits;
    } else {
        document.getElementById('outputDigits').value = '';
        document.getElementById('outputBits').value = '';
    }
});