// SplineViewer.jsx
import { useEffect } from "react";

const SplineViewer = () => {
  useEffect(() => {
    // Dynamically load the Spline viewer script only once
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.23/build/spline-viewer.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <spline-viewer
        // className="w-full h-full"
        url="https://prod.spline.design/n5pPogRw2nHA4SIc/scene.splinecode"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      ></spline-viewer>
      <div className="px-2 py-1.5 absolute bottom-5 z-50 right-0 bg-slate-900 rounded-2xl font-extrabold text-white">
        {" "}
        made by twahanur
      </div>
    </div>
  );
};

export default SplineViewer;
