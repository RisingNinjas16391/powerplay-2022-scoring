import { Box, Typography } from "@mui/material";
import Blink from "./Blink";

import red from "../images/red.png";
import blue from "../images/blue.png";

const FONT = {
  fontFamily: "Bank Gothic",
  textAlign: "center",
};

const BLINK = ["00:03", "00:02", "00:01"];

export default function CompetitionClock({
  currentState,
  image,
  timer,
  isWinnerFinal,
}) {
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

  const getTimeComponent = () => {
    const time = getTime();

    if (BLINK.includes(time) && currentState !== "endwait") {
      return (
        <Blink
          variant="h3"
          fontFamily={FONT.fontFamily}
          textAlign={FONT.textAlign}
          fontSize="125px"
          color="#EEAD1E"
          text={time}
        />
      );
    }

    return (
      <Typography
        variant="h3"
        sx={{
          ...FONT,
          fontSize: "125px",
          color: "#EEAD1E",
        }}
      >
        {time}
      </Typography>
    );
  };

  return (
    <Box className="CompetitionClock">
      {getTimeComponent()}
      <Typography
        variant="h2"
        sx={{
          ...FONT,
          fontSize: "75px",
          color: "black",
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
