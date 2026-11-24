"use strict";

/* Add or remove repository names here to choose which projects appear */
const githubUsername = "senirualuthge";
const featuredRepos = [
  "FiFA-Score-Widget"
  // "another-repo-name",
];

const status = document.querySelector(".github-status");
const container = document.querySelector(".github-repositories");

function createRepoCard(repo) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = repo.name;

  const description = document.createElement("p");
  description.textContent = repo.description || "No description provided.";

  const language = document.createElement("p");
  language.className = "tech";
  language.textContent = repo.language || "Other";

  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View repository →";

  card.append(title, description, language, link);
  return card;
}

async function fetchRepo(name) {
  const response = await fetch(
    `https://api.github.com/repos/${githubUsername}/${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error(`${name}: GitHub responded with ${response.status}`);
  }

  return response.json();
}

async function loadProjects() {
  const results = await Promise.allSettled(featuredRepos.map(fetchRepo));
  const repositories = results
    .filter(result => result.status === "fulfilled")
    .map(result => result.value);

  results
    .filter(result => result.status === "rejected")
    .forEach(result => console.error("GitHub API error:", result.reason));

  if (repositories.length === 0) {
    status.textContent = "Projects could not be loaded. Please visit my GitHub profile.";
    return;
  }

  status.textContent = "";
  repositories.forEach(repo => container.appendChild(createRepoCard(repo)));
}

loadProjects();
