import React from "react";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";

const App = () => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "demo",
    },
  });
};
const myImage = cld.image("docs/models");

myImage.resize(fill().width(250).height(250));

return (
  <div>
    <AdvancedImage cldImg={myImage} />
  </div>
);
