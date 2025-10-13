import { Button } from "./components/ui/Button";
import AppProvider from "./providers";
import "./styles/index.css";
function App() {

  return <AppProvider>
    <div className="min-h-screen  text-label-primary p-6 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Tailwind + Ant Design Theme Switcher
        </h1>
      </div>

        {/* <Button
          className="!h-[44px] py-[8px] px-[24px] !rounded-4xl w-[292px]"
          variant="secondary"
          htmlType="submit"
          loading={false}
        >
          Submit
        </Button> */}
        <Button>AAA</Button>
    </div>
  </AppProvider>
}

export default App;
