import React, { useEffect } from "react";
import LandingImage from "../assets/images/landing_image.jpg";
import history from "../utils/history";
export default function LandingPage() {
  useEffect(() => {
    setTimeout(() => {
      history.push("/add-product");
    }, 5000);
  }, []);
  return (
    <div>
      <img src={LandingImage} style={{ width: "100%", height: "100vh" }}></img>
    </div>
  );
}
