//TODO: use() equipment should take care of removing itself when done and creating instances of potential projectiles etc

class Placeholder {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}

	use() {
		console.log(this.name + " used by: " + this.owner.name)


		// Last step:
		this.owner.equipment = null
	}
}

// Goes after all the classes:
const equipment = {
	//TODO: Skriv våben herind til at konvertere fra string til class, e.g: equippables['Railgun'](constructorArgs)
	// Weapon1,
	// Weapon2,
	Placeholder
}