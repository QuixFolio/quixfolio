// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function getAccessToken(code) {
  let accessToken = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URL,
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return data.access_token
    })
  console.log(accessToken)
  return accessToken
}


export default async function handler(req, res) {
  const code = req.body.code
  const accessToken = await getAccessToken(code)
  res.status(200).json({ accessToken: accessToken })
}
