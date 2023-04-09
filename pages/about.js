import Head from "next/head";
import Navbar from "@/components/Navbar";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

export default function About() {
  return (
    <>
      <Head>
        <title>Quixfolio</title>
        <meta
          name="description"
          content="Create your own portfolio website in minutes"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box>
        <Container sx={{ pt: 8, pb: 6 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Create Stunning Portfolios in Minutes
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Quixfolio helps you build beautiful portfolios without any coding
            skills
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  href={
                    "https://github.com/login/oauth/authorize?" +
                    new URLSearchParams({
                      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
                      redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URL,
                      scope: "delete_repo repo",
                      state: "1234567890",
                    }).toString()
                  }
                  variant="contained"
                  size="large"
                >
                  Get Started
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" size="large"
                  href="https://github.com/QuixFolio/quixfolio"
                >
                  Learn More
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Container>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Why Choose Quixfolio?
          </Typography>
          <Grid container spacing={4} sx={{ marginTop: "48px" }}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Easy to Use
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575" }}
                  >
                    Quixfolio provides pre-built templates that you can
                    customize with a few clicks, so you can focus on showcasing
                    your work instead of worrying about coding.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Wide Selection of Templates
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575" }}
                  >
                    Quixfolio offers a variety of professionally designed
                    templates to choose from, so you can find the perfect style
                    to showcase your work and highlight your unique skills.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Free to Use
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575" }}
                  >
                    Quixfolio is completely free to use, so you can create your
                    stunning portfolio without any hidden fees or charges.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <Container sx={{ py: 12 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ marginTop: "48px" }}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    &quot;Quixfolio is the best portfolio builder I&apos;ve ever
                    used!&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575" }}
                  >
                    &quot;I&apos;ve been using Quixfolio for a few months now
                    and I&apos;m absolutely loving it! It&apos;s so easy to use
                    and it&apos;s helped me create a beautiful portfolio that
                    I&apos;m really proud of. I would highly recommend Quixfolio
                    to anyone who wants to create a portfolio without any coding
                    skills. &quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575", marginTop: "24px" }}
                  >
                    - Atharav Solutions Bhai
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    &quot;Quixfolio is the best portfolio builder I&apos;ve ever
                    used!&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575" }}
                  >
                    &quot;I&apos;ve tried a lot of portfolio builders, but
                    Quixfolio is by far the easiest to use. I love that I can
                    customize my portfolio with just a few clicks, and I can
                    switch between templates whenever I want.&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575", marginTop: "24px" }}
                  >
                    - John Doe
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    &quot;Quixfolio is the best portfolio builder I&apos;ve ever
                    used!&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575" }}
                  >
                    &quot;I&apos;ve tried a lot of portfolio builders, but
                    Quixfolio is by far the easiest to use. I love that I can
                    customize my portfolio with just a few clicks, and I can
                    switch between templates whenever I want.&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ color: "#757575", marginTop: "24px" }}
                  >
                    - John Doe
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
