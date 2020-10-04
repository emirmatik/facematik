import React from "react";
import { Grid } from "@material-ui/core";
import Navbar from "../utility/Navbar";
import Posts from "../utility/Posts";
import { MyContext } from "../context"
import LoadingPage from "./LoadingPage"

function Home() {
  const { user } = React.useContext(MyContext);

  return (
    <>
      {!user ? <LoadingPage /> : (<Grid>
        <Navbar />
        <Posts />
      </Grid>)
      }
    </>
  );

}

export default Home;
