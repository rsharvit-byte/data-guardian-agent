import { useState } from "react";
import { LayoutShell } from "./components/LayoutShell";
import { SalesforceOrgPage } from "./components/SalesforceOrgPage";

export type AppScreen = "chat" | "salesforce";

function App() {
  const [screen, setScreen] = useState<AppScreen>("chat");

  if (screen === "salesforce") {
    return <SalesforceOrgPage onBack={() => setScreen("chat")} />;
  }

  return <LayoutShell onOptimize={() => setScreen("salesforce")} />;
}

export default App;
