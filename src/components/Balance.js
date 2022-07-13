import { Grid } from "@mui/material";

export default function Balance({ image }) {
    return (
        <Grid container justifyContent="center">
            <img src={image} alt="Balance" />
        </Grid>
    );
};