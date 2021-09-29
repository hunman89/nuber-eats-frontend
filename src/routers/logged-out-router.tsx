import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedOutRouter = () => {
  const onCLick = () => {
    isLoggedInVar(true);
  };

  return (
    <div>
      <h1>Logged Out</h1>
      <button onClick={onCLick}>Click to login</button>
    </div>
  );
};
