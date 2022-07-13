import { Box, Typography } from "@mui/material";

import red from "../images/red.png";
import blue from "../images/blue.png";

const FONT = {
    fontFamily: "Bank Gothic",
    textAlign: "center"
}

export default function CompetitionClock({ currentState, image, timer, isWinnerFinal }) {
    const getName = () => {
        if (currentState === "endwait") {
            return "End Game Countdown";
        }

        return currentState.charAt(0).toUpperCase() + currentState.slice(1);
    };

    const getLead = () => {
        if (image === red) {
            return `Red ${isWinnerFinal ? "Wins!" : "Lead"}`;
        } else if (image === blue) {
            return `Blue ${isWinnerFinal ? "Wins!" : "Lead"}`;
        } else {
            return `Tie${isWinnerFinal ? ": Sudden Death" : ""}`;
        }
    };

    const getLeadColor = () => {
        if (image === red) {
            return "red";
        } else if (image === blue) {
            return "blue";
        } else {
            return "purple";
        }
    };

    const getTime = () => {
        return new Date(timer[currentState] * 1000).toISOString().slice(14, 19);
    };

    return (
        <Box className="CompetitionClock">
            <Typography
                variant="h3"
                sx={{
                    ...FONT,
                    fontSize: "125px",
                    color: "#EEAD1E",
                }}
            >
                {getTime()}
            </Typography>
            <Typography
                variant="h2"
                sx={{
                    ...FONT,
                    fontSize: "75px",
                    color: "#FFFFFF",
                }}
            >
                {getName()}
            </Typography>
            <Typography
                variant="h2"
                sx={{
                    ...FONT,
                    fontSize: "75px",
                    color: getLeadColor(),
                }}
            >
                {getLead()}
            </Typography>
        </Box>
    );
}