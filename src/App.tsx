// src/App.tsx
import './App.css'
import ShogiBoard from '@/components/three/ShogiBoard'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs'

function App() {
  return (
    <div className="mx-auto my-5 flex h-96 max-w-[850px] justify-center overflow-hidden sm:h-[600px]">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="relative z-20 flex w-full justify-center">
          <TabsTrigger value="将棋盤">将棋盤</TabsTrigger>
          <TabsTrigger value="GOWEB猫">GOWEB猫</TabsTrigger>
        </TabsList>
        <TabsContent value="将棋盤" className="h-full w-full">
          <div className="flex h-full w-full items-center justify-center bg-slate-200">
            <ShogiBoard />
          </div>
        </TabsContent>
        <TabsContent value="GOWEB猫" className="h-full w-full">
          <div className="flex h-full w-full items-center justify-center">
            準備中...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
