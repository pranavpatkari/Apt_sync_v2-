import { useEffect, useState } from "react";
import "../styles/slider.css";

import image1 from "../assets/slider/image1.jpg";
import image2 from "../assets/slider/image2.jpg";
import image3 from "../assets/slider/image3.jpg";

const images = [image1, image2, image3];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="slider">
      {images.map((img, i) => (
        <div
          key={i}
          className={`slide ${i === index ? "active" : ""}`}
        >
          <img src={img} alt="" />
        </div>
      ))}
    </div>
  );
}
