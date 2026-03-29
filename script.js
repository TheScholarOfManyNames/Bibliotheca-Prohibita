let allBooks = [];

// Fetch data from JSON file
async function loadLibrary() {
  try {
    const response = await fetch('data/books.json');
    allBooks = await response.json();
    renderLibrary(allBooks);
  } catch (error) {
    console.error('Could not load library data:', error);
  }
}

// Render book cards
function renderLibrary(books) {
  const grid = document.getElementById('libraryGrid');
  const count = document.getElementById('resultsCount');
  count.textContent = `Showing ${books.length} item${books.length !== 1 ? 's' : ''}`;

  if (books.length === 0) {
    grid.innerHTML = `<div class="no-results">📭 No results found. Try a different search.</div>`;
    return;
  }

  grid.innerHTML = books.map(book => `
    <div class="book-card">
      <img src="${book.cover}" alt="${book.title}" />
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="author">by ${book.author} · ${book.year}</p>
        <span class="category">${book.category}</span>
        <p class="description">${book.description}</p>
        <a href="${book.link}" target="_blank">Open Resource →</a>
      </div>
    </div>
  `).join('');
}

// Filter and sort
function applyFilters() {
  const query    = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort     = document.getElementById('sortOrder').value;

  let filtered = allBooks.filter(book => {
    const matchesSearch   = book.title.toLowerCase().includes(query) ||
                            book.author.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || book.category === category;
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    if (sort === 'year')   return b.year - a.year;
    if (sort === 'author') return a.author.localeCompare(b.author);
    return a.title.localeCompare(b.title); // default: title
  });

  renderLibrary(filtered);
}

// Event Listeners
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('categoryFilter').addEventListener('change', applyFilters);
document.getElementById('sortOrder').addEventListener('change', applyFilters);

// Initialize
loadLibrary();
