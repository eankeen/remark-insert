import remark from 'remark'
import remarkInsert from '../src'

test('single use', () => {
	const path = 'file.md'
	const contents = ''
	const expectedContents = `## Information

Here is some information about x
`

	remark()
		.use(remarkInsert, {
			headingText: 'Information',
			headingDepth: 2,
			insertionText: `Here is some information about x`,
		})
		.process({ path, contents })
		.then((vfile) => {
			expect(vfile.contents).toBe(expectedContents)
		})
		.catch((err: unknown) => {
			console.error(err)
		})
})

test('double use use', () => {
	const path = 'file.md'
	const contents = ''
	const expectedContents = `## Information

Here is some information about x

## Summary

This is a summary
`

	return remark()
		.use(remarkInsert, {
			headingText: 'Information',
			headingDepth: 2,
			insertionText: `Here is some information about x`,
		})
		.use(remarkInsert, {
			headingText: 'Summary',
			headingDepth: 2,
			insertionText: 'This is a summary',
		})
		.process({ path, contents })
		.then((vfile) => {
			console.info(vfile.contents)
			expect(vfile.contents).toBe(expectedContents)
		})
})
