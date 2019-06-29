function random_choice(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function wild_category(Category) {
	let keys = Object.keys(Category);
	keys.splice(Category.WILD, 1);
	return Category[random_choice(keys)];  
};

function choice_from_set(set) {
	return random_choice(Array.from(set));
};

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return array;
};
