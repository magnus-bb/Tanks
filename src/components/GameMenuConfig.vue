<template>
  <div class="config-menu">

    <!-- Reactivity template: -->
		<p>Reactivity Test:</p>
    <input v-model="bulletSpeed" type="number" />

    {{ bulletSpeed }}
  </div>
</template>

<script>
export default {
	name: 'GameMenuConfig',
	computed: {




		//! Reactivity template:
		// Only needed here (both get and set) for shortening the inline v-model:
		// Inline does not need a computed value, and can reference $store.state... etc. directly
		// while maintaining reactivity
		bulletSpeed: {
			get() {
				return this.$store.state.config.projectile.bullet.speed
			},
			set(val) {
				this.$store.state.config.projectile.bullet.speed = Number(val)
			},
		},
	},
}
</script>

<style lang="scss" scoped>
.config-menu {
	background: blue;
	// position: absolute;
}
</style>