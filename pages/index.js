import Head from 'next/head'
import Templates from '@/components/templates'
import { Container } from '@mui/system'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import Repos from '@/components/repos'
import { useRouter } from 'next/router'
import ImportRepo from '@/components/importRepo'
import ReportBug from '@/components/reportBug'

export default function Home() {
  const [token, setToken] = useState("")
  const [user, setUser] = useState({})
  const [templates, setTemplates] = useState([])
  const [update, setUpdate] = useState(false)
  const router = useRouter()

  function getToken() {
    let token = localStorage.getItem("accessToken")
    let user = JSON.parse(localStorage.getItem("user"))
    if (token) {
      setToken(token)
    } else {
      // route to /about
      router.push("/about")
    }
    if (user) {
      setUser(user)
    }
  }

  function getTemplates(token) {
    fetch("/api/getTemplates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTemplates(data)
      })
  }

  useEffect(() => {
    if (token) {
      getTemplates(token)
    }
  }, [token])

  useEffect(() => {
    if (window != undefined) {
      // check if path contains query code
      if (!window.location.search.includes("code")) {
        window.addEventListener("storage", () => {
          getToken()
        })
        getToken()
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>Quixfolio</title>
        <meta name="description" content="Create your own portfolio website in minutes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Container sx={{ mb: 10, mt: 10 }}>
        <Repos token={token} user={user} templates={templates} update={update} setUpdate={setUpdate} />
        <ImportRepo token={token} user={user} setUpdate={setUpdate} />
        <Templates token={token} templates={templates} user={user} update={update} setUpdate={setUpdate} />
        {/* add a line */}
        <ReportBug />
      </Container>
    </>
  )
}
