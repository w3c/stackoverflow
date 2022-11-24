const div = document.querySelector("div");
const launchSubset = [
  "IndexedDB",
  "Service Worker",
  "WebAssembly",
  "WebGPU",
  "WebAudio+WebMIDI",
  "WebRTC+WebTransport",
  "Media",
  "Platform interaction",
  "Performance+profiling",
  "WebAuthn",
  "CSP",
  "Security",
  "Accessibility",
];
const soSearchBase = "https://stackoverflow.com/search?q="
const questionsOnly = "+is:question";
const answersOnly = "+is:answer";
const withMdnURL = "+url:*developer.mozilla.org*";
const getTags = async () => {
  const response = await fetch("tags.json");
  const tags = await response.json();
  return tags;
}
const getCounts = async () => {
  const response = await fetch("counts.json");
  const tags = await response.json();
  return tags;
}
const makeTable = (tags, categories, caption, counts) => {
  const totalTags = [];
  const table = document.createElement("table");
  table.setAttribute("class","collective");
  div.append(table)
  table.insertAdjacentHTML("beforeend",
    `<caption>${caption}</caption></table>
     <thead>
      <tr>
        <th>
        <th>Today
        <th>Week
        <th>Month
        <th>Year
        <th>All time
      </tr>
     </thead>`);
  const totals = {"1d": 0, "7d": 0, "1m": 0 , "1y": 0 , "all": 0 }
  for (const category of categories) {
    if (category === "Browsers") {
      continue;
    }
    const params = [];
    for (const tag of tags[category]) {
      params.push(`[${tag}]`);
      totalTags.push(`[${tag}]`);
    }
    makeRow(category, params, counts, totals, table);
  }
  const tr = document.createElement("tr");
  console.log(table.querySelector("thead"));
  table.querySelector("thead").append(tr);
  tr.insertAdjacentHTML("beforeend",
    `<th
      title="${totalTags.join('  ')}">Totals (${totalTags.length} tags)`);
  for (const category in totals) {
    tr.insertAdjacentHTML("beforeend",
      `<td class=number>${totals[category]}`);
  }
}
const makeRow = (category, params, counts, totals, table) => {
  urlBase = `${soSearchBase}${params.join("+or+")}`;
  const tr = document.createElement("tr");
  table.append(tr);
  tr.insertAdjacentHTML("beforeend",
    `<th title="${params.join('  ')}">${category}`);
  for (const range of ["1d", "7d", "1m", "1y", "all"]) {
    const howOld = range === "" ? "" : ` that are &lt;${range} old`;
    const urlQuestions  =
      `${urlBase}+created:${range}..${questionsOnly}`;
    const count = counts[category][range];
    totals[range] = totals[range] + count;
    tr.insertAdjacentHTML("beforeend",
    `<td class=number>
       <a href="${urlQuestions}" target=_blank rel=noreferrer
         title="Show all “${category}” questions${howOld}"
           >${count}</a>
    `);
  }
}
getTags().then(tags => {
  getCounts().then(counts => {
    makeTable(tags, Object.keys(tags),
      "Full set of relevant tag groups", counts);
    makeTable(tags, launchSubset,
      "Initial subset of tag groups for collective launch", counts);
  });
});
