import remark from 'remark'
import { nodeMatchesUserSpecifiedHeading, nextNodeIsEnd } from './util'

interface IRemarkInsertBase {
	headingText: string
	headingDepth: number
}

export interface IRemarkInsertAst extends IRemarkInsertBase {
	insertionAst: Record<string, any>
}

export interface IRemarkInsertText extends IRemarkInsertBase {
	insertionText: string
}

export interface IRemarkInsert {
	insertions: IRemarkInsertAst[] | IRemarkInsertText[]
}

export default function remarkInsert(opts: IRemarkInsert) {
	return function transformer(ast: any, file: any) {
		for (const insertion of opts.insertions) {
			if ((insertion as IRemarkInsertText).insertionText) {
				;(insertion as IRemarkInsertAst).insertionAst = remark().parse(
					(insertion as IRemarkInsertText).insertionText
				)
			}

			const heading = {
				type: 'heading',
				depth: insertion.headingDepth,
				children: [
					{
						type: 'text',
						value: insertion.headingText,
					},
				],
			}

			for (let i = 0; i < ast.children.length; ++i) {
				// if the current node matches the same type of header
				if (nodeMatchesUserSpecifiedHeading(ast, i, insertion)) {
					// if the next node is the last node (the ending), then
					// we insert the user's content
					if (nextNodeIsEnd(ast, i, insertion)) {
						ast.children.splice(
							i + 1,
							0,
							(insertion as IRemarkInsertAst).insertionAst
						)
					}
					// the next node is removemable. let's remove it
					else {
						ast.children.splice(i + 1, 1)
						i = i - 1
						continue
					}

					return
				}
			}

			// if we are here, either `ast.children.length` is
			// zero. or the heading the user wants to replace was
			// not found
			// ast.children.push(heading)
			ast.children.splice(ast.children.length, 0, heading)
			ast.children.push((insertion as IRemarkInsertAst).insertionAst)
		}
	}
}
