document.addEventListener("DOMContentLoaded", function () {
  const notesContainer = document.getElementById("notesContainer");
  const addNoteBtn = document.getElementById("addNoteBtn");
  const addNoteModal = document.getElementById("addNoteModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const noteForm = document.getElementById("noteForm");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const emptyState = document.getElementById("emptyState");
  const confirmModal = document.getElementById("confirmModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let noteToDeleteId = null;

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function renderNotes(notesToRender = notes) {
    notesContainer.innerHTML = "";
    notesToRender.forEach((note, index) => {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card";
      noteCard.innerHTML = `
        <div class="note-content">
          <h3 class="note-title">${note.title}</h3>
          <p class="note-text">${note.content}</p>
          <div class="note-footer">
            <span class="note-tag ${getTagClass(note.tag)}">
              ${getTagIcon(note.tag)} ${getTagName(note.tag)}
            </span>
            <span class="note-date">${formatDate(note.date)}</span>
            <button class="delete-btn" data-id="${index}"><i class="fas fa-trash"></i></button>
          </div>
        </div>`;
      notesContainer.appendChild(noteCard);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        noteToDeleteId = parseInt(this.getAttribute("data-id"));
        openConfirmModal();
      });
    });

    updateEmptyState(notesToRender);
  }

  function getTagClass(tag) {
    return {
      work: "tag-work",
      personal: "tag-personal",
      ideas: "tag-ideas",
      reminders: "tag-reminders"
    }[tag] || "";
  }

  function getTagName(tag) {
    return {
      work: "Work",
      personal: "Personal",
      ideas: "Ideas",
      reminders: "Reminder"
    }[tag] || "";
  }

  function getTagIcon(tag) {
    return {
      work: '<i class="fas fa-briefcase"></i>',
      personal: '<i class="fas fa-user"></i>',
      ideas: '<i class="fas fa-lightbulb"></i>',
      reminders: '<i class="fas fa-bell"></i>'
    }[tag] || '<i class="fas fa-tag"></i>';
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function openAddNoteModal() {
    addNoteModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeAddNoteModal() {
    addNoteModal.classList.remove("active");
    document.body.style.overflow = "auto";
    noteForm.reset();
  }

  function openConfirmModal() {
    confirmModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeConfirmModal() {
    confirmModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function handleNoteSubmit(e) {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    const tag = document.querySelector("input[name='noteTag']:checked").value;

    notes.unshift({ title, content, tag, date: new Date().toISOString() });
    saveNotes();
    renderNotes();
    closeAddNoteModal();
  }

  function confirmDeleteNote() {
    if (noteToDeleteId !== null) {
      notes.splice(noteToDeleteId, 1);
      saveNotes();
      renderNotes();
      closeConfirmModal();
    }
  }

  function updateEmptyState(currentNotes = notes) {
    emptyState.style.display = currentNotes.length ? "none" : "block";
  }

  function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterSelect.value;
    let filtered = notes.filter(note => {
      return (
        (filter === "all" || note.tag === filter) &&
        (note.title.toLowerCase().includes(searchTerm) ||
         note.content.toLowerCase().includes(searchTerm))
      );
    });
    renderNotes(filtered);
  }

  addNoteBtn.addEventListener("click", openAddNoteModal);
  closeModalBtn.addEventListener("click", closeAddNoteModal);
  noteForm.addEventListener("submit", handleNoteSubmit);
  searchInput.addEventListener("input", filterNotes);
  filterSelect.addEventListener("change", filterNotes);
  cancelDeleteBtn.addEventListener("click", closeConfirmModal);
  confirmDeleteBtn.addEventListener("click", confirmDeleteNote);

  renderNotes();
});

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;

function setThemeIcon(isDark) {
  themeIcon.src = isDark ? "assets/sun.svg.svg" : "assets/moon.svg.svg"; // Make sure these are the correct file names
  themeIcon.alt = isDark ? "Light mode" : "Dark mode";
}

// On page load
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  setThemeIcon(true);
} else {
  setThemeIcon(false);
}

// On toggle click
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark");

  // Trigger smooth rotation
  themeToggle.classList.remove("rotate-forward", "rotate-backward");
  void themeToggle.offsetWidth;
  themeToggle.classList.add(isDark ? "rotate-backward" : "rotate-forward");

  // Toggle theme
  body.classList.toggle("dark");

  // Switch icon
  setThemeIcon(!isDark);

  // Save to storage
  localStorage.setItem("theme", !isDark ? "dark" : "light");
});
