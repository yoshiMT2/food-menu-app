import React, { useState, useEffect } from "react";
import Button from "./Button";
import Checkbox from "./Checkbox.tsx";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getFilteredRowModel,
} from "@tanstack/react-table";
import Dropdown from "./Dropdown.tsx";

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
		header: ({ table }) => (
			<Checkbox
				{...{
					checked: table.getIsAllRowsSelected(),
					indeterminate: table.getIsSomeRowsSelected(),
					onChange: table.getToggleAllRowsSelectedHandler(),
				}}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				{...{
					checked: row.getIsSelected(),
					indeterminate: row.getIsSomeSelected(),
					onChange: row.getToggleSelectedHandler(),
				}}
			/>
		),
	}),
	columnHelper.accessor("has_stock", {
		accessorKey: "stock",
		id: "stock",
		header: ({ header, table }) => (
			<Dropdown column={header.column} table={table} />
		),
		cell: (info) => (info.getValue() === true ? "" : "無し"),
	}),
	columnHelper.accessor("market", {
		id: "market",
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

const ProductList: Product[] = ({ data, getSelectedRow }) => {
	const [rowSelection, setRowSelection] = useState({});
	// const [globalFilter, setGlobalFilter] = useState('')

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
		},
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		debugTable: true,
	});

	useEffect(() => {
    getSelectedRow(rowSelection)
	}, [rowSelection, setRowSelection]);

	return (
		<div className="flex flex-col my-3">
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
												className="px-2 py-1 text-sm text-gray-700"
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
