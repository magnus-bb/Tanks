function Ammo(owner, name) {
	owner.ammo++

	return {
		owner,
		name
	}
}


//* LOOKUP DICTIONARY

const Powerup = {
	Ammo,


	//* COMPOSITIONAL MIXINS

	mixins: {

	}
}