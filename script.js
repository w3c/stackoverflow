const table = document.querySelector("table");
const soSearchBase = "https://stackoverflow.com/search?q="
const questionsOnly = "+is:question";
const answersOnly = "+is:answer";
const withMdnURL = "+url:*developer.mozilla.org*";
const getTags = async () => {
  const response = await fetch("tags.json");
  const tags = await response.json();
  return tags;
}
table.insertAdjacentHTML("beforeend",
`<thead>
  <tr>
    <th>
    <th>Today
    <th>Week
    <th>Month
    <th>Year
    <th>All time
  </tr>
 </thead>`);
const makeRow = (key, params) => {
  urlBase = `${soSearchBase}${params.join("+or+")}`;
  const tr = document.createElement("tr");
  table.append(tr);
  tr.insertAdjacentHTML("beforeend",
    `<th title="${params.join('  ')}">${key}`);
  for (const range of ["1d", "7d", "1m", "1y", ""]) {
    const sortBy = range === "1d" ? "newest" : "votes";
    const howOld = range === "" ? "" : ` that are &lt;${range} old`;
    const and = range === "" ? "" : ` and`;
    const onlyThose =range === "" ? "" : `— and only those${howOld}`;
    const urlQuestions  =
      `${urlBase}+created:${range}..${questionsOnly}&tab=${sortBy}`;
    const urlAnswers =
      `${urlBase}+created:${range}..${answersOnly}&tab=${sortBy}`;
    const urlMdn =
      `${urlBase}+created:${range}..${withMdnURL}&tab=${sortBy}`;
    tr.insertAdjacentHTML("beforeend",
    `<td>
       <a href="${urlQuestions}" target=_blank rel=noreferrer
         title="Show all “${key}” questions${howOld}"
           ><img alt="questions" src="images/q.svg"></a>
       <a href="${urlAnswers}" target=_blank rel=noreferrer
         title="Show “${key}” answers${onlyThose}"
           ><img alt="answers" src="images/a.svg"></a>
       <a href="${urlMdn}" target=_blank rel=noreferrer
         title="Show all “${key}” questions and answers${howOld}${and}`
         + ` that contain any links to MDN articles"
           ><img alt="MDN" src="images/mdn.png"></a>`);
  }
}
getTags().then(tags => {
  for (const key of Object.keys(tags)) {
    const params = [];
    for (const tag of tags[key]) {
      params.push(`[${tag}]`);
    }
    makeRow(key, params);
  }
//  makeRow("HTML", ["[html]"]);
//  makeRow("JavaScript", ["[javascript]"]);
});
