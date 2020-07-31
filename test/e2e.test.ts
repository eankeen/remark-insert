import remark from 'remark'
import remarkInsert from '../src'

test('single use', () => {
	const path = 'file.md'
	const contents = ''
	const expectedContents = `## Information

Here is some information about x
`

	return remark()
		.use(remarkInsert, {
			insertions: [
				{
					headingText: 'Information',
					headingDepth: 2,
					insertionText: `Here is some information about x`,
				},
			],
		})
		.process({ path, contents })
		.then((vfile) => {
			expect(vfile.contents).toBe(expectedContents)
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
			insertions: [
				{
					headingText: 'Information',
					headingDepth: 2,
					insertionText: `Here is some information about x`,
				},
				{
					headingText: 'Summary',
					headingDepth: 2,
					insertionText: 'This is a summary',
				},
			],
		})
		.process({ path, contents })
		.then((vfile) => {
			expect(vfile.contents).toBe(expectedContents)
		})
})
