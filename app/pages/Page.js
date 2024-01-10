import React, { useEffect, useState } from "react";
import Container from "./Container";
import HomePage from "./LoginPage";
import HomeGuest from "./HomeGuest";
import { Link } from "react-router-dom";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | ComplexApp`;
    window.scrollTo(0, 0);
  }, []);

  return <Container wide={props.wide}>{props.children}</Container>;
}

export default Page;
