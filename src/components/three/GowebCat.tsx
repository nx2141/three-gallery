import { useFBX } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import ReactLoading from 'react-loading'
import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import React, { useEffect, useRef, useState } from 'react'

interface ModelProps {
  onLoaded: () => void
}

const Model: React.FC<ModelProps> = ({ onLoaded }) => {
  const fbxPath = '/obj/goweb_cat.fbx'
  const fbx = useFBX(fbxPath)
  const ref = useRef<THREE.Object3D>(null)

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

      onLoaded() // モデルのロードが完了したらコールバックを呼び出す
    }
  }, [fbx, onLoaded])

  return <primitive object={fbx} ref={ref} />
}

const CameraSetup = () => {
  const { camera, gl } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 150) // カメラの位置を設定
    ;(camera as THREE.PerspectiveCamera).fov = 18 // 焦点距離を100mm相当に調整
    camera.updateProjectionMatrix() // カメラの投影行列を更新

    const controls = new OrbitControls(camera, gl.domElement)
    controls.update()

    return () => {
      controls.dispose()
    }
  }, [camera, gl])

  return null
}

const GowebCat = () => {
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
    <div className="relative aspect-square w-full hover:cursor-move">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <ReactLoading type="cylon" height={70} width={70} color="gray" />
        </div>
      )}
      <Canvas shadows className="h-full w-full">
        <CameraSetup />
        <ambientLight intensity={0.9} />
        <spotLight
          // Right Light (側面)
          position={[30, 0, 40]}
          angle={200}
          intensity={2500}
          castShadow
        />
        <spotLight
          // Front Light (正面に近い位置から照らす)
          position={[0, 50, -40]} // 正面に近い位置に調整
          angle={300} // 角度を広げて全体を照らす
          intensity={5500} // 強度を少し抑えることで自然な光に
          castShadow
        />
        <spotLight
          // Right Light (側面)
          position={[20, 30, 30]}
          angle={130}
          intensity={2500}
          castShadow
        />
        <Model onLoaded={handleLoaded} />
      </Canvas>
    </div>
  )
}

export default GowebCat
