import React, { Component, useContext } from "react";
import { Helmet } from "react-helmet";
import PrivateChannel from "../components/Channel/PrivateChannel";
import PublicChannel from "../components/Channel/PublicChannel";

import { AuthContext } from "../Auth/authContext";

export default function ChannelPage() {
  const channelName = window.location.pathname.split("/")[2];

  const { user } = useContext(AuthContext);

  console.log(user);
  return (
    <div>
      {channelName === user.currentUser?.username ? (
        <PrivateChannel username={channelName} />
      ) : (
        <PublicChannel username={channelName}/>
      )}
    </div>
  );
}
