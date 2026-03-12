/**
 * Live GitHub contribution graph – fetches data from GitHub GraphQL API
 * and renders a calendar grid matching GitHub’s contribution graph style.
 */
(function () {
  const GITHUB_GRAPHQL = "https://api.github.com/graphql";

  function getLevel(count) {
    if (count <= 0) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  }

  function fetchContributions(username) {
    const to = new Date();
    const from = new Date(to);
    from.setFullYear(from.getFullYear() - 1);
    const fromStr = from.toISOString().slice(0, 10);
    const toStr = to.toISOString().slice(0, 10);

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    return fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          username,
          from: fromStr + "T00:00:00Z",
          to: toStr + "T23:59:59Z",
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.errors) throw new Error(data.errors[0]?.message || "GraphQL error");
        const cal = data?.data?.user?.contributionsCollection?.contributionCalendar;
        if (!cal) throw new Error("No contribution calendar data");
        return cal;
      });
  }

  function buildMonthLabels(weeks) {
    const months = [];
    let lastMonth = null;
    weeks.forEach((week, colIndex) => {
      const firstDay = week.contributionDays && week.contributionDays[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        const name = new Date(firstDay.date + "T00:00:00").toLocaleString("en-US", { month: "short" });
        months.push({ col: colIndex, name });
        lastMonth = month;
      }
    });
    return months;
  }

  function render(container, username) {
    const gridEl = document.getElementById("commit-graph-grid");
    const monthsEl = document.getElementById("commit-graph-months");
    if (!gridEl || !monthsEl) return;

    gridEl.innerHTML = "";
    monthsEl.innerHTML = "";
    gridEl.setAttribute("aria-busy", "true");

    fetchContributions(username)
      .then((cal) => {
        const weeks = cal.weeks || [];
        const monthLabels = buildMonthLabels(weeks);
        const numCols = weeks.length;

        monthsEl.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        monthLabels.forEach((m, i) => {
          const span = document.createElement("span");
          span.className = "commit-graph__month";
          span.textContent = m.name;
          const endCol = (monthLabels[i + 1] && monthLabels[i + 1].col + 1) || numCols + 1;
          span.style.gridColumn = `${m.col + 1} / ${endCol}`;
          monthsEl.appendChild(span);
        });

        // Grid: 7 rows (Mon–Sun), one column per week. API uses Sun=0, Mon=1, … Sat=6.
        const ROWS = 7;
        const rowOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon .. Sun

        for (let r = 0; r < ROWS; r++) {
          const dayIndex = rowOrder[r];
          for (let c = 0; c < numCols; c++) {
            const cell = document.createElement("span");
            cell.className = "commit-graph__cell";
            const day = weeks[c].contributionDays && weeks[c].contributionDays[dayIndex];
            const count = day ? day.contributionCount : 0;
            const level = getLevel(count);
            cell.setAttribute("data-level", String(level));
            cell.setAttribute("title", day ? `${day.date}: ${count} contributions` : "No contributions");
            gridEl.appendChild(cell);
          }
        }

        gridEl.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        gridEl.removeAttribute("aria-busy");
      })
      .catch(() => {
        gridEl.removeAttribute("aria-busy");
        // Fallback: show external chart image when API is unavailable (e.g. no token / CORS)
        const wrap = gridEl.closest(".bento-card__commit-graph-wrap");
        if (wrap) {
          const username = root.getAttribute("data-username") || "yogeshbhusara";
          wrap.innerHTML = "<img src=\"https://ghchart.rshah.org/" + username + "\" alt=\"GitHub contribution graph\" class=\"commit-graph__fallback-img\" loading=\"lazy\" />";
        } else {
          gridEl.innerHTML = "<span class='commit-graph__error'>Unable to load contribution data.</span>";
        }
      });
  }

  const root = document.getElementById("commit-graph");
  if (!root) return;
  const username = root.getAttribute("data-username") || "yogeshbhusara";
  render(root, username);
})();
