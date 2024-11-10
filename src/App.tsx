import "./App.css";
import ShogiBoard from "@/components/three/ShogiBoard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";

function App() {
  return (
    <>
      <div className="justify-center flex my-3 mx-auto w-80">
        <Tabs defaultValue="account w-80">
          <TabsList className="justify-center flex">
            <TabsTrigger value="将棋盤">将棋盤</TabsTrigger>
            <TabsTrigger value="GOWEB猫">GOWEB猫</TabsTrigger>
          </TabsList>
          <TabsContent value="将棋盤">
            <ShogiBoard />
          </TabsContent>
          <TabsContent value="GOWEB猫">準備中...</TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
