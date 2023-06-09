import { load } from "cheerio";

export default async function handler(req, res) {
  const token = req.body.accessToken;
  const repoOwner = req.body.user.login;
  const repoName = req.body.cloneName;
  let config = req.body.config;
  // fetch the /repo/quixfolio.json file
  /* let config = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/quixfolio.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                return res.status(500).json({ error: data.message })
            }
            let config = Buffer.from(data.content, 'base64').toString('ascii')
            config = JSON.parse(config)
            return config
        }) */
  let pages = {};
  // fetch all of the pages in the schema
  for (let page in config.schema) {
    if (!config.schema[page].page) continue;
    page = config.schema[page].page;
    if (!pages[page]) {
      await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((file) => {
          if (file.content) {
            let content = Buffer.from(file.content, "base64").toString("ascii");
            pages[page] = {
              content: content,
              sha: file.sha,
            };
          }
        });
    }
  }
  let form = {};
  form.repoName = repoName;
  form.repoOwner = repoOwner;
  form.cloneName = repoName;
  Object.keys(config.schema).forEach((key) => {
    if (config.schema[key].page) {
      if (config.schema[key].type === "array") {
        let $ = load(pages[config.schema[key].page].content);
        let element = $(`#${key}`);
        form[key] = [];
        if (element.attr("hidden")) return;
        for (let child of element.children()) {
          let fields = {};
          Object.keys(config.schema[key].items).forEach((item) => {
            if (config.schema[key].items[item].type === "link") {
              let link = $(child).find(`[${item}]`).attr("href");
              fields[item] = link;
            } else if (config.schema[key].items[item].type === "image") {
              let image = $(child).find(`[${item}]`).attr("src");
              fields[item] = image;
            } else {
              let value = $(child).find(`[${item}]`).text();
              fields[item] = value;
            }
          });
          form[key].push(fields);
        }
      } else {
        let $ = load(pages[config.schema[key].page].content);
        if (config.schema[key].type === "link") {
          let link = $(`#${key}`).attr("href");
          form[key] = link;
        } else if (config.schema[key].type === "image") {
          let image = $(`#${key}`).attr("src");
          form[key] = image;
        } else {
          let value = $(`#${key}`).text();
          form[key] = value;
        }
        // let element = $(`#${key}`)
        // form[key] = element.html()
      }
    }
  });
  return res.status(200).json(form);
}
