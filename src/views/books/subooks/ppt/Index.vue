<template>
	<div class="frame">
		<!-- <iframe src="https://10.20.86.27:8080/netppt/" class="frame-iframe" ref="frameRef" /> -->
		<iframe src="http://192.168.0.102:8081" class="frame-iframe" ref="frameRef" />
	</div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, unref, onMounted, nextTick } from 'vue'
</script>

<style lang="less" scoped>
.frame {
	height: 100vh;

	.frame-iframe {
		height: 100vh;
		width: calc(100vw - 270px);
	}
}
</style>
