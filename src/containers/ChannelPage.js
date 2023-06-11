import React, { Component, useContext } from "react";
import { Helmet } from "react-helmet";
import PrivateChannel from "../components/Channel/PrivateChannel";
import PublicChannel from "../components/Channel/PublicChannel";

import { AuthContext } from "../Auth/authContext";

export default function ChannelPage() {
  const userId = window.location.pathname.split("/")[2];

  const { user } = useContext(AuthContext);
  const userLogId = user.currentUser.id

  console.log(user);
  return (
    <div>
      {userId == userLogId ? (
        <PrivateChannel userId={userId} />
      ) : (
        <PublicChannel />
      )}
    </div>
  );
}
