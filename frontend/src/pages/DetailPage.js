import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { productApi } from "../utils/django.js";
import { UseUserDetails } from "../context/UserContext";
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';


const DetailPage = () => {
  const queryClient = useQueryClient();
  const [userDetails] = UseUserDetails();
  const TOKEN = userDetails.key;
  const api = productApi(TOKEN)
  const { id } = useParams();
  const [link, setLink] = useState('')
  const [comment, setComment] = useState('')

  const { mutate: editDetail } = useMutation(
    async (payload) => {
      return await api.patch(`http://localhost:3000/api/product/products/${id}/`, payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product"]);
      },
    }
  );

  const submitHandler = async (e) => {
    e.preventDefault()
    let payload = {}
    if (!comment) {
      payload = { link: link }
    } else if (!link) {
      payload = { detail: comment }
    } else {
      payload = { link: link, detail: comment }
    }
    await editDetail(payload)
    setComment("")
    setLink("")
  }

  const linkDeleteHandler = async (e) => {
    const payload = { link: "" }
    await editDetail(payload)
  }

  const commentDeleteHandler = async (e) => {
    const payload = { detail: "" }
    await editDetail(payload)
  }

  const { isLoading, isError, data, error } = useQuery(
    ["product"],
    async () => {
      const { data } = await api.get(`http://localhost:3000/api/product/products/${id}`);
      console.log(data)
      return data
    }
  );

  // console.log(detail)

  return (
    <div className="mx-5 mt-3">
      <div>
        {isLoading ? (
          <div>Now loading....</div>
        ) :
          (
            <>
              <Link
                to={"/"}
                className=" text-blue-700 hover:underline"
              >
                ＜戻る
              </Link>
              <div className='my-3'/>
              <div className="grid grid-cols-9">
                <div className="col-span-3">
                  <img
                    src={data.image}
                    className="w-auto h-auto rounded-lg"
                  />
                </div>
                <div className="col-span-6 col-start-4 mx-5">
                  <div className="w-auto font-bold text-lg text-clip">
                    {data.name}
                  </div>
                  <div className="lg:my-10 sm:my-3" />
                  <div className="grid grid-cols-8">
                    <div className="lg:col-span-1 md:col-span-2 sm:col-span-3 xs:col-span-4">
                      {data.market} :
                    </div>
                    <div className="md:col-6 sm:col-span-5 xs:col-span-4">
                      {data.current_price} 円
                    </div>
                  </div>
                  <div className="lg:my-10 sm:my-3" />
                  <div className="grid grid-cols-8">
                    <div className="lg:col-span-1 md:col-span-2 sm:col-span-3 xs:col-span-4">
                      ebay :
                    </div>
                    <div className="md:col-6 sm:col-span-5 xs:col-span-4">
                      {data.link}
                    </div>
                  </div>
                  <div className="lg:my-10 sm:my-3" />
                  <div className="grid grid-cols-8">
                    <div className="lg:col-span-1 md:col-span-2 sm:col-span-3 xs:col-span-4">
                      コメント :
                    </div>
                    <div className="md:col-6 sm:col-span-5 xs:col-span-4">
                      {data.detail}
                    </div>
                  </div>
                  <div className="lg:my-10 sm:my-3" />
                  <form>
                    <div className="">
                      <label className="block text-sm text-gray-600">ebayのリンクを追加／編集</label>
                      <InputField
                        type="url"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                      />
                      <div className="lg:my-3 sm:my-3" />
                      <div>
                        <label className="block text-sm text-gray-600">コメントの追加／編集</label>
                        <textarea
                          rows="4"
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border focus:border-indigo-400 focus:border-2"
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="lg:my-5 sm:my-3" />
                    <div className="grid grid-cols-4">
                      <div className="col-span-2 mx-2">
                        <Button
                          className="w-full mt-1 py-2 text-sm"
                          title="追加／編集内容　送信"
                          disabled={!comment && !link}
                          onClick={submitHandler}
                        />
                      </div>
                      <div className="col-span-1 mx-2">
                        <Button
                          className="w-full  mt-1 py-2 text-sm bg-orange-500 hover:bg-orange-600"
                          title="ebayリンク 削除"
                          onClick={linkDeleteHandler}
                        />
                      </div>
                      <div className="col-span-1 mx-2">
                        <Button
                          className="w-full  mt-1 py-2 text-sm  bg-orange-500  hover:bg-orange-600"
                          title="コメント 削除"
                          onClick={commentDeleteHandler}
                        />
                      </div>
                    </div>

                  </form>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
export default DetailPage;