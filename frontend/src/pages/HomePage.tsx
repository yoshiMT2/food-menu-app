import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { UseUserDetails } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Modal from "../components/Modal.tsx";
import useUrlValidation from "../hooks/useUrlValidation";
import { productApi, bulkDelete } from "../utils/django.js";
import ProductList from "../components/ProductLists.tsx";
import { BACKEND_URL } from '../utils/urls.js';

function HomePage() {
	const [userDetails] = UseUserDetails();
	const [responseData, setResponseData] = useState();
	const [selectedRow, setSelectedRow] = useState([]);
	const [selectedIds, setSelectedIds] = useState([]);
  const [isReset, setIsReset] = useState(false)
	const [showModal, setShowModal] = useState(false);
	const [url, setUrl] = useState("");
	const [isValidUrl] = useUrlValidation(url);
	const TOKEN = userDetails.key;
	const queryClient = useQueryClient();

	const api = productApi(TOKEN);

	const { isLoading, isError, data, error } = useQuery(
		["products"],
		async () => {
			const res = await api.get(BACKEND_URL + "api/product/products/");
			setResponseData(res.data);
			return res.data;
		}
	);

	const {mutate: createProduct }= useMutation(
		async () => {
			return await api.post(BACKEND_URL + "api/product/products/", { url });
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["products"]);
			},
		}
	);

	const { mutate: deleteProducts } = useMutation(
		async () => {
			return await bulkDelete(TOKEN, JSON.stringify(selectedIds));
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["products"]);
			},
		},
	);

	function onDeleteClickHandler(e) {
		e.preventDefault();
		setShowModal(true);
	}

	async function onConfirm(e) {
		e.preventDefault();
		await deleteProducts();
		setShowModal(false);
    setIsReset(true)
	}

	function onCancel(e) {
		e.preventDefault();
		setShowModal(false);
	}

	const submitHandler = async(e) => {
		e.preventDefault();
		if (isValidUrl) {
			await createProduct();
			setUrl("");
		} else {
			console.log("Invalid");
		}
	};

  useEffect(()=>{
		const ids = selectedRow.map((row) => responseData[row]["id"]);
		setSelectedIds([...ids]);
    setIsReset(false)
  },[showModal])

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
			{Object.keys(selectedRow).length > 0 ? (
				<div className="pl-2 sm:pl-10 lg:pl-14">
					<Button
						className="mx-1 px-3 md: bg-red-600 hover:bg-red-500 py-1 text-xs"
						title="削除"
						onClick={onDeleteClickHandler}
					/>
				</div>
			) : null}
			{isLoading ? (
				<p>Loading</p>
			) : (
				<ProductList data={data} getSelectedRow={setSelectedRow} isReset={isReset} />
			)}
			{showModal ? (
				<>
					<Modal
						title="アイテムの削除"
						msg="選択したアイテムを本当に削除しますか？"
						confirmBtn="削除する"
						cancelBtn="キャンセル"
						onConfirm={onConfirm}
						onCancel={onCancel}
					/>
				</>
			) : null}
		</div>
	);
}
export default HomePage;

