import Heading from "@/components/nodes/Heading";
import Idea from "@/components/nodes/Idea";
import IdeaContainer from "@/components/nodes/IdeaContainer";
import Paragraph from "@/components/nodes/Paragraph";
import { Editor, Node, Range, Transforms } from "slate";
import { areEquivalent } from "./helpers";
import { useCallback } from "react";
import Leaf from "@/components/nodes/Leaf";

const renderElement = (
	{
		attributes,
		children,
		element,
	}: {
		attributes: any;
		children: any;
		element: any;
	},
	editor: Editor,
	mode: string
) => {
	switch (
		element.type // Changed 'node.type' to 'element.type'
	) {
		case "text":
			return <span {...attributes}>{children}</span>;
		case "idea-container":
			return (
				<IdeaContainer
					{...attributes}
					editor={editor}
					node={element}
					mode={mode}
				>
					{children}
				</IdeaContainer>
			);
		case "idea":
			return (
				<Idea {...attributes} editor={editor} node={element} mode={mode}>
					{children}
				</Idea>
			);
		case "paragraph":
			return (
				<Paragraph
					{...attributes}
					editor={editor}
					node={element}
					mode={mode}
				>
					{children}
				</Paragraph>
			);
		case "heading":
			return (
				<Heading {...attributes} editor={editor} node={element} mode={mode}>
					{children}
				</Heading>
			);
		default:
			return null;
	}
};

const renderLeaf = (props: any) => {
	return <Leaf {...props} />;
};

const onType = (e: React.KeyboardEvent, editor: Editor) => {
	switch (e.key) {
		case "Enter": {
			e.preventDefault();

			const selection = editor.selection;
			if (selection) {
				const topLevelNode = selection.anchor.path[0];

				const newItem = {
					type: "paragraph",
					children: [
						{
							type: "text",
							children: [{ text: "" }],
						},
					],
				};

				// Insert the new sub-item node at the end of the container's children
				// TODO: make type more robust
				Transforms.insertNodes(editor, newItem as unknown as Node, {
					at: [topLevelNode + 1],
				});

				Transforms.select(editor, [topLevelNode + 1]);
			}

			break;
		}
	}

	if (e.ctrlKey) {
		switch (e.key) {
			case "b": {
				e.preventDefault();
				CustomEditor.toggleBoldMark(editor);
				break;
			}
			case "i": {
				e.preventDefault();
				CustomEditor.toggleItalicMark(editor);
				console.log(editor.children);
				break;
			}
		}
	}
};

const CustomEditor = {
	toggleNodeType(
		nodeType: string,
		editor: Editor,
		path?: number[],
		options?: any
	) {
		var actualPath: number[] = [];
		if (typeof path !== "undefined") actualPath = path;
		else {
			const currentSelection = editor.selection;
			if (currentSelection) {
				const [start] = Range.edges(currentSelection);
				actualPath = [start.path[0]];
			}
		}

		if (actualPath) {
			const node = Editor.node(editor, actualPath)[0];
			const currNodeOptions: any = { ...node };
			delete currNodeOptions["children"];
			const nodeToCompare = Object.assign(options, { type: nodeType });
			const isActive: boolean = areEquivalent(
				currNodeOptions,
				nodeToCompare
			);

			if (isActive) {
				Transforms.setNodes(editor, Object.assign({ type: "paragraph" }), {
					at: actualPath,
				});
			} else {
				Transforms.setNodes(
					editor,
					Object.assign({ type: nodeType }, options),
					{ at: actualPath }
				);
			}
		}
	},
	isBoldMarkActive(editor: Editor) {
		const marks = Editor.marks(editor);
		return marks ? marks.bold === true : false;
	},
	toggleBoldMark(editor: Editor) {
		const isActive = CustomEditor.isBoldMarkActive(editor);
		if (isActive) {
			Editor.removeMark(editor, "bold");
		} else {
			Editor.addMark(editor, "bold", true);
		}
	},
	isItalicMarkActive(editor: Editor) {
		const marks = Editor.marks(editor);
		return marks ? marks.italic === true : false;
	},
	toggleItalicMark(editor: Editor) {
		const isActive = CustomEditor.isItalicMarkActive(editor);
		if (isActive) {
			Editor.removeMark(editor, "italic");
		} else {
			Editor.addMark(editor, "italic", true);
		}
	},
};

export { renderElement, renderLeaf, onType, CustomEditor };
