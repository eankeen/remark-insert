import { nodeMatchesUserSpecifiedHeading, nextNodeIsEnd } from './util'

export interface IRemarkInsert {
	headingText: string
	headingDepth: number
	insertionAst: Record<string, any>
}

export default function remarkInsert(opts: IRemarkInsert) {
	return function transformer(ast: any, file: any) {
		const heading = {
			type: 'heading',
			depth: opts.headingDepth,
			children: [
				{
					type: 'text',
					value: opts.headingText,
				},
			],
		}

		for (let i = 0; i < ast.children.length; ++i) {
			// if the current node matches the same type of header
			if (nodeMatchesUserSpecifiedHeading(ast, i, opts)) {
				// if the next node is the last node (the ending), then
				// we insert the user's content
				if (nextNodeIsEnd(ast, i, opts)) {
					ast.children.splice(i + 1, 0, opts.insertionAst)
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
		ast.children.push(heading)
		ast.children.push(opts.insertionAst)
	}
}
