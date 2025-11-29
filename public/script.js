const categoryList = document.getElementById('category-list');
const resultsContainer = document.getElementById('results');
const finalFlagContainer = document.getElementById('final-flag');
const form = document.getElementById('match-form');

let categories = [];
let descriptions = [];

function createOption(text) {
  const option = document.createElement('option');
  option.value = text;
  option.textContent = text;
  return option;
}

function renderCategories() {
  categoryList.innerHTML = '';
  categories.forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'category';

    const heading = document.createElement('h2');
    heading.textContent = item.category;

    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = `Hint: ${item.hint}`;

    const explanation = document.createElement('p');
    explanation.className = 'explanation';
    explanation.textContent = `What to remember: ${item.explanation}`;

    const label = document.createElement('label');
    label.textContent = 'Select the matching description';
    label.setAttribute('for', `desc-${item.category}`);

    const select = document.createElement('select');
    select.name = item.category;
    select.id = `desc-${item.category}`;
    select.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Choose a description...';
    select.appendChild(defaultOption);

    descriptions.forEach((description) => {
      select.appendChild(createOption(description));
    });

    wrapper.appendChild(heading);
    wrapper.appendChild(hint);
    wrapper.appendChild(explanation);
    wrapper.appendChild(label);
    wrapper.appendChild(select);
    categoryList.appendChild(wrapper);
  });
}

async function loadGame() {
  try {
    const response = await fetch('/api/game');
    const payload = await response.json();
    categories = payload.categories;
    descriptions = payload.descriptions;
    renderCategories();
  } catch (error) {
    resultsContainer.textContent = 'Unable to load game data. Ensure the server is running.';
  }
}

function buildPairs() {
  return categories.map((item) => {
    const select = document.getElementById(`desc-${item.category}`);
    return {
      category: item.category,
      description: select.value,
    };
  });
}

function renderResults(results, finalFlag) {
  resultsContainer.innerHTML = '';
  finalFlagContainer.textContent = '';

  results.forEach((result) => {
    const block = document.createElement('div');
    block.className = result.correct ? 'result correct' : 'result incorrect';

    const title = document.createElement('h3');
    title.textContent = result.category;

    const message = document.createElement('p');
    message.textContent = result.message;

    const explanation = document.createElement('p');
    explanation.className = 'explanation';
    explanation.textContent = result.explanation;

    block.appendChild(title);
    block.appendChild(message);
    block.appendChild(explanation);

    if (result.flag) {
      const flagText = document.createElement('p');
      flagText.className = 'flag';
      flagText.textContent = `Flag: ${result.flag}`;
      block.appendChild(flagText);
    }

    resultsContainer.appendChild(block);
  });

  if (finalFlag) {
    const finalMessage = document.createElement('div');
    finalMessage.className = 'final-flag-card';
    finalMessage.innerHTML = `<h3>All matched!</h3><p class="flag">Final Flag: ${finalFlag}</p>`;
    finalFlagContainer.appendChild(finalMessage);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const pairs = buildPairs();
  const response = await fetch('/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pairs }),
  });

  if (!response.ok) {
    resultsContainer.textContent = 'Validation failed. Ensure you filled every selection.';
    return;
  }

  const payload = await response.json();
  renderResults(payload.results, payload.finalFlag);
});

loadGame();
