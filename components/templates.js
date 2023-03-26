import { useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import { Button, Card, CardActions, CardContent, CardMedia, Chip, Skeleton, Typography } from "@mui/material";
import ResumeForm from "./resumeForm";

export default function Templates({ token, templates, user, update, setUpdate }) {
    const [open, setOpen] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({})

    return (
        <div>
            <h1>Templates</h1>
            {
                templates.length === 0 ?
                    <Grid container spacing={8} >
                        {
                            [1, 2, 3, 4].map((i) => {
                                return (
                                    <Grid item key={i}>
                                        <Card sx={{ width: 300 }}>
                                            <Skeleton variant="rectangular" width={300} height={150} />
                                            <CardContent>
                                                <Skeleton variant="text" />
                                                <Skeleton variant="text" />
                                                <Skeleton variant="text" />
                                            </CardContent>
                                            <CardActions>
                                                <Skeleton variant="rectangular" width={100} height={50} />
                                                <Skeleton variant="rectangular" width={100} height={50} />
                                                <Skeleton variant="rectangular" width={100} height={50} />
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    :
                    <Grid container spacing={8} >
                        {
                            templates.map((template, index) => {
                                return (
                                    <Grid item key={index} >
                                        <Card key={index} sx={{ width: 300 }}>
                                            <CardMedia
                                                sx={{ height: 150 }}
                                                image={template.config.image}
                                                title={template.config.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {template.config.name}
                                                </Typography>
                                                <Typography gutterBottom variant="body2" color="text.secondary" sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                                    {template.has_pages ?
                                                        <Chip label={"gh-pages"} />
                                                        :
                                                        null}
                                                    {
                                                        template.config.tags?.map((tag, index) => {
                                                            return (
                                                                <Chip key={index} label={tag} />
                                                            )
                                                        })
                                                    }
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {template.config.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    href={template.homepage ?? "#"}
                                                >
                                                    View Template
                                                </Button>
                                                <Button
                                                    size="small"
                                                    href={template.html_url ?? "#"}
                                                >
                                                    View Repo
                                                </Button>
                                                <Button variant="contained"
                                                    size="small"
                                                    onClick={() => {
                                                        setCurrentTemplate(template.config.id)
                                                        setOpen(true)
                                                    }}
                                                >
                                                    Create Repo
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
            }
            <ResumeForm
                template={templates.find(t => t.config.id === currentTemplate)}
                open={open}
                setOpen={setOpen}
                form={{}}
                accessToken={token}
                user={user}
                setUpdate={setUpdate}
                update={false}
            />
        </div >
    )
}