import Pickup from './Pickups.js'

import store from '@/store'
const { p5 } = store.state

export default function preload() {
	// Runs through all types of pickups in Pickup.pickups, loads their asset, and saves it in the assets-object:
	for (const type of Object.values(Pickup.pickups)) {
		type.forEach(pickup => {

			store.commit('setPickupAsset', {
				name: pickup,
				asset: p5.loadImage(`assets/pickups/${pickup}.svg`)
			})
		})
	}
}

	// // // Runs through all types of projectiles and saves them in the assets-object:
	// // for (const projectile of Projectile.types) {
	// // 	assets.projectiles[projectile] = loadImage(`assets/projectiles/${projectile}.svg`)
	// // }

	// // //! Until fcking tint() works:
	// // for (const projectile of Projectile.types) {
	// // 	assets.stealthProjectiles[projectile] = loadImage(`assets/projectiles/${projectile}-stealthed.svg`)
	// // }



	// // Runs through all effects and saves them in the assets-object:
	// // for (const effect of FX.fx) {
	// // 	assets.fx[effect] = loadImage(`assets/fx/${effect}.svg`)
	// // }