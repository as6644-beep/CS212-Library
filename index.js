// Shared script for every page.

const BOOKS_URL = "../data/books.json";

// Reads books.json and builds one card per book.
async function loadBooks() {
  const list = document.getElementById("book-list");
  const count = document.getElementById("book-count");
  if (!list) return;

  try {
    const response = await fetch(BOOKS_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const books = await response.json();

    list.innerHTML = "";
    for (const book of books) {
      list.appendChild(createBookCard(book));
    }
    count.textContent = `Showing ${books.length} books`;
  } catch (error) {
    count.textContent =
      "Books could not load. Open the site with Live Server or GitHub Pages.";
    console.error(error);
  }
}

// Local covers live in images/. Full URLs are used as they are.
function coverPath(url) {
  return url.startsWith("http") ? url : `../${url}`;
}

function createBookCard(book) {
  const col = document.createElement("div");
  col.className = "col";

  const badge = book.available
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-borrowed">Borrowed</span>';

  col.innerHTML = `
    <div class="card book-card shadow-sm">
      <img src="${coverPath(book.coverUrl)}" class="card-img-top book-cover" alt="Cover of ${book.title}" />
      <div class="card-body d-flex flex-column">
        <h3 class="h6 card-title mb-1">${book.title}</h3>
        <p class="card-text small mb-1">${book.author}</p>
        <p class="card-text small text-body-secondary mb-2">${book.genre} · ${book.year}</p>
        <div class="mb-3">${badge}</div>
        <div class="mt-auto d-flex gap-2">
          <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#borrow-modal">Borrow</button>
          <a class="btn btn-sm btn-outline-secondary" href="./add-book.html">Edit</a>
        </div>
      </div>
    </div>`;
  return col;
}

// Shows Bootstrap validation styles on the Add/Edit form.
function setupFormValidation() {
  const form = document.getElementById("book-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    const message = document.getElementById("form-message");
    message.classList.toggle("d-none", !form.checkValidity());
  });
}

loadBooks();
setupFormValidation();
