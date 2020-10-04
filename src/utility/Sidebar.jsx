import React from "react";

import {
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import { MyContext } from "../context";
import { Link } from "react-router-dom";

function Sidebar({ logout }) {
  const [open, setState] = React.useState(false);
  const { user } = React.useContext(MyContext);

  const toggleDrawer = (state) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(state);
  };

  const list = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className="sidebar"
    >
      <List>
        <Link className="nav-link" to={`/Profile/${user.username}`}>
          <ListItem button>
            <ListItemIcon>
              <Avatar src={!user.profile ? "" : user.profile.avatar}>
                {user.username && user.username.toUpperCase()[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary="Your Profile" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon style={{ padding: "0" }} />
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </div>
  );
}

export default Sidebar;
