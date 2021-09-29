import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  const onClick = () => {
    isLoggedInVar(false);
  };
  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={onClick}>CLick to logout</button>
    </div>
  );
};
