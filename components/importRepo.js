import { TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import ResumeForm from "./resumeForm";

export default function ImportRepo({ token, user, setUpdate }) {
    const [repo, setRepo] = useState("")
    const [template, setTemplate] = useState({})
    const [open, setOpen] = useState(false)
    return (
        <div>
            <h1>Use your own Template</h1>
            <Box
                component="form"
                onSubmit={(event) => {
                    event.preventDefault()
                    fetch("/api/importRepo", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({
                            accessToken: token,
                            username: user.login,
                            githubUrl: repo
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                            if (data.error) {
                                alert(data.error)
                                return
                            }
                            if (data.message) {
                                alert(data.message)
                                return
                            }
                            setTemplate(data)
                            setOpen(true)
                        })
                }}
            >
                <TextField id="outlined-basic" label="GitHub URL" variant="outlined" helperText="Enter the repo link here" sx={{ width: "50vw" }}
                    value={repo}
                    onChange={(event) => setRepo(event.target.value)}
                />
                <br />
                <Button variant="contained" sx={{ marginTop: "1vw" }}
                    type="submit">Import</Button>
            </Box>
            <ResumeForm
                template={template}
                open={open}
                setOpen={setOpen}
                form={{}}
                accessToken={token}
                user={user}
                setUpdate={setUpdate}
                update={false}
            />
        </div>
    )
}