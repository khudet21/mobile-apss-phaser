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
          parent: 'game',
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 200 },
          },
        },
        plugins: {
          scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }, //tambahkan SpinePlugin, tambahkan dulu SpinePlugin.min.js
          ],
        },
        scene: {
          preload,
          create,
        },
      }
      const game = new Phaser.Game(config)
      function preload() {
        this.load.image('sprite', 'images/BGStage1.png') // simpan semua aset ke dalam folder: asset dan load di sini mengikuti format berikut sesuai tipenya
        // this.load.image('nama-key', 'asset/nama-file.png');
        this.load.image('BGStage1', 'asset/BGStage1.png')
        this.load.image('PanelSoalAtas', 'asset/PanelSoalAtas.png')
        this.load.image('ButtonMenu', 'asset/ButtonMenu.png')
        this.load.image('PanelNilai', 'asset/PanelNilai.png')
        this.load.image('PanelJumlahSoal', 'asset/PanelJumlahSoal.png')
        this.load.image('ButtonNext', 'asset/ButtonNext.png')
        this.load.image('ButtonNextTeks', 'asset/ButtonNextTeks.png')
        this.load.image('ButtonReplay', 'asset/ButtonReplay.png')
        this.load.image('glow', 'asset/glow.png')
        this.load.image('Koin', 'asset/Koin.png')
        this.load.image('Bintang', 'asset/Bintang.png')
        this.load.image('BintangOff', 'asset/BintangOff.png')
        this.load.image('PanelTeksJawabanSalah', 'asset/PanelTeksJawabanSalah.png')

        // Muat gambar aset
        this.load.image('Apel', 'asset/Apel.png')
        this.load.image('Bola', 'asset/Bola.png')
        this.load.image('Cermin', 'asset/Cermin.png')
        this.load.image('EsKrim', 'asset/EsKrim.png')
        this.load.image('Lilin', 'asset/Lilin.png')
        this.load.image('Pensil', 'asset/Pensil.png')
        this.load.image('VasBunga', 'asset/VasBunga.png')
        this.load.image('Wortel', 'asset/Wortel.png')

        this.load.image('PanelBenda1', 'asset/PanelBenda1.png')
        this.load.image('PanelJawabanAbstrak1', 'asset/PanelJawabanAbstrak1.png')
        this.load.image('PanelJawabanKotak1', 'asset/PanelJawabanKotak1.png')
        this.load.image('PanelJawabanKotak2', 'asset/PanelJawabanKotak2.png')
        this.load.image('PanelJawabanPanjang', 'asset/PanelJawabanPanjang.png')
        this.load.image('PanelSoalKotakKosong', 'asset/PanelSoalKotakKosong.png')
        this.load.image('PanelSoalKotakPutih2', 'asset/PanelSoalKotakPutih2.png')
        this.load.image('PanelSoalKotakPutih3', 'asset/PanelSoalKotakPutih3.png')

        // this.load.spritesheet('nama-key', 'asset/nama-file.png', { frameWidth: 44.8, frameHeight: 93 });

        this.load.audio('benar', ['asset/sound/benar.ogg', 'asset/sound/benar.mp3'])
        this.load.audio('music_gameplay2', [
          'asset/sound/music_gameplay2.ogg',
          'asset/sound/music_gameplay2.mp3',
        ])
        this.load.audio('music_gameplay3', [
          'asset/sound/music_gameplay3.ogg',
          'asset/sound/music_gameplay3.mp3',
        ])
        this.load.audio('starhit3', ['asset/sound/starhit3.ogg', 'asset/sound/starhit3.mp3'])
        this.load.audio('tetet', ['asset/sound/tetet.ogg', 'asset/sound/tetet.mp3'])
        this.load.audio('touch', ['asset/sound/touch.ogg', 'asset/sound/touch.mp3'])
        this.load.audio('transisi_soal', [
          'asset/sound/transisi_soal.ogg',
          'asset/sound/transisi_soal.mp3',
        ])

        // load animasi spine
        // this.load.setPath('./asset/spine/')
        // this.load.spine('ResultTogether', 'ResultTogether.json', 'ResultTogether.atlas', true) //file image, json, atlas
      }
      // GLOBAL VARIABLE - mendeklarasikan variable pembantu
      let X_POSITION
      let Y_POSITION
      let relativeSize
      const layoutSize = { w: window.innerWidth, h: window.innerHeight } //1024 x 768

      // GLOBAL VARIABLES - mendeklarasikan variable untuk skor, jumlah soal, dan soal aktif
      let skor = 0
      let soalAktif = 1
      const jumlahSoal = 6
      let jumlahBenda
      let jumlahBendaLain
      let isPanelBenda1Correct
      let glowTween
      let coinTween
      let panelBenda1, panelBenda2, textPanelBenda1, textPanelBenda2

      // Daftar gambar
      const gambarBenda = [
        'Apel',
        'Bola',
        'Cermin',
        'EsKrim',
        'Lilin',
        'Pensil',
        'VasBunga',
        'Wortel',
      ]

      function create() {
        X_POSITION = {
          LEFT: 0,
          CENTER: game.canvas.width / 2,
          RIGHT: game.canvas.width,
        }

        Y_POSITION = {
          TOP: 0,
          CENTER: game.canvas.height / 2,
          BOTTOM: game.canvas.height,
        }

        relativeSize = {
          w: (game.canvas.width - layoutSize.w) / 2,
          h: (game.canvas.height - layoutSize.h) / 2,
        }

        const activeScene = this

        // load semua audio
        const snd_ambience = this.sound.add('music_gameplay' + Phaser.Math.Between(2, 3))
        snd_ambience.loop = true
        snd_ambience.setVolume(0.5)
        snd_ambience.play()

        const snd_touch = this.sound.add('touch')
        const snd_transisi = this.sound.add('transisi_soal')
        const snd_benar = this.sound.add('benar')
        const snd_starhit = this.sound.add('starhit3')
        const snd_salah = this.sound.add('tetet')

        // menambahkan backdrop darkenLayer
        const darkenLayer = this.add.rectangle(
          X_POSITION.CENTER,
          Y_POSITION.CENTER,
          game.canvas.width,
          game.canvas.height,
          0x000000,
        )
        darkenLayer.setDepth(10)
        darkenLayer.alpha = 0 //ubah nilainya nanti

        // menambahkan background
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGStage1')

        // panel atas
        const panelSoal = this.add.image(X_POSITION.CENTER, Y_POSITION.TOP - 100, 'PanelSoalAtas')
        const btnMenu = this.add
          .image(X_POSITION.LEFT + 80, Y_POSITION.TOP - 70, 'ButtonMenu')
          .setInteractive()
        const panelNilai = this.add
          .image(X_POSITION.RIGHT - 150, Y_POSITION.TOP - 90, 'PanelNilai')
          .setDepth(2)
        const panelJumlahSoal = this.add.image(
          panelNilai.x + 25,
          panelNilai.y + panelNilai.height,
          'PanelJumlahSoal',
        )

        btnMenu.on('pointerdown', function () {
          this.setTint(0x999999)
          snd_touch.play()
        })

        btnMenu.on('pointerup', function () {
          this.clearTint()
        })

        // teks soal atau perintah
        const teksSoal = this.add
          .text(
            panelSoal.x,
            panelSoal.y,
            'tampilkan teks soal di sini ya. cukup satu baris. otomatis jadi beberapa baris jika soalnya panjang.',
            {
              font: '22px Delius',
              fill: '#000',
              wordWrap: { width: 500, useAdvancedWrap: true },
              align: 'center',
            },
          )
          .setOrigin(0.5)

        // Membuat text skor dan soal aktif
        const scoreText = this.add
          .text(panelNilai.x + 20, panelNilai.y - 30, skor, {
            font: '48px Delius',
            fill: '#fff',
          })
          .setDepth(2)
        const currentQuestionText = this.add.text(
          panelJumlahSoal.x - 25,
          panelJumlahSoal.y - 25,
          `${soalAktif}/${jumlahSoal}`,
          {
            font: '36px Delius',
            fill: '#fff',
          },
        )

        // animasi slide in untuk panel atas
        this.tweens.add({
          targets: [
            btnMenu,
            panelSoal,
            panelNilai,
            panelJumlahSoal,
            teksSoal,
            scoreText,
            currentQuestionText,
          ],
          y: '+=150', // Pindahkan gambar pertama turun ke layar
          ease: 'Bounce.easeOut', // Efek memantul
          duration: 1000, // Durasi animasi
          //   delay: 100, // Penundaan sedikit sebelum animasi dimulai
        })

        // mekanika utama game mulai dari sini-----------------------------------------------------------------------------
        // fungsi untuk memulai game
        const startGame = (scene) => {
          // ketikkan mekanisme utama game di sini ---ini hanya contoh saja
          const panel1 = this.add
            .image(X_POSITION.CENTER - 200, Y_POSITION.CENTER, 'PanelBenda1')
            .setScale(0.75)
            .setInteractive()
          const panel2 = this.add
            .image(X_POSITION.CENTER + 200, Y_POSITION.CENTER, 'PanelBenda1')
            .setScale(0.75)
            .setInteractive()

          this.add
            .text(panel1.x, panel1.y, 'Benar', {
              font: '48px Delius',
              fill: '#000',
            })
            .setOrigin(0.5)

          this.add
            .text(panel2.x, panel2.y, 'Salah', {
              font: '48px Delius',
              fill: '#000',
            })
            .setOrigin(0.5)

          panel1.on('pointerup', () => {
            // untuk menghindari spam-click, disableInteractive dulu
            panel1.disableInteractive()
            panel2.disableInteractive()

            snd_touch.play()

            // DELAY CARA 1
            setTimeout(() => {
              checkAnswer(true, panel1, this)
            }, 100)
          })

          panel2.on('pointerup', () => {
            // untuk menghindari spam-click, disableInteractive dulu
            panel1.disableInteractive()
            panel2.disableInteractive()

            snd_touch.play()

            // DELAY CARA 2
            this.time.delayedCall(100, () => {
              checkAnswer(false, panel2, this)
            })
          })

          // Perbarui teks soal jika sifatnya dinamis
          // if (teksSoal) {
          //     teksSoal.setText(Kelompok manakah yang memiliki jumlah benda sebanyak ${jumlahBenda}?);
          // }
        }

        // Fungsi untuk membuat panel berkedip dengan warna yang ditentukan
        const blinkPanel = (panel, color, scene, isCorrect) => {
          // Set warna panel ke warna yang ditentukan
          panel.setTint(color)

          // Buat tween untuk membuat panel berkedip
          scene.tweens.add({
            targets: panel,
            alpha: { from: 1, to: 0.3 }, // Mengubah transparansi dari penuh ke 0
            ease: 'Linear',
            duration: 150, // Durasi tiap kedipan (100ms)
            repeat: 3, // Jumlah kedipan
            yoyo: true, // Efek bolak-balik
            onComplete: function () {
              panel.clearTint() // Reset warna setelah berkedip

              if (isCorrect) {
                correctAnswerEffect(scene)
              } else {
                // Jika salah, tampilkan jawaban yang benar dan tombol lanjut
                showCorrectAnswer(scene)
              }
            },
          })
        }

        // fungsi untuk memeriksa pilihan jawaban
        const checkAnswer = (isCorrect, panel, scene) => {
          // Nonaktifkan interaktivitas panel setelah jawaban dipilih
          // panelBenda1.disableInteractive();
          // panelBenda2.disableInteractive();

          if (isCorrect) {
            console.log('Jawaban Benar!')

            blinkPanel(panel, 0x00ff00, scene, true) // Warna hijau untuk benar
            snd_benar.play()

            // lanjutSoal(scene);
          } else {
            console.log('Jawaban Salah! Jawaban yang benar adalah :' + jumlahBenda)

            blinkPanel(panel, 0xff0000, scene, false) // Warna merah untuk salah
            snd_salah.play()
          }

          // Perbarui tampilan skor
          scoreText.setText(skor)
        }

        // fungsi untuk lanjut soal
        const lanjutSoal = (scene) => {
          // Naikkan soalAktif
          soalAktif += 1
          snd_transisi.play()

          // Cek jika sudah mencapai jumlah soal maksimal
          if (soalAktif > jumlahSoal) {
            gameOver(scene, skor) // Tampilkan game over
          } else {
            // Bersihkan panel-panel sebelumnya

            // Perbarui teks soal aktif
            this.time.delayedCall(500, () => {
              currentQuestionText.setText(`${soalAktif}/${jumlahSoal}`)
              startGame(scene) // Mulai soal berikutnya
            })
          }
        }

        // fungsi game over
        let particlesManager // Manajer partikel
        particlesManager = this.add.particles('Bintang').setDepth(15) // Menggunakan gambar bintang sebagai partikel
        const gameOver = (scene, skorAkhir) => {
          darkenLayer.setDepth(10)
          darkenLayer.alpha = 0.75

          // Tampilkan teks Game Over dan skor akhir
          const txtGameover = scene.add
            .text(X_POSITION.CENTER, Y_POSITION.CENTER - 300, 'Ayo Coba Lagi!', {
              font: '32px Delius',
              fill: '#fff',
              align: 'center',
            })
            .setDepth(10)
            .setOrigin(0.5)

          // Menampilkan BintangOff
          let bintangOff = []
          let bintang = []
          for (let i = 0; i < 3; i++) {
            bintangOff[i] = this.add
              .image(X_POSITION.CENTER - 100 + i * 100, Y_POSITION.CENTER - 200, 'BintangOff')
              .setScale(0.7)
              .setDepth(10)
          }

          // hitung skor dulu
          let star = 0
          if (skorAkhir >= 5) {
            star = 3
            txtGameover.setText('Luar Biasaa!')
          } else if (skorAkhir >= 3) {
            star = 2
            txtGameover.setText('Kamu Juara!')
          } else if (skorAkhir >= 1) {
            star = 1
            txtGameover.setText('Bagus!')
          }

          const tampilkanBintang = (n) => {
            // Berdasarkan angka acak, tampilkan Bintang secara bertahap
            for (let i = 0; i < n; i++) {
              // Ubah <= menjadi < agar tidak melebihi indeks
              this.time.delayedCall(
                i * 500,
                function () {
                  // Tambahkan bintang dengan alpha 0
                  bintang[i] = this.add
                    .image(X_POSITION.CENTER - 100 + i * 100, Y_POSITION.CENTER - 200, 'Bintang')
                    .setScale(0.7)
                    .setAlpha(0)
                  bintang[i].setDepth(10)

                  // Tambahkan tween untuk fade in
                  this.tweens.add({
                    targets: bintang[i],
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                      // Setelah tween selesai, tambahkan partikel di depan bintang
                      addParticles(scene, bintang[i].x, bintang[i].y)
                    },
                  })
                },
                [],
                this,
              )
            }
          }

          const addParticles = (scene, x, y) => {
            // Konfigurasi emitter partikel
            const emitter = particlesManager.createEmitter({
              x: x,
              y: y,
              speed: { min: -100, max: 100 },
              angle: { min: 0, max: 360 },
              scale: { start: 0.2, end: 0 },
              blendMode: 'ADD',
              lifespan: 1000, // Partikel akan hilang setelah 2 detik
              quantity: 10,
              frequency: 50,
              emitZone: {
                type: 'circle',
                source: new Phaser.Geom.Circle(0, 0, 10),
                quantity: 10,
              },
            })

            scene.time.delayedCall(1000, () => {
              emitter.stop() // Berhenti memancarkan partikel
            })
          }

          scene.time.delayedCall(1000, tampilkanBintang(star), [], this)

          const panelSkor = scene.add.image(
            X_POSITION.CENTER,
            Y_POSITION.CENTER - 100,
            'PanelNilai',
          )
          panelSkor.setDepth(10)
          const skorAkhirTeks = scene.add
            .text(panelSkor.x + 20, panelSkor.y - 30, skorAkhir, {
              font: '48px Delius',
              fill: '#fff',
              align: 'center',
            })
            .setDepth(10)

          // // animasi spine, plugin ditambahkan di config
          // const result = this.add.spine(
          //   X_POSITION.CENTER,
          //   Y_POSITION.CENTER,
          //   'ResultTogether',
          //   'ResultDepan',
          //   true,
          // )
          // result.setScale(0.5)
          // result.setDepth(10)

          // Tampilkan tombol replay
          const btnReplay = scene.add
            .image(X_POSITION.CENTER, Y_POSITION.BOTTOM - 100, 'ButtonReplay')
            .setInteractive()
          btnReplay.setDepth(10)

          const menu = scene.add
            .image(X_POSITION.CENTER - 150, Y_POSITION.BOTTOM - 100, 'ButtonMenu')
            .setInteractive()
          menu.setDepth(10)

          const next = scene.add
            .image(X_POSITION.CENTER + 200, Y_POSITION.BOTTOM - 100, 'ButtonNextTeks')
            .setInteractive()
          next.setDepth(10)

          btnReplay.on('pointerdown', function () {
            this.setTint(0x999999)
          })

          btnReplay.on('pointerup', function () {
            this.clearTint()
            snd_touch.play()
            // Reset variabel global
            skor = 0
            soalAktif = 1
            scoreText.setText(skor)
            currentQuestionText.setText(`${soalAktif}/${jumlahSoal}`)

            // menghilangkan buttonreplay
            activeScene.tweens.add({
              targets: [this, menu, next, panelSkor, skorAkhirTeks],
              ease: 'Back.In',
              duration: 250,
              scaleX: 0,
              scaleY: 0,
            })

            // menghilangkan darkenLayer
            activeScene.tweens.add({
              delay: 150,
              targets: darkenLayer,
              duration: 250,
              alpha: 0,
              onComplete: function () {
                // Bersihkan panel-panel sebelumnya

                bintang.forEach((bintang) => {
                  bintang.destroy()
                })
                bintangOff.forEach((bintang) => {
                  bintang.destroy()
                })
                bintang = []
                bintangOff = []

                txtGameover.destroy()
                result.destroy()

                // Mulai ulang game
                startGame(scene)
              },
            })
          })

          // event untuk tombol menu
          menu.on('pointerdown', function () {
            this.setTint(0x999999)
          })
          menu.on('pointerup', function () {
            this.clearTint()
            snd_touch.play()
          })

          // event untuk tombol next
          next.on('pointerdown', function () {
            this.setTint(0x999999)
          })
          next.on('pointerup', function () {
            this.clearTint()
            snd_touch.play()
          })
        }
        // mekanika utama game sampai di sini-----------------------------------------------------------------------------

        // fungsi untuk menampilkan jawaban yang benar
        let panelSalah
        let teksJawabanBenar
        let btnNext
        const showCorrectAnswer = (scene) => {
          // tampilkan jawaban yang  benar
          panelSalah = scene.add.image(
            X_POSITION.CENTER,
            Y_POSITION.BOTTOM + 57,
            'PanelTeksJawabanSalah',
          )
          // teksJawabanBenar = scene.add.text(panelSalah.x, panelSalah.y, Jawaban yang benar adalah: ${correctGroupText}, { font: "24px Delius", fill: "#000" }).setOrigin(0.5);
          teksJawabanBenar = scene.add
            .text(panelSalah.x, panelSalah.y, 'Jawaban yang benar adalah:\n', {
              font: '24px Delius',
              align: 'center',
              fill: '#000',
            })
            .setOrigin(0.5)
          // align: "center",
          btnNext = scene.add
            .image(X_POSITION.RIGHT - 75, Y_POSITION.BOTTOM + 60, 'ButtonNext')
            .setInteractive()

          if (soalAktif < jumlahSoal) {
            scene.tweens.add({
              targets: [panelSalah, teksJawabanBenar, btnNext], // Animasi untuk panel, teks, dan tombol
              y: '-=114', // Pindahkan ke atas 100px
              ease: 'Power2', // Easing
              duration: 1000, // Durasi animasi
            })

            btnNext.on('pointerdown', function () {
              btnNext.disableInteractive()
              snd_touch.play()

              // Lanjutkan ke soal berikutnya
              lanjutSoal(scene)

              scene.tweens.add({
                targets: [panelSalah, teksJawabanBenar, btnNext], // Animasi untuk panel, teks, dan tombol
                y: '+=114', // Pindahkan ke bawah 100px (keluar layar)
                ease: 'Power2', // Easing
                duration: 1000, // Durasi animasi
                onComplete: () => {
                  panelSalah.destroy()
                  teksJawabanBenar.destroy()
                  btnNext.destroy()
                },
              })
            })
          } else {
            scene.tweens.add({
              targets: [panelSalah, teksJawabanBenar], // Animasi untuk panel, teks, dan tombol
              y: '-=114', // Pindahkan ke atas 100px
              ease: 'Power2', // Easing
              duration: 1000, // Durasi animasi
              onComplete: () => {
                scene.time.delayedCall(1000, () => {
                  scene.tweens.add({
                    targets: [panelSalah, teksJawabanBenar, btnNext], // Animasi untuk panel, teks, dan tombol
                    y: '+=114', // Pindahkan ke bawah 100px (keluar layar)
                    ease: 'Power2', // Easing
                    duration: 1000, // Durasi animasi
                    onComplete: () => {
                      panelSalah.destroy()
                      teksJawabanBenar.destroy()

                      gameOver(scene, skor)
                    },
                  })
                })
              },
            })
          }
        }

        // fungsi untuk menampilkan efek saat jawaban benar
        const correctAnswerEffect = (scene) => {
          // darkenLayer.setDepth(10);
          darkenLayer.alpha = 0.75
          snd_starhit.play()

          const glow = this.add
            .sprite(X_POSITION.CENTER, Y_POSITION.CENTER, 'glow')
            .setDepth(10)
            .setScale(0.75)
            .setAlpha(0.5)
          const coin = this.add
            .sprite(X_POSITION.CENTER, Y_POSITION.CENTER, 'Koin')
            .setDepth(10)
            .setScale(1.5)

          // Buat tween untuk merotasi gambar glow terus menerus
          glowTween = scene.tweens.add({
            targets: glow,
            angle: 180, // Rotasi hingga 360 derajat
            duration: 2000, // Waktu yang diperlukan (2 detik)
            repeat: -1, // Ulangi terus-menerus
            ease: 'Linear', // Rotasi dengan kecepatan konstan
          })

          // Buat tween untuk memantulkan koin
          coinTween = scene.tweens.add({
            targets: coin,
            y: Y_POSITION.CENTER - 200, // Pindah ke posisi y = 400
            duration: 2000, // Waktu yang diperlukan untuk satu pantulan
            ease: 'Bounce.in', // Efek pantulan yang halus
            onComplete: function () {
              coin.setVisible(false) // Sembunyikan koin

              skor++ // Skor bertambah jika jawaban benar
              scoreText.setText(skor)
            },
          })

          // Timer untuk menghentikan animasi setelah 2 detik
          this.time.delayedCall(2000, () => {
            activeScene.tweens.add({
              delay: 150,
              targets: darkenLayer,
              duration: 250,
              alpha: 0,
              onComplete: function () {
                glowTween.stop() // Hentikan rotasi glow
                coinTween.stop() // Hentikan pantulan koin
                glow.setVisible(false) // Sembunyikan glow
                coin.setVisible(false) // Sembunyikan koin

                // Jika jawabannya benar, lanjutkan soal secara otomatis
                lanjutSoal(scene)
              },
            })
          })
        }

        // Memulai game
        startGame(this)
      }

      function update() {}
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
