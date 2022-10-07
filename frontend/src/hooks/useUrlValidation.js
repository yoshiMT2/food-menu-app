import { useState, useEffect } from "react";

const useUrlValidation = (url) => {
  const [isValidUrl, setIsValidUrl] = useState(false);

  const mercari = url.includes("mercari", 11);
  const rakuma = url.includes("item.fril", 8);
  const paypay = url.includes("paypay", 8);

  useEffect(() => {
    setIsValidUrl(mercari || rakuma || paypay);
  },[mercari, rakuma, paypay]);

  return [isValidUrl, setIsValidUrl]
};

export default useUrlValidation;
