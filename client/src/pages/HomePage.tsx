import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import DashboardStats from "@/components/DashboardStats";
import BMICalculator from "@/components/BMICalculator";
import ExerciseRecommendation from "@/components/ExerciseRecommendation";
import CalorieTracker from "@/components/CalorieTracker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BMICalculator />
            <CalorieTracker />
          </div>
          
          <ExerciseRecommendation />
        </div>
      </main>
      
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 FitAI. Your AI-powered fitness companion.
          </p>
        </div>
      </footer>
    </div>
  );
}
