<template>
  <div id="phaser-game"></div>
</template>

<script lang="ts">
import Phaser from 'phaser'

import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'PhaserGame',

  setup() {
    onMounted(() => {
      const config = {
        type: Phaser.AUTO,

        width: window.innerWidth, // Ukuran awal sesuai layer

        height: window.innerHeight, // Ukuran awal sesuai layer

        scale: {
          mode: Phaser.Scale.RESIZE, // Canvas otomatis mengikuti ukuran layer

          autoCenter: Phaser.Scale.CENTER_BOTH, // Canvas selalu di tengah
        },

        scene: {
          preload,

          create,
        },
      }

      const game = new Phaser.Game(config)

      function preload(this: Phaser.Scene) {
        this.load.image('sprite', 'images/BGStage1.png') // Pastikan jalur benar
      }

      function create(this: Phaser.Scene) {
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'sprite') // Tambahkan gambar

        if (bg) {
          bg.setDisplaySize(this.scale.width, this.scale.height) // Sesuaikan gambar dengan canvas
        }
      }

      // Responsif saat browser di-resize

      window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight) // Perbarui ukuran canvas

        // game.scene.getScene('default').resize(); // Perbarui ukuran gambar
      })
    })
  },
})
</script>

<style scoped>
#phaser-game {
  width: 100%;

  height: 100%;
}
</style>
