document.getElementById('submitButton').addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;
    const errorMessage = document.getElementById('errorMessage');
    const responseContainer = document.getElementById('responseContainer');
    const responseOutput = document.getElementById('responseOutput');

    errorMessage.textContent = '';

    try {
        const parsedInput = JSON.parse(jsonInput);

        if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
            throw new Error('Invalid JSON structure');
        }

        fetch('https://bfhlbackend.onrender.com/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parsedInput)
        })
        .then(response => response.json())
        .then(data => {
            responseContainer.style.display = 'block';

            const availableOptions = document.getElementById('availableOptions');
            const selectedOptions = document.getElementById('selectedOptions');
            availableOptions.innerHTML = `
                <div class="option-box" data-value="alphabets">Alphabets</div>
                <div class="option-box" data-value="numbers">Numbers</div>
                <div class="option-box" data-value="highest_alphabet">Highest Alphabet</div>
            `;

            const moveOption = (sourceContainer, targetContainer, value) => {
                const item = sourceContainer.querySelector(`div[data-value="${value}"]`);
                if (item) {
                    targetContainer.appendChild(item);
                }
            };

            availableOptions.addEventListener('click', function(event) {
                if (event.target.classList.contains('option-box')) {
                    moveOption(availableOptions, selectedOptions, event.target.getAttribute('data-value'));
                }
            });

            selectedOptions.addEventListener('click', function(event) {
                if (event.target.classList.contains('option-box')) {
                    moveOption(selectedOptions, availableOptions, event.target.getAttribute('data-value'));
                }
            });

            document.getElementById('showResponseButton').addEventListener('click', function() {
                const selectedValues = Array.from(selectedOptions.children).map(option => option.getAttribute('data-value'));
                let output = '';

                if (selectedValues.includes('alphabets')) {
                    output += `Alphabets: ${data.alphabets.join(', ')}<br>`;
                }
                if (selectedValues.includes('numbers')) {
                    output += `Numbers: ${data.numbers.join(', ')}<br>`;
                }
                if (selectedValues.includes('highest_alphabet')) {
                    output += `Highest Alphabet: ${data.highest_alphabet.join(', ')}<br>`;
                }

                responseOutput.innerHTML = output;
            });
        })
        .catch(error => {
            errorMessage.textContent = 'Error processing request: ' + error.message;
        });
    } catch (e) {
        errorMessage.textContent = 'Invalid JSON input';
    }
});
