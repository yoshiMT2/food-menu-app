import React from "react";
import Button from "./Button";
import Checkbox from "./Checkbox";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getTable,
} from "@tanstack/react-table";
import IndeterminateCheckbox from "./Checkbox";

type Product = {
	has_stock: boolean;
	market: string;
	image: string;
	name: string;
	current_price: number;
	url: string;
};

const columnHelper = createColumnHelper<Product>();

const columns = [
	columnHelper.display({
		id: "checkbox",
    header: (props) => (<Checkbox className="h-4 w-4 accent-indigo-50 cursor-pointer"/>),
		cell: (props) => (
			<Checkbox className="h-4 w-4 accent-indigo-50 cursor-pointer" />
		),
	}),
	columnHelper.accessor("has_stock", {
		header: () => "在庫",
		cell: (info) => (info.getValue() === true ? "" : "無し"),
	}),
	columnHelper.accessor("market", {
		header: () => "売場",
	}),
	columnHelper.accessor("name", {
		header: () => "商品名",
	}),
	columnHelper.accessor("current_price", {
		header: () => "価格",
	}),
	columnHelper.accessor("url", {
		header: () => "リンク",
		cell: (props) => (
			<a
				href={props.getValue()}
				target="_blank"
				className="text-xs font-semibold text-blue-600 hover:underline"
			>
				商品ページ
			</a>
		),
	}),
	columnHelper.display({
		id: "action",
		cell: (props) => (
			<Button
				className="mx-1 px-2 bg-orange-500  hover:bg-orange-400 py-1 text-xs"
				title="詳細"
			/>
		),
	}),
];

const ProductList: Product[] = ({ data }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col ">
      <div className="my-3 sticky top-24 max-w-full bg-white" >
            <Checkbox className="ml-14"/>
          </div>
			<div className="overflow-x-scroll overflow-y-scroll mx-2 sm:mx-4 lg:mx-6">
				<div className="pt-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
					<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-indigo-200">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												scope="col"
												className="px-2 py-1 text-gray-700"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody className="divide-y divide-gray-200">
								{table.getRowModel().rows.map((row) => (
									<tr key={row.id} className="hover:bg-gray-100">
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className="px-4 whitespace-nowrap text-center text-sm"
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="h-4" />
			</div>
		</div>
	);
};

export default ProductList;
