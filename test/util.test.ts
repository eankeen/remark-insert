import { nodeMatchesUserSpecifiedHeading, nextNodeIsEnd } from '../src/util'

describe('nodeMatchesUserSpecifiedHeading', () => {
	const d = (value: string) => ({
		children: [
			{
				type: 'heading',
				children: [{ value }],
			},
		],
	})

	const i = 0

	const opts = {
		headingText: 'User Specified Heading',
		headingDepth: 200000,
		insertionAst: {},
	}

	test('does matach', () => {
		const ast = d('User Specified Heading')

		expect(nodeMatchesUserSpecifiedHeading(ast, i, opts)).toBe(true)
	})

	test('does not match', () => {
		const ast = d('any other string')

		expect(nodeMatchesUserSpecifiedHeading(ast, i, opts)).toBe(false)
	})
})

describe('nextNodeIsEnd', () => {
	const d = (depth: number) => ({
		children: [
			{
				type: 'heading',
				depth,
				children: [],
			},
		],
	})

	// so we get the 0th element of ast.children
	const i = -1

	const opts = {
		headingText: "doesn't matter",
		headingDepth: 2,
		insertionAst: {},
	}

	test('test nextNodeIsEnd same heading depth', () => {
		const ast = d(2)

		expect(nextNodeIsEnd(ast, i, opts)).toBe(true)
	})

	test('test nextNodeIsEnd higher heading depth', () => {
		const ast = d(3)

		expect(nextNodeIsEnd(ast, i, opts)).toBe(false)
	})

	test('test nextNodeIsEnd lower heading depth', () => {
		const ast = d(1)

		expect(nextNodeIsEnd(ast, i, opts)).toBe(true)
	})

	test('test nextNodeIsEnd at program end', () => {
		const ast = {
			children: [],
		}

		expect(nextNodeIsEnd(ast, i, opts)).toBe(true)
	})
})
