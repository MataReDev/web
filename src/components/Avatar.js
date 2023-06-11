import React from 'react';

const Avatar = ({ username, style }) => {
  const initials = `${username?.charAt(0)}`;
  const avatarStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "100%",
    backgroundColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
    ...style,
    
  };

  return <div style={avatarStyle}>{initials}</div>;
};

export default Avatar;
