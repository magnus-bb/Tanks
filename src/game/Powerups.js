function Ammo(owner, name) {
	owner.ammo++

	return {
		owner,
		name
	}
}


//* LOOKUP DICTIONARY

export default Powerup = {
	Ammo,


	//* COMPOSITIONAL MIXINS

	mixins: {

	}
}