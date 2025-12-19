import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Apple, Loader2, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CalorieResult {
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  analysis: string;
}

export default function CalorieTracker() {
  const [mealDescription, setMealDescription] = useState("");
  const [result, setResult] = useState<CalorieResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await apiRequest("POST", "/api/calories/analyze", { mealDescription: description });
      return response.json();
    },
    onSuccess: (data: CalorieResult) => {
      setResult(data);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!result) return;
      const response = await apiRequest("POST", "/api/meals/log", {
        mealDescription,
        totalCalories: result.totalCalories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
        aiAnalysis: result.analysis
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Meal Saved",
        description: "Your meal has been logged to history."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meals/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/dashboard"] });
      setMealDescription("");
      setResult(null);
    }
  });

  const handleAnalyzeMeal = () => {
    if (!mealDescription.trim()) return;
    analyzeMutation.mutate(mealDescription);
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
          disabled={!mealDescription.trim() || analyzeMutation.isPending}
          data-testid="button-analyze-meal"
        >
          {analyzeMutation.isPending ? (
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
                    {result.protein}g ({Math.round((result.protein / getTotalMacros()) * 100) || 0}%)
                  </span>
                </div>
                <Progress 
                  value={(result.protein / getTotalMacros()) * 100 || 0} 
                  className="h-2 bg-muted"
                  data-testid="progress-protein"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Carbohydrates</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-carbs">
                    {result.carbs}g ({Math.round((result.carbs / getTotalMacros()) * 100) || 0}%)
                  </span>
                </div>
                <Progress 
                  value={(result.carbs / getTotalMacros()) * 100 || 0} 
                  className="h-2 bg-muted"
                  data-testid="progress-carbs"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fats</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-fats">
                    {result.fats}g ({Math.round((result.fats / getTotalMacros()) * 100) || 0}%)
                  </span>
                </div>
                <Progress 
                  value={(result.fats / getTotalMacros()) * 100 || 0} 
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
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              data-testid="button-save-meal"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save to History"
              )}
            </Button>
          </div>
        )}

        {analyzeMutation.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            Failed to analyze meal. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
