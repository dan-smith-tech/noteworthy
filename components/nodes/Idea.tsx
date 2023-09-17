import React from "react";

import { Editor, Node, Path, Transforms } from "slate";

import styles from "./Idea.module.css";
import { ReactEditor } from "slate-react";

const Idea = (props: any) => {
	const { editor, node } = props;

	const getParentIndex = () => ReactEditor.findPath(editor, node)[0];
	const getPath = () => ReactEditor.findPath(editor, node);

	const getNewNode = () => {
		return {
			type: "paragraph",
			children: [
				{
					type: "text",
					children: [{ text: Node.string(node) }],
				},
			],
		};
	};

	const prepend = () => {
		remove();

		Transforms.insertNodes(editor, getNewNode(), { at: [getParentIndex()] });
	};

	const append = () => {
		remove();

		Transforms.insertNodes(editor, getNewNode(), {
			at: [getParentIndex() + 1],
		});
	};

	const replace = () => {
		remove();

		const content = Node.string(node);
		const path = [getParentIndex(), 0, 0];

		Transforms.delete(editor, { at: path });
		Transforms.insertText(editor, content, { at: path });
	};

	const insert = () => {
		remove();

		const content = Node.string(
			Editor.node(editor, [getParentIndex(), 0])[0]
		).concat(" ", Node.string(node));
		const path = [getParentIndex(), 0, 0];

		Transforms.delete(editor, { at: path });
		Transforms.insertText(editor, content, { at: path });
	};

	const remove = () => {
		const ideaContainer = Editor.node(editor, [getParentIndex(), 1])[0];
		const empty = ideaContainer.children.length == 1;

		if (empty) Transforms.delete(editor, { at: [getParentIndex(), 1] });
		else Transforms.delete(editor, { at: getPath() });
	};

	return (
		<div className={styles.container}>
			<div className={styles.containerButtons}>
				<button>Retry</button>
				<button>Retry with edits</button>
				<button onClick={prepend}>Prepend</button>
				<button onClick={replace}>Replace</button>
				<button onClick={insert}>Insert</button>
				<button onClick={append}>Append</button>
				<button onClick={remove}>Remove</button>
			</div>
			<div
				className={styles.element}
				key={props.key}
			>
				{props.children}
			</div>
		</div>
	);
};

export default Idea;