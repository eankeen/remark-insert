# remark-insert

Generic utility that inserts a heading and the contents after it

## Usage

```ts
import remark from 'remark'
import remarkInsert from '@fox-land/remark-insert'

remark()
	// pass in either
	.use(remarkInsert, {
		headingText: 'Information'
		headingDepth: 2,
		insertionText: `Here is some information about x`
	})
	.process({ path, contents })
	.then((vfile) => {
		console.info(vfile)
	})
	.catch((err: unknown) => {
		console.error(err)
	})
```

## License

Licensed under Apache-2.0
