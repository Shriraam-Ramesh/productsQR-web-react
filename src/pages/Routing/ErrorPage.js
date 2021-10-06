import React from "react";
import { Link } from "react-router-dom";
import "../../Css/notFound.css";

export default function ErrorPage() {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
        </div>
        <h2>404 - Page not found</h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <Link to="/" style={{ backgroundColor: "#03ebe0", color: "black" }}>
          Go To Homepage
        </Link>
      </div>
    </div>
  );
}
