import "./Blink.css";
import { Typography } from "@mui/material";

export default function Blink({ variant, fontFamily, textAlign, color, fontSize, text }) {
    return (
        <Typography
            className="blink"
            variant={variant}
            sx={{
                fontFamily,
                textAlign,
                color,
                fontSize
            }}>
            {text}
        </Typography>
    );
};