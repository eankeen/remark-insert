import remark from 'remark'
import remarkInsert, { IRemarkInsert } from '../src/index'

function doRemark(input: string, options: IRemarkInsert): Promise<any> {
	return remark()
		.use(remarkInsert, options)
		.process(input)
		.catch((err) => {
			console.error(err)
		})
}

describe("works with 'replaceAllSubContent' set to false", () => {
	test('it works on empty file', async () => {
		const input = ''
		const output = `## License

Licensed under Apache-2.0
`

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
		const output = `## License

Licensed under MIT
`

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
		const input = `## Boop

some text here
`
		const output = `## Boop

Beep
`

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
		const output = `# Heading

## Boop

Beep
`

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

	test('it works with a separate heading not specified', async () => {
		const input = `# Heading

## Nest

#### Subnest`
		const output = `# Heading

## Nest

#### Subnest

##### Boop

Beep
`

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 5,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with a separate heading specified', async () => {
		const input = `# Heading

## Nest

#### Subnest

##### Boop

## Misc`
		const output = `# Heading

## Nest

#### Subnest

##### Boop

Beep

## Misc
`

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 5,
			insertionAst: {
				type: 'text',
				value: 'Beep',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with a separate heading and itself', async () => {
		const input = `# Heading
## Boop

Some text here`
		const output = `# Heading

## Boop

Beep
`

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
		const input = `# Heading
## Boop

## Conclusion`
		const output = `# Heading

## Boop

Beep

## Conclusion
`

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
		const input = `# Heading
### Boop

Some text here`
		const output = `# Heading

### Boop

Beep
`

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

	test('it works with code blocks', async () => {
		const input = `# Heading
### Boop

\`\`\`js
let a = 300
\`\`\`
`

		const output = `# Heading

### Boop

\`\`\`js
let a = 4
\`\`\`
`

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 3,
			insertionAst: {
				type: 'code',
				lang: 'js',
				value: 'let a = 4',
			},
		})

		expect(vfile.contents).toBe(output)
	})
})

describe("works with 'replaceAllSubContent' set to true", () => {
	test('it works with multiple sub-sub-headings', async () => {
		const input = `# Heading
### Boop

#### Foo
#### Bar
##### Others`
		const output = `# Heading

### Boop

\`\`\`js
let a = 4
\`\`\`
`

		const vfile = await doRemark(input, {
			headingText: 'Boop',
			headingDepth: 3,
			insertionAst: {
				type: 'code',
				lang: 'js',
				value: 'let a = 4',
			},
		})

		expect(vfile.contents).toBe(output)
	})

	test('it works with multiple sub-sub-headings and an actual ending', async () => {
		const input = `# Heading
### One

#### Alfa
#### Bravo
##### Charlie
### Two`
		const output = `# Heading

### One

\`\`\`js
let a = 4
\`\`\`

### Two
`

		const vfile = await doRemark(input, {
			headingText: 'One',
			headingDepth: 3,
			insertionAst: {
				type: 'code',
				lang: 'js',
				value: 'let a = 4',
			},
		})

		expect(vfile.contents).toBe(output)
	})
})
