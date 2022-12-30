import { useEffect, useState } from "react";

const ChangingProgressProvider = (props: any) => {
  const [valuesIndex, setValuesIndex] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setValuesIndex((valuesIndex + 1) % props.values.length)
    }, 500)
  }, [])
  return props.children(props.values[valuesIndex]);
}

export default ChangingProgressProvider;
