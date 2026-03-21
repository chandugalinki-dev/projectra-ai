// ================================================================
// script.js — JavaScript logic for Projectra AI
//
// This file only does 3 simple things:
//   1. Show a page when a nav link is clicked  → openPage()
//   2. Go back to home when Back is clicked    → goHome()
//   3. Handle the filter buttons on Projects page (highlight active)
// ================================================================


// ----------------------------------------------------------------
// openPage(pageId) — SHOW A SPECIFIC PAGE
//
// How it works:
//   Step 1: Hide the home section
//   Step 2: Hide all other inner pages
//   Step 3: Show only the page that was requested
//   Step 4: Scroll back to top so user sees the page from top
//
// @param pageId — the id of the <section> to show
//                 e.g. "projects", "degree", "aiml-projects"
// ----------------------------------------------------------------
function openPage(pageId) {

  // Step 1: Hide the home section
  document.getElementById("home").style.display = "none";

  // Step 2: Find all elements with class="page" and hide them all
  // querySelectorAll returns a list of all matching elements
  var allPages = document.querySelectorAll(".page");
  allPages.forEach(function (page) {
    page.style.display = "none";
  });

  // Step 3: Show only the requested page
  // auth-page uses flex layout, all others use block
  var targetPage = document.getElementById(pageId);
  if (targetPage.classList.contains("auth-page")) {
    targetPage.style.display = "flex";   /* auth-page needs flex to center the card */
  } else {
    targetPage.style.display = "block";  /* all other pages use block */
  }

  // Step 4: Scroll the window back to the very top (0, 0)
  // So the user always sees the page from the beginning
  window.scrollTo(0, 0);

}


// ----------------------------------------------------------------
// goHome() — GO BACK TO HOME PAGE
//
// Hides all inner pages and shows the home section again.
// Called by: Back buttons, Logo clicks on inner pages
// ----------------------------------------------------------------
function goHome() {

  // Step 1: Hide all inner pages
  var allPages = document.querySelectorAll(".page");
  allPages.forEach(function (page) {
    page.style.display = "none";
  });

  // Step 2: Show the home section
  document.getElementById("home").style.display = "block";

  // Step 3: Scroll to top
  window.scrollTo(0, 0);

}


// ----------------------------------------------------------------
// FILTER BUTTONS — Projects page (All / Beginner / Intermediate / Advanced)
//
// When a filter button is clicked:
//   1. Remove the "active" class from ALL filter buttons
//   2. Add the "active" class to ONLY the clicked button
//
// The "active" class in CSS gives the button a filled sky blue look.
// This is just visual for now — filtering logic comes later.
// ----------------------------------------------------------------

// Wait for the page to fully load before running this code
// "DOMContentLoaded" fires when all HTML elements are ready
document.addEventListener("DOMContentLoaded", function () {

  // Get all elements with class "filter-btn"
  var filterButtons = document.querySelectorAll(".filter-btn");

  // Loop through each filter button and add a click listener
  filterButtons.forEach(function (button) {

    // When THIS button is clicked...
    button.addEventListener("click", function () {

      // Step 1: Remove "active" class from all filter buttons
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        // classList.remove() removes a CSS class from an element
      });

      // Step 2: Add "active" class to the clicked button only
      button.classList.add("active");
      // classList.add() adds a CSS class to an element

    });

  });

});
// End of DOMContentLoaded


// ----------------------------------------------------------------
// showTab(formId, tabId) — SWITCH BETWEEN SIGN UP AND LOGIN
//
// Called when user clicks "Sign Up" or "Login" tab buttons.
// Steps:
//   1. Hide ALL auth forms
//   2. Remove "active" from ALL tab buttons
//   3. Show only the requested form
//   4. Make only the clicked tab button active
//
// @param formId — the id of the <div> form to show
// @param tabId  — the id of the tab <button> to highlight
// ----------------------------------------------------------------
function showTab(formId, tabId) {

  // Step 1: Hide all auth forms (signup-form and login-form)
  var allForms = document.querySelectorAll(".auth-form");
  allForms.forEach(function (form) {
    form.style.display = "none";
  });

  // Step 2: Remove "active" class from all tab buttons
  var allTabs = document.querySelectorAll(".auth-tab");
  allTabs.forEach(function (tab) {
    tab.classList.remove("active");
  });

  // Step 3: Show only the requested form
  document.getElementById(formId).style.display = "block";

  // Step 4: Highlight only the clicked tab button
  document.getElementById(tabId).classList.add("active");

}

// Filter functionality
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    // Remove active from all
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    projectCards.forEach(card => {
      const level = card.getAttribute("data-level");

      if (filter === "all" || level === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

  });
});

// For Recommendation
function getRecommendations() {
  const userInput = document.getElementById("userInput").value;

  fetch(`/recommend?query=${userInput}`)
    .then(response => response.json())
    .then(data => {
      const container = document.querySelector(".projects-container");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No Recommendations Found :(</p>";
        return;
      }

      data.forEach(project => {
        container.innerHTML += `
          <div class="project-card" onclick="openProject(${project.id})">
            <h3>${project.title}</h3>
            <p><b>Domain:</b> ${project.domain}</p>
            <p><b>Level:</b> ${project.level}</p>
          </div>
        `;
      });
    });
}




// ----------------------------------------------------------------
// NOTE FOR FUTURE:
// The "Let's Make!" button currently goes to the Projects page.
// Later, when the ML recommendation feature is built, update the
// onclick in index.html to go to a new "recommendation" page.
// ----------------------------------------------------------------

// To open_up the specific project in a page.
function openProject(id) {
  window.location.href = `/project/${id}`;
}