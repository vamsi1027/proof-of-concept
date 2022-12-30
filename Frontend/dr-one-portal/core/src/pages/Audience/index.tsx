import { useState } from "react";
import Parcel from "single-spa-react/parcel";
import { useAuth } from "../../hooks/auth";

const Audience = () => {
  const { user } = useAuth();
  const [hasError, setHasError] = useState(false);
  return (
    <>
      <Parcel
        config={() => System.import("@dr-one/audience")}
        handleError={(err) => err && setHasError(true)}
        {...user}
      />
      {hasError && (
        <h1>
          Ops error to start this project Please Reload this page or try again
          later
        </h1>
      )}
    </>
  );
};

export default Audience;