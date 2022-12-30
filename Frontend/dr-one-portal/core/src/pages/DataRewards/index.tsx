import { useState, useEffect } from "react";
import Parcel from "single-spa-react/parcel";

import { useAuth } from "../../hooks/auth";

function DataRewardsList() {
  const { user } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  if (dimensions.width < 1000) {
    document.body.classList.add('metismenu-navbar');
  } else {
    if (!document.body.classList.contains('metismenu-navbar')) {
      document.body.classList.remove('metismenu-navbar');
    }
  }

  return (
    <div>
      {/* <Parcel config={() => System.import("angular-app")} /> */}
      <Parcel
        config={() => System.import("@dr-one/data-rewards")}
        user={user}
        handleError={(err) => err && setHasError(true)}
      />
      {hasError && (
        <h1>
          Ops error to start this project. Please Reload this page or try again
          later
        </h1>
      )}
    </div>
  );
}

export default DataRewardsList;
