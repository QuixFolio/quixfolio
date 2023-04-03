import { Button, Typography } from "@mui/material";

export default function ReportBug() {
    const handleClick = () => {
        window.open("https://github.com/QuixFolio/quixfolio/issues/new");
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "100px", marginBottom: "20px" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                Found a bug? Let us know!
            </Typography>
            <Button variant="outlined" onClick={handleClick} color="error">
                Report a Bug
            </Button>
        </div>
    );
}