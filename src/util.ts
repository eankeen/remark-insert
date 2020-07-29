import { IRemarkInsert } from './'

export function nodeMatchesUserSpecifiedHeading(
	ast: Record<string, any>,
	i: number,
	opts: IRemarkInsert
): boolean {
	if (
		ast.children[i]?.type === 'heading' &&
		ast.children[i]?.children[0].value === opts.headingText
	) {
		return true
	}
	return false
}

export function nextNodeIsEnd(
	ast: Record<string, any>,
	i: number,
	opts: IRemarkInsert
): boolean {
	// if the next element does not exist, we are
	// at the last heading
	if (!ast.children[i + 1]) {
		return true
	}

	if (
		ast.children[i + 1].type === 'heading' &&
		ast.children[i + 1].depth <= opts.headingDepth
	) {
		return true
	}

	return false
}
