'use strict'

import * as THREE from 'three'
import Config from '../Config'
import Tone from 'tone'
import _ from 'lodash'
import { map } from '../../utils/math'

export default class Audio {
  constructor (camera, path) {
    this.samplerLoaded = false
    this.camera = camera
    this.loops = []
    this.quantize = 32
    this.masterVol = -18 // db
    this.ambienceVol = -15 // db
    this.ambiencePath = path + 'sounds/ambience/mining.ogg'
    this.bpm = 60
    this.notes = {
      55.000: 'A1',
      58.270: 'A#1',
      61.735: 'B1',
      65.406: 'C1',
      69.296: 'C#1',
      73.416: 'D1',
      77.782: 'D#1',
      82.407: 'E1',
      87.307: 'F1',
      92.499: 'F#1',
      97.999: 'G1',
      103.826: 'G#1',
      110.000: 'A2',
      116.541: 'A#2',
      123.471: 'B2',
      130.813: 'C2',
      138.591: 'C#2',
      146.832: 'D2',
      155.563: 'D#2',
      164.814: 'E2',
      174.614: 'F2',
      184.997: 'F#2',
      195.998: 'G2',
      207.652: 'G#2',
      220.000: 'A3',
      233.082: 'A#3',
      246.942: 'B3',
      261.626: 'C3',
      277.183: 'C#3',
      293.665: 'D3',
      311.127: 'D#3',
      329.628: 'E3',
      349.228: 'F3',
      369.994: 'F#3',
      391.995: 'G3',
      415.305: 'G#3',
      440.000: 'A4',
      466.164: 'A#4',
      493.883: 'B4',
      523.251: 'C4'
    }

    this.pointColors = []

    this.modes = {
      'ionian': [
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'B',
        'C'
      ],
      'dorian': [
        'C',
        'D',
        'D#',
        'F',
        'G',
        'A',
        'A#',
        'C'
      ],
      'phrygian': [
        'C',
        'C#',
        'D#',
        'F',
        'G',
        'G#',
        'A#',
        'C'
      ],
      'lydian': [
        'C',
        'D',
        'E',
        'F#',
        'G',
        'A',
        'B',
        'C'
      ],
      'mixolydian': [
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'A#',
        'C'
      ],
      'aeolian': [
        'C',
        'D',
        'D#',
        'F',
        'G',
        'G#',
        'A#',
        'C'
      ],
      'locrian': [
        'C',
        'C#',
        'D#',
        'F',
        'F#',
        'G#',
        'A#',
        'C'
      ]
    }

    this.audioLoader = new THREE.AudioLoader()
  }

  loadAmbience () {
    return new Promise((resolve, reject) => {
      this.ambienceFilter = new Tone.Filter({
        type: 'lowpass',
        Q: 5
      }).chain(this.ambienceBus)

      this.ambiencePlayer = new Tone.Player({
        'url': this.ambiencePath,
        'loop': true,
        onload: () => {
          resolve()
        }
      // }).chain(this.ambienceFilter)
      }).chain(this.ambienceBus)

      this.ambienceBus.volume.linearRampToValueAtTime(this.ambienceVol, 20)
    })
  }

  setAmbienceFilterCutoff (value) {
    // this.ambienceFilter.frequency.linearRampToValueAtTime(value, Tone.Transport.seconds + 5)
  }

  unloadSound () {
    if (this.loops.length) {
      for (let index = 0; index < this.loops.length; index++) {
        const loop = this.loops[index]
        loop.cancel()
        loop.dispose()
      }
      this.loops = []
    }
  }

  preloadNotes () {
    return new Promise((resolve, reject) => {
      let loadCount = 0
      let self = this
      resolve()
      /* _.forIn(this.notes, (note, key) => {
        this.audioLoader.load(
          // resource URL
          path + 'sounds/kalimba/' + note.replace('#', 'S') + '.ogg',
          // Function when resource is loaded
          function (audioBuffer) {
            loadCount++
            if (loadCount === Object.keys(self.notes).length) {
              resolve()
            }
          }
        )
      }) */
    })
  }

  preloadAmbience () {
    return new Promise((resolve, reject) => {
      resolve()
     /* this.audioLoader.load(
        this.ambiencePath,
        function (audioBuffer) {
          resolve()
        }
      ) */
    })
  }

  preload () {
    return new Promise((resolve, reject) => {
      this.preloadNotes().then(() => {
        this.preloadAmbience().then(() => {
          console.log('sound loaded')
          resolve()
        })
      })
    })
  }

  init () {
    return new Promise((resolve, reject) => {
      this.masterBus = new Tone.Volume(this.masterVol).toMaster()
      this.ambienceBus = new Tone.Volume(-96).toMaster()

      /* this.convolver = new Tone.Convolver(path + 'sounds/IR/r1_ortf.wav')
      this.convolver.set('wet', 1.0) */

      // this.pingPong = new Tone.PingPongDelay('16n', 0.85)

      Tone.Transport.bpm.value = this.bpm

      /* Tone.Listener.setPosition(this.camera.position.x, this.camera.position.y, this.camera.position.z)

      document.addEventListener('cameraMove', function () {
        Tone.Listener.setPosition(this.camera.position.x, this.camera.position.y, this.camera.position.z)
      }.bind(this), false) */

      /* let cameraForwardVector = new THREE.Vector3()
      let quaternion = new THREE.Quaternion()
      cameraForwardVector.set(0, 0, -1).applyQuaternion(quaternion)

      Tone.Listener.setOrientation(cameraForwardVector.x, cameraForwardVector.y, cameraForwardVector.z, this.camera.up.x, this.camera.up.y, this.camera.up.z) */

      // this.preload().then(() => {
      this.loadAmbience().then(() => {
        this.ambiencePlayer.start()
        Tone.Transport.start()
        resolve()
      })
      // })
    })
  }

  loadSampler () {
    this.sampler = new Tone.Sampler({
      'A1': path + 'sounds/kalimba/A1.ogg',
      'A#1': path + 'sounds/kalimba/AS1.ogg',
      'B1': path + 'sounds/kalimba/B1.ogg',
      'C1': path + 'sounds/kalimba/C1.ogg',
      'C#1': path + 'sounds/kalimba/CS1.ogg',
      'D1': path + 'sounds/kalimba/D1.ogg',
      'D#1': path + 'sounds/kalimba/DS1.ogg',
      'E1': path + 'sounds/kalimba/E1.ogg',
      'F1': path + 'sounds/kalimba/F1.ogg',
      'F#1': path + 'sounds/kalimba/FS1.ogg',
      'G1': path + 'sounds/kalimba/G1.ogg',
      'G#1': path + 'sounds/kalimba/GS1.ogg',
      'A2': path + 'sounds/kalimba/A2.ogg',
      'A#2': path + 'sounds/kalimba/AS2.ogg',
      'B2': path + 'sounds/kalimba/B2.ogg',
      'C2': path + 'sounds/kalimba/C2.ogg',
      'C#2': path + 'sounds/kalimba/CS2.ogg',
      'D2': path + 'sounds/kalimba/D2.ogg',
      'D#2': path + 'sounds/kalimba/DS2.ogg',
      'E2': path + 'sounds/kalimba/E2.ogg',
      'F2': path + 'sounds/kalimba/F2.ogg',
      'F#2': path + 'sounds/kalimba/FS2.ogg',
      'G2': path + 'sounds/kalimba/G2.ogg',
      'G#2': path + 'sounds/kalimba/GS2.ogg',
      'A3': path + 'sounds/kalimba/A3.ogg',
      'A#3': path + 'sounds/kalimba/AS3.ogg',
      'B3': path + 'sounds/kalimba/B3.ogg',
      'C3': path + 'sounds/kalimba/C3.ogg',
      'C#3': path + 'sounds/kalimba/CS3.ogg',
      'D3': path + 'sounds/kalimba/D3.ogg',
      'D#3': path + 'sounds/kalimba/DS3.ogg',
      'E3': path + 'sounds/kalimba/E3.ogg',
      'F3': path + 'sounds/kalimba/F3.ogg',
      'F#3': path + 'sounds/kalimba/FS3.ogg',
      'G3': path + 'sounds/kalimba/G3.ogg',
      'G#3': path + 'sounds/kalimba/GS3.ogg'
  /*    'A4': path + 'sounds/kalimba/A4.ogg',
      'A#4': path + 'sounds/kalimba/AS4.ogg',
      'B4': path + 'sounds/kalimba/B4.ogg',
      'C4': path + 'sounds/kalimba/C4.ogg' */
    }).chain(this.masterBus)
  }

  generateMerkleSound (positionsArray, blockObjectPosition, block, pointsMaterial, pointsMesh) {
    if (!this.samplerLoaded) {
      this.loadSampler()
    }

    this.samplerLoaded = true

    this.loopMap = []

    this.black = new THREE.Color(0x000000)
    this.white = new THREE.Color(0xffffff)

    this.pointsMaterial = pointsMaterial

    let minTime = Number.MAX_SAFE_INTEGER
    let maxTime = 0

    for (let index = 0; index < block.transactions.length; index++) {
      const transaction = block.transactions[index]
      minTime = Math.min(transaction.time, minTime)
      maxTime = Math.max(transaction.time, maxTime)
    }

    block.transactions.sort((a, b) => {
      return a.time > b.time
    })

    this.pointColors = []
    for (let index = 0; index < positionsArray.length * 3; index++) {
      this.pointColors.push(0)
    }

    for (let index = 0; index < positionsArray.length; index++) {
      const point = positionsArray[index]

      /**
       * Map transaction time to new range
       */
      if (typeof block.transactions[index] !== 'undefined') {
        const transaction = block.transactions[index]
        let time = map(transaction.time, minTime, maxTime, 0, 30) + 1.0

        // noteCount++

        // get closest note
        let minDiff = Number.MAX_SAFE_INTEGER
        let note = 'C1'

        let mode = this.modes.aeolian
        for (var frequency in this.notes) {
          if (this.notes.hasOwnProperty(frequency)) {
            let noteName = this.notes[frequency].replace(/[0-9]/g, '')
            if (mode.indexOf(noteName) !== -1) { // filter out notes not in mode
              let diff = Math.abs((point.y * 1.2) - frequency)
              if (diff < minDiff) {
                minDiff = diff
                note = this.notes[frequency]
              }
            }
          }
        }

        let that = this
        let loop

        let timeLowRes = time.toFixed(1)

        if (typeof this.loopMap[timeLowRes] === 'undefined') {
          loop = new Tone.Loop(
            () => {
              this.sampler.triggerAttack(note, '@' + that.quantize + 'n', 1.0)
              this.pointColors[index * 3] = 255
              setTimeout(() => {
                this.pointColors[index * 3] = 0
              }, 500)
            },
            '1m'
          ).start(Tone.Transport.seconds + time)
        } else {
          loop = new Tone.Loop(
            () => {
              this.pointColors[index * 3] = 255
              setTimeout(() => {
                this.pointColors[index * 3] = 0
              }, 500)
            },
              '1m'
          ).start(Tone.Transport.seconds + time)
        }
        loop.humanize = '64n'
        this.loops.push(loop)
        this.loopMap[timeLowRes] = true
      }
    }
  }
}
