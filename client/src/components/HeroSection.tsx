import { Button } from "@/components/ui/button";
import { Activity, Brain } from "lucide-react";
import heroImage from "@assets/generated_images/fitness_app_hero_image.png";

export default function HeroSection() {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
    const element = document.getElementById("bmi-calculator");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked");
    const element = document.getElementById("features");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-96 w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-10 h-10 text-primary-foreground" />
          <Activity className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Your AI-Powered Fitness Companion
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          Get personalized exercise recommendations, track your calories with AI, and monitor your health metrics - all in one place
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground border border-primary-border hover-elevate active-elevate-2"
            onClick={handleGetStarted}
            data-testid="button-get-started"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-background/20 backdrop-blur-md text-white border-white/30 hover-elevate active-elevate-2"
            onClick={handleLearnMore}
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
