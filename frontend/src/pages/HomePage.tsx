import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { UseUserDetails } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import useUrlValidation from "../hooks/useUrlValidation";
import { productApi } from "../utils/django";
import ProductList from "../components/ProductLists.tsx";

function HomePage() {
  const [userDetails, setUserDetails] = UseUserDetails();
  const [url, setUrl] = useState("");
  const [isValidUrl] = useUrlValidation(url);
  const token = userDetails.key;
  const queryClient = useQueryClient();
  const api = productApi(token);

  const { isLoading, isError, data, error } = useQuery(['products'], async ()=> {
    const res = await api.get("api/product/products/")
    return res.data
  })

  const mutation = useMutation(async () => {
      return await api.post("api/product/products/", { url });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
      },
    }
  );

  const submitHandler = (e) => {
    e.preventDefault();
    if (isValidUrl) {
      mutation.mutate();
      setUrl("");
    } else {
      console.log("Invalid");
    }
  };

  if (!userDetails?.key) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex flex-col">
      <form
        className="px-10 py-1 grid md:grid-cols-8 grid-cols-5 bg-white drop-shadow-sm space-y-3 sticky top-10"
        onSubmit={submitHandler}
      >
        <div className="my-2 ml-6 md:col-span-7 col-span-4">
          <InputField
            className="py-1 text-sm"
            placeholder="新規URLを入力"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="col-span-1 flex justify-center">
          <Button className="w-20 mx-3 py-1 text-sm" title="登録" />
        </div>
      </form>
      {isLoading
        ? <p>Loading</p>
        : <ProductList data={data}/>
      }
    </div>
  );
}
export default HomePage;
