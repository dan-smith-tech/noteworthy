import type { NextRequest } from "next/server";

import fs from "fs";
import path from "path";

import {
	convertMarkdownToNestedDoc,
	convertNestedDocToMarkdown,
} from "@/utils/parse";

export async function POST(request: NextRequest) {
	const { storeLocation, fileName } = await request.json();

	const filePath = decodeURI(path.join(storeLocation, fileName));

	const fileContent = fs.readFileSync(filePath, "utf8");

	const docStructure = convertMarkdownToNestedDoc(fileContent);

	const doc = {
		title: fileName.replace(/\.[^/.]+$/, ""),
		docStructure,
	};

	return new Response(JSON.stringify({ doc }));
}

export async function PUT(request: NextRequest) {
	const { storeLocation, fileName, docStructure } = await request.json();

	const filePath = decodeURI(path.join(storeLocation, fileName));

	const fileContent = convertNestedDocToMarkdown(docStructure);

	fs.writeFileSync(filePath, fileContent);

	return new Response(JSON.stringify({}));
}