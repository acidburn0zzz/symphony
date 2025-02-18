import * as THREE from 'three'
import BlockMaterial from '../BlockMaterial/BlockMaterial'
const glslify = require('glslify')

export default class MerkleMaterial extends BlockMaterial {
  constructor (cfg) {
    super(cfg)
    this.type = 'ShaderMaterial'

    this.uniforms = THREE.ShaderLib.standard.uniforms

    this.uniforms.uTime = {
      type: 'f'
    //  value: 0.0
    }

    this.uniforms.uAnimTime = {
      type: 'f'
   //   value: 0.0
    }

    this.vertexShader = glslify('./MerkleMaterial.vert')
    this.fragmentShader = glslify('./MerkleMaterial.frag')
  }
}
