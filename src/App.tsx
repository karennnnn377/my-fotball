import { useState } from "react";
import { DiffKey, Mode } from "./engine/types";
import { LangProvider } from "./i18n";
import { MenuScreen, DifficultyScreen, HowToScreen, AboutScreen } from "./screens/Home";
import GameScreen from "./screens/Game";

type Screen =
  | { name: "menu" }
  | { name: "howto" }
  | { name: "about" }
  | { name: "difficulty"; mode: Mode }
  | { name: "game"; mode: Mode; difficulty: DiffKey | "random"; key: number };

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  );
}

function Shell() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });

  return (
    <div className="font-body min-h-screen text-ink" style={{ color: "var(--color-ink)" }}>
      <div className="bg-stadium" aria-hidden />
      <div className="pitch-arc" aria-hidden />
      <div className="sheen-sweep" aria-hidden />

      {screen.name === "menu" && (
        <MenuScreen
          onMode={(m) => setScreen({ name: "difficulty", mode: m })}
          onHowTo={() => setScreen({ name: "howto" })}
          onAbout={() => setScreen({ name: "about" })}
        />
      )}
      {screen.name === "howto" && <HowToScreen onBack={() => setScreen({ name: "menu" })} />}
      {screen.name === "about" && <AboutScreen onBack={() => setScreen({ name: "menu" })} />}
      {screen.name === "difficulty" && (
        <DifficultyScreen
          mode={screen.mode}
          onBack={() => setScreen({ name: "menu" })}
          onPick={(d) => setScreen({ name: "game", mode: screen.mode, difficulty: d, key: Date.now() })}
        />
      )}
      {screen.name === "game" && (
        <GameScreen
          key={screen.key}
          mode={screen.mode}
          difficulty={screen.difficulty}
          onExit={() => setScreen({ name: "menu" })}
          onPlayAgain={() => setScreen({ name: "game", mode: screen.mode, difficulty: screen.difficulty, key: Date.now() })}
          onChangeDifficulty={() => setScreen({ name: "difficulty", mode: screen.mode })}
          onMenu={() => setScreen({ name: "menu" })}
        />
      )}
    </div>
  );
}
