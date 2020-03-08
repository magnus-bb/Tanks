function Ammo(owner, name) {
	owner.ammo++

	return {
		owner,
		name
	}
}

function ShrinkRay(owner, name) {
	if (owner.d > 10) {
		owner.d -= 2
	}

	return {
		owner,
		name
	}
}


// //* COMPOSITIONAL MIXINS

// const mixins = {

// }

//* LOOKUP DICTIONARY

export default {
	Ammo,
	ShrinkRay
}