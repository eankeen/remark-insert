export interface IRemarkInsert {
	headingText: string
	headingDepth: number
	insertionAst: Record<string, any>
}

export default function remarkInsert(opts: IRemarkInsert) {
	return function transformer(ast: any, file: any) {
		const licenseHeading = {
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
			const node = ast.children[i]
			// if the first element is not a heading, add it
			if (
				ast.children[i].type === 'heading' &&
				ast.children[i].children[0].value === opts.headingText
			) {
				ast.children[i + 1] = opts.insertionAst
				return
			}
		}

		ast.children.push(licenseHeading)
		ast.children.push(opts.insertionAst)
	}
}
