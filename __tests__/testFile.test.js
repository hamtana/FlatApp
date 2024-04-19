const sum = require('../testFile');

test('adds 1 + 3 to equal 3', () => {
	expect(sum(1,2)).toBe(3);
})