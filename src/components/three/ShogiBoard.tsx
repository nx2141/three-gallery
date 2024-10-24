
import { useFBX } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import ReactLoading from 'react-loading'
import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import React, { useEffect, useRef, useState } from 'react'

interface ModelProps {
  onLoaded: () => void
}

const Model: React.FC<ModelProps> = ({ onLoaded }) => {
  const fbxPath = '/obj/shogi_board.fbx'
  const fbx = useFBX(fbxPath)
  const ref = useRef<THREE.Object3D>(null)
  const mixer = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    if (fbx) {
      fbx.scale.set(1.9, 1.9, 1.9) // サイズ調整
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true

          const mesh = child as THREE.Mesh
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial
            if (material.map) material.map.needsUpdate = true
          }
        }
      })

      mixer.current = new THREE.AnimationMixer(fbx)
      const action = mixer.current.clipAction(fbx.animations[0])
      action.play()

      onLoaded() // モデルのロードが完了したらコールバックを呼び出す
    }
  }, [fbx, onLoaded])

  useFrame((state, delta) => {
    mixer.current?.update(delta)
  })

  return <primitive object={fbx} ref={ref} />
}

const CameraSetup = () => {
  const { camera, gl } = useThree()
  useEffect(() => {
    camera.position.set(23, 10, 100) // カメラの位置を設定
    ;(camera as THREE.PerspectiveCamera).fov = 18 // 焦点距離を100mm相当に調整
    camera.updateProjectionMatrix() // カメラの投影行列を更新

    const controls = new OrbitControls(camera, gl.domElement)
    controls.target.set(0, 0, 0) // オブジェクトを中心に設定
    controls.update()

    return () => {
      controls.dispose()
    }
  }, [camera, gl])

  return null
}

const ShogiBoard = () => {
  const [loading, setLoading] = useState(true)

  const handleLoaded = () => {
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000) // 3秒後にloadingをfalseに設定

    return () => clearTimeout(timer) // クリーンアップ
  }, [])

  return (
    <div className="hover:cursor-move">
      {loading && (
        <div className="flex h-full items-center justify-center text-black">
          <ReactLoading type="cylon" height={70} width={70} color="gray" />
        </div>
      )}
      <Canvas shadows style={{ background: 'transparent' }}>
        <CameraSetup />
        <ambientLight intensity={0.9} />
        <spotLight
          // Left Light
          position={[15, 22, 0]} // スポットライトの位置を設定
          angle={-15} // スポットライトの角度を設定
          intensity={900} // スポットライトの強度を設定
          castShadow // スポットライトに影を有効にする
        />
        <spotLight
          // Right Light
          position={[-24, 5, 1]} // スポットライトの位置を設定
          angle={15} // スポットライトの角度を設定
          intensity={600} // スポットライトの強度を設定
          castShadow // スポットライトに影を有効にする
        />
        <spotLight
          // Face Light
          position={[-4, 18, 8]} // スポットライトの位置を設定
          angle={23} // スポットライトの角度を設定
          intensity={200} // スポットライトの強度を設定
          castShadow // スポットライトに影を有効にする
        />
        <Model onLoaded={handleLoaded} />
      </Canvas>
    </div>
  )
}

export default ShogiBoard
