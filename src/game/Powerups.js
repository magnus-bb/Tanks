function Ammo(owner, name) {
	owner.ammo++

	return {
		owner,
		name
	}
}


//* COMPOSITIONAL MIXINS

const mixins = {

}

//* LOOKUP DICTIONARY

export default {
	Ammo,
}