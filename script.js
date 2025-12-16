const API_KEY = "9130135408649804ad416e170bce9c80";
const BASE_URL = "https://gnews.io/api/v4/search?q=";

const loader = document.getElementById("loader");

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  showLoader(true);
  try {
    const res = await fetch(
      `${BASE_URL}${query}&lang=en&country=in&max=9&token=${API_KEY}`
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    bindData(data.articles);
  } catch (err) {
    showError("Unable to load news. API limit may be exceeded.");
  } finally {
    showLoader(false);
  }
}

function bindData(articles) {
  const container = document.getElementById("cards-container");
  const template = document.getElementById("template-news-card");

  container.innerHTML = "";

  if (!articles || articles.length === 0) {
    showError("No news found");
    return;
  }

  articles.forEach(article => {
    if (!article.image) return;

    const clone = template.content.cloneNode(true);
    fillData(clone, article);
    container.appendChild(clone);
  });
}

function fillData(cardClone, article) {
  cardClone.querySelector("#news-img").src = article.image;
  cardClone.querySelector("#news-title").textContent = article.title;
  cardClone.querySelector("#news-desc").textContent =
    article.description || "No description available";

  const date = new Date(article.publishedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  cardClone.querySelector("#news-source").textContent =
    `${article.source.name} · ${date}`;

  cardClone.firstElementChild.onclick = () =>
    window.open(article.url, "_blank");
}

function showError(message) {
  document.getElementById("cards-container").innerHTML =
    `<p style="color:red;">${message}</p>`;
}

function showLoader(show) {
  loader.classList.toggle("hidden", !show);
}

/* NAVIGATION */
let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

/* SEARCH */
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchText.addEventListener("keydown", e => {
  if (e.key === "Enter") searchButton.click();
});

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
