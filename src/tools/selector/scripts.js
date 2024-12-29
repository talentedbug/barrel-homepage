document.addEventListener('DOMContentLoaded', () => {
    const startupNotice = document.getElementById('startup-notice');
    const choices = document.getElementById('choices');
    const numberRangeInputs = document.getElementById('number-range-inputs');
    const uploadInput = document.getElementById('upload-input');
    const presetsInput = document.getElementById('presets-input');
    const resultContainer = document.getElementById('result-container');
    const startButton = document.getElementById('start-button');
    const fireworks = document.getElementById('fireworks');
    const numberRangeButton = document.getElementById('number-range-button');
    const beginInput = document.getElementById('begin-input');
    const endInput = document.getElementById('end-input');
    const resultSection = document.getElementById('result-section');
    const result = document.getElementById('result');
    const retryButton = document.getElementById('retry-button');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');

    let rollingContent = [];

    // Remove startup notice and show choices
    setTimeout(() => {
        startupNotice.classList.add('hidden');
        choices.classList.remove('hidden');
    }, 1000);

    // Event listeners for choices
    document.getElementById('choose-number-range').addEventListener('click', () => {
        showSection(numberRangeInputs);
    });

    document.getElementById('choose-upload').addEventListener('click', () => {
        showSection(uploadInput);
    });

    document.getElementById('choose-presets').addEventListener('click', () => {
        showSection(presetsInput);
    });

    // Event listener for confirm button
    numberRangeButton.addEventListener('click', () => {
        rollingContent = getRange();
        showSection(resultContainer);
    });

    // Event listener for start button
    startButton.addEventListener('click', () => {
        showSection(resultSection);
        startRolling();
    });

    // Event listener for upload button
    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                rollingContent = e.target.result.split('\n');
                showSection(resultSection);
                startRolling();
            };
            reader.readAsText(file);
        } else {
            alert('Please select a file first.');
        }
    });

    // Event listener for preset links
    document.querySelectorAll('.preset').forEach(preset => {
        preset.addEventListener('click', (event) => {
            event.preventDefault();
            const fileName = preset.getAttribute('data-file');
            fetch(fileName)
                .then(response => response.text())
                .then(text => {
                    rollingContent = text.split('\n');
                    showSection(resultSection);
                    startRolling();
                })
                .catch(error => console.error('Error loading preset:', error));
        });
    });

    // Event listener for retry button
    retryButton.addEventListener('click', () => {
        showSection(resultContainer);
        retryButton.classList.add('hidden');
    });

    // Rolling effect
    function startRolling() {
        let rolling = true;
        retryButton.classList.add('hidden'); // Hide retry button initially
        const interval = setInterval(() => {
            result.textContent = rollingContent[Math.floor(Math.random() * rollingContent.length)];
            if (!rolling) {
                clearInterval(interval);
                showFireworks(result.textContent);
            }
        }, 100);

        setTimeout(() => {
            rolling = false;
        }, 2000);
    }

    function getRange() {
        const begin = parseInt(beginInput.textContent.trim());
        const end = parseInt(endInput.textContent.trim());
        let range = [];
        for (let i = begin; i <= end; i++) {
            range.push(i);
        }
        return range;
    }

    function showFireworks(resultValue) {
        result.textContent = resultValue;
        result.classList.add('hidden'); // Hide the result
        fireworks.classList.remove('hidden');

        setTimeout(() => {
            fireworks.classList.add('hidden');
            result.classList.remove('hidden'); // Show the result again
            retryButton.classList.remove('hidden'); // Show retry button after fireworks
        }, 500);
    }

    function showResult(resultValue) {
        result.textContent = resultValue;
        result.classList.remove('hidden');
    }

    function showSection(section) {
        [choices, numberRangeInputs, uploadInput, presetsInput, resultContainer, resultSection].forEach(s => s.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    // Theme switching
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    });
});
