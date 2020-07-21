import remark from 'remark'
import remarkInsert, { IRemarkInsert } from '../src'

function doRemark(input: string, options: IRemarkInsert): Promise<any> {
	return remark()
		.use(remarkInsert, options)
		.process(input)
		.catch((err) => {
			console.error(err)
		})
}

describe('remark-insert', () => {
	test('it works on empty file', async () => {
		const input = ''
		const output = '## License\n\nLicensed under Apache-2.0\n'

		const vfile = await doRemark(input, {
			headingText: 'License',
			headingDepth: 2,
			insertionAst: {
				type: 'text',
				value: 'Licensed under Apache-2.0',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with only-title file ', async () => {
		const input = '## License'
		const output = '## License\n\nLicensed under MIT\n'

		const vfile = await doRemark(input, {
			headingText: 'License',
			headingDepth: 2,
			insertionAst: {
				type: 'text',
				value: 'Licensed under MIT',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with single-title and text file', async () => {
		const input = '## Boop\n\nsome text here'
		const output = '## Boop\n\nBeep\n'

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 2,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with a separate heading', async () => {
		const input = '# Heading'
		const output = '# Heading\n\n## Boop\n\nBeep\n'

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 2,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		console.log(vfile.contents)
		expect(vfile.contents).toBe(output)
	})

	test('it works with a separate heading and itself', async () => {
		const input = '# Heading\n## Boop\n\nSome text here'
		const output = '# Heading\n\n## Boop\n\nBeep\n'

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 2,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with a postfixed heading', async () => {
		const input = '# Heading\n## Boop\n\n## Conclusion'
		const output = '# Heading\n\n## Boop\n\nBeep\n\n## Conclusion\n'

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 2,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with a different heading depth', async () => {
		const input = '# Heading\n### Boop\n\nSome text here'
		const output = '# Heading\n\n### Boop\n\nBeep\n'

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 3,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		expect(vfile.contents).toBe(output)
	})
})
