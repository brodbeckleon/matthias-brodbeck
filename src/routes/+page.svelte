<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<div class="home">
	<img
		src="https://musikschule-muenchenstein.ch/images/personen/lehrpersonen/matthias_brodbeck_schlagzeug.jpg"
		alt={m.mattias_brodbeck()}
	/>

	<div class="cv_content">
		<h3>{m.biography()}</h3>
		<p>{m.cv_1()}</p>
		<p>{m.cv_2()}</p>
		<p>{m.cv_3()}</p>
		<p>{m.cv_4()}</p>
		<p>{m.cv_5()}</p>
	</div>
</div>

<style lang="css">
	.home {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20px;
		gap: 20px;
	}

	.cv_content {
		flex: 1;
	}

	img {
		max-width: 200px;
		height: auto;
		border-radius: 10px;
	}
</style>
