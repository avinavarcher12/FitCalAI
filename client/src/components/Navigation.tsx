import { Brain, Activity } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

export default function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    console.log("Scrolling to:", id);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <Activity className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">FitAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("features")}
              data-testid="nav-features"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("bmi-calculator")}
              data-testid="nav-bmi"
            >
              BMI
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("exercises")}
              data-testid="nav-exercises"
            >
              Exercises
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("calories")}
              data-testid="nav-calories"
            >
              Calories
            </Button>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
