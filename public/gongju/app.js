import { categories, tools } from "./data.js";

const grid = document.querySelector("#tool-grid");
const filters = document.querySelector("#category-filters");
const searchInput = document.querySelector("#tool-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const resetButton = document.querySelector("#reset-search");

let activeCategory = "全部工具";
let searchTerm = "";

const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;

function createFilters() {
  filters.innerHTML = categories
    .map(
      (category, index) => `
        <button
          class="filter-button${index === 0 ? " active" : ""}"
          type="button"
          data-category="${category}"
          aria-pressed="${index === 0}"
        >${category}</button>
      `
    )
    .join("");
}

function createCard(tool, index) {
  const initials = tool.name.replace(/[^A-Za-z\u4e00-\u9fff]/g, "").slice(0, 2);
  return `
    <a
      class="tool-card"
      href="${tool.url}"
      target="_blank"
      rel="noopener noreferrer"
      style="--brand: ${tool.color}; --delay: ${Math.min(index, 9) * 45}ms"
      aria-label="打开 ${tool.name}（新窗口）"
    >
      <div class="card-topline">
        <span class="tool-number">${tool.id}</span>
        <span class="tool-category">${tool.category}</span>
        ${icon("arrow-up-right")}
      </div>
      <div class="tool-identity">
        <div class="logo-wrap">
          <img src="${tool.logo}" alt="${tool.name} logo" />
          <span class="logo-fallback">${initials}</span>
        </div>
        <h3>${tool.name}</h3>
      </div>
      <p class="tool-description">${tool.description}</p>
      <div class="card-footer">
        <span>${tool.appOnly ? icon("smartphone") : icon("globe-2")}${tool.domain}</span>
        <span class="open-label">打开工具</span>
      </div>
    </a>
  `;
}

function render() {
  const normalizedTerm = searchTerm.toLowerCase().trim();
  const visibleTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === "全部工具" || tool.category === activeCategory;
    const searchable = `${tool.name} ${tool.description} ${tool.category} ${tool.domain}`.toLowerCase();
    return matchesCategory && searchable.includes(normalizedTerm);
  });

  grid.innerHTML = visibleTools.map(createCard).join("");
  resultCount.textContent = String(visibleTools.length).padStart(2, "0");
  emptyState.hidden = visibleTools.length !== 0;
  grid.hidden = visibleTools.length === 0;

  document.querySelectorAll(".logo-wrap img").forEach((image) => {
    image.addEventListener("error", () => image.classList.add("is-hidden"), { once: true });
  });

  if (window.lucide) window.lucide.createIcons();
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  filters.querySelectorAll("button").forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  render();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  render();
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  activeCategory = "全部工具";
  filters.querySelectorAll("button").forEach((button) => {
    const isActive = button.dataset.category === activeCategory;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  render();
  searchInput.focus();
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchTerm = "";
    searchInput.blur();
    render();
  }
});

createFilters();
render();
