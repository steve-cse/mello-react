import React from "react";
import errorLogo from "../assets/404.png";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import "./FourOhFour.css";
function FourOhFour() {
  return (
    <>
      <CssBaseline />
      <Paper elevation={1} sx={{ height: "100vh" }}>
        <br />
        <div className="FourOhFour">
          <img src={errorLogo} alt="Error Image" />

          <div className="displaypara">
            <p>Great shot, kid. That was one in a million.</p>
            <p>
              Let's get you{" "}
              <a style={{ color: "inherit" }} href="/">
                back
              </a>
            </p>
          </div>
        </div>
      </Paper>
    </>
  );
}

export default FourOhFour;
