import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GitHub from "./github";
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import logo from "../public/QuixFolio.png";
export default function Navbar() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Box sx={{ flexGrow: 1 }} >
                        <Image
                            src={logo}
                            alt="QuixFolio"
                            height={40}
                        />
                    </Box>
                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        QuixFolio
                    </Typography> */}
                    <GitHub />
                </Toolbar>
            </AppBar>
        </Box>
    )
}