<template>
  <div id="app">
    <PhaserGame />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PhaserGame from './components/PhaserGame.vue';

export default defineComponent({
  name: 'App',
  components: {
    PhaserGame,
  },
});
</script>

<style scoped>
#phaser-game {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
