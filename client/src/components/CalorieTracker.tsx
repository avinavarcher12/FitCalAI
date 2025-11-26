import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Apple, Loader2, Sparkles } from "lucide-react";

interface CalorieResult {
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  analysis: string;
}

export default function CalorieTracker() {
  const [mealDescription, setMealDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CalorieResult | null>(null);

  const handleAnalyzeMeal = () => {
    if (!mealDescription.trim()) return;
    
    setIsAnalyzing(true);
    console.log("Analyzing meal:", mealDescription);
    
    setTimeout(() => {
      const mockResult: CalorieResult = {
        totalCalories: 650,
        protein: 35,
        carbs: 45,
        fats: 20,
        analysis: "Your meal contains a balanced mix of nutrients. The grilled chicken provides quality protein for muscle recovery, while the vegetables offer essential vitamins and fiber. Consider adding a small portion of healthy fats like avocado for sustained energy."
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getTotalMacros = () => {
    if (!result) return 0;
    return result.protein + result.carbs + result.fats;
  };

  return (
    <Card id="calories" className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Apple className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">AI Calorie Tracker</CardTitle>
        </div>
        <CardDescription>
          Describe your meal and get instant AI-powered calorie and nutrition analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meal-description" data-testid="label-meal">
            Describe Your Meal
          </Label>
          <Textarea
            id="meal-description"
            placeholder="E.g., Grilled chicken breast with brown rice and steamed broccoli"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            rows={4}
            data-testid="textarea-meal-description"
          />
        </div>
        
        <Button
          onClick={handleAnalyzeMeal}
          className="w-full"
          disabled={!mealDescription.trim() || isAnalyzing}
          data-testid="button-analyze-meal"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI is analyzing nutrition...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>
        
        {result && (
          <div className="space-y-4 p-6 bg-card border border-card-border rounded-lg">
            <div className="text-center pb-4 border-b border-border">
              <p className="text-sm text-muted-foreground">Total Calories</p>
              <p className="text-5xl font-medium text-primary" data-testid="text-total-calories">
                {result.totalCalories}
              </p>
              <p className="text-sm text-muted-foreground">kcal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-protein">
                    {result.protein}g ({Math.round((result.protein / getTotalMacros()) * 100)}%)
                  </span>
                </div>
                <Progress 
                  value={(result.protein / getTotalMacros()) * 100} 
                  className="h-2 bg-muted"
                  data-testid="progress-protein"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Carbohydrates</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-carbs">
                    {result.carbs}g ({Math.round((result.carbs / getTotalMacros()) * 100)}%)
                  </span>
                </div>
                <Progress 
                  value={(result.carbs / getTotalMacros()) * 100} 
                  className="h-2 bg-muted"
                  data-testid="progress-carbs"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fats</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-fats">
                    {result.fats}g ({Math.round((result.fats / getTotalMacros()) * 100)}%)
                  </span>
                </div>
                <Progress 
                  value={(result.fats / getTotalMacros()) * 100} 
                  className="h-2 bg-muted"
                  data-testid="progress-fats"
                />
              </div>
            </div>
            
            <div className="p-4 bg-accent rounded-md">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-accent-foreground mb-1">
                    AI Nutritional Analysis
                  </p>
                  <p className="text-sm text-accent-foreground/80" data-testid="text-ai-analysis">
                    {result.analysis}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log("Meal saved to history");
                setMealDescription("");
                setResult(null);
              }}
              data-testid="button-save-meal"
            >
              Save to History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
