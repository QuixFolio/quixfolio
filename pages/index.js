import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import ResumeForm from '@/components/forms'
import Templates from '@/components/templates'
import { Container } from '@mui/system'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import Repos from './repos'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [token, setToken] = useState("")
  const [user, setUser] = useState({})
  const [templates, setTemplates] = useState([])

  function getToken() {
    let token = localStorage.getItem("accessToken")
    let user = JSON.parse(localStorage.getItem("user"))
    setUser(user)
    setToken(token)
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
    window.addEventListener("storage", () => {
      getToken()
    })
    getToken()
  }, [])

  return (
    <>
      <Head>
        <title>Quixfolio</title>
        <meta name="description" content="Create your own portfolio website in minutes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Container>
        <Templates token={token} templates={templates} />
        <Repos token={token} user={user} templates={templates} />
      </Container>
    </>
  )
}
