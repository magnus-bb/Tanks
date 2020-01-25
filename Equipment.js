//* BREAKER

function Breaker(owner, name) {
	const props = {
		owner,
		name
	}
	return {
		...props,
		...canRemoveSelf(),

		use() {
			console.log(this.name + " used by: " + this.owner.name)
	
			state.projectiles.push(new BreakerBullet(this.owner))
	
			this._remove()
		}
	}
}


//* M82

function M82(owner, name) {
	const props = {
		owner,
		name,
		ammo: config.equipment.m82.ammo
	}

	return {
		...props,
		...canRemoveSelf(),
		
		use() {
			console.log(this.name + " used by: " + this.owner.name)
	
			this.ammo--
	
			// Putting self-sufficient bullet in state with the same owner as this equip:
			state.projectiles.push(new M82Bullet(this.owner))
	
			// Last step:
			if (this.ammo <= 0) {
				this._remove()
			}
		}
	}

}


//* WORMHOLE

function Wormhole(owner, name) {
	const props = {
		owner,
		name,
		duration: config.equipment.wormhole.chargeFrames
	}

	return {
		...props,
		...canRemoveSelf(),
		
		_timer() { //TODO: Timed equipment might be common. If so - move to mixin (and maybe with onFrame()), and leave autoUse up to the class
			if (this.duration <= 0) {
				this._autoUse()
			}
	
			this.duration--
		},
	
		// Private to not make tank be able to use():
		_autoUse() { 
			console.log(this.name + " used by: " + this.owner.name)
	
			const selfIndex = state.tanks.findIndex(i => i.equipment === this)
			const otherTank = randomTank(selfIndex)
	
			otherTank && this._swap(otherTank) // Has to check for undefined since this can happen during end timer with just 1 tank (random returns undefined)
	
			this._remove()
		},
	
		// Swaps x, y, and direction with other tank:
		_swap(otherTank) {
			const temp = {
				x: this.owner.x,
				y: this.owner.y,
				direction: this.owner.direction
			}
	
			this.owner.x = otherTank.x
			this.owner.y = otherTank.y
			this.owner.direction = otherTank.direction
	
			otherTank.x = temp.x
			otherTank.y = temp.y
			otherTank.direction = temp.direction
		},
	
		onFrame() {
			this._timer()
		}
	}
}


//* COMPOSITIONAL MIXINS
function equipmentBaseProps() { //? Can be omitted if they are only dynamically constructed anyway
	return {
		
	}
}

function canRemoveSelf() {
	return {
		_remove() {
			this.owner.equipment = null
		}
	}
}

//* LOOKUP DICTIONARY

// For generically looking up constructor from a string:
const equipment = {
	Wormhole,
	M82,
	Breaker
}