import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import ResumeForm from '@/components/forms'
import Templates from '@/components/templates'
import { Container } from '@mui/system'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Quixfolio</title>
        <meta name="description" content="Create your own portfolio website in minutes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <Container>
        <Templates />
      </Container>
    </>
  )
}
