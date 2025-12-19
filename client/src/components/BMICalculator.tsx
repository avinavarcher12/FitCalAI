import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BMIResult {
  bmi: number;
  category: string;
  recommendation: string;
}

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { height: string; weight: string; age: string; gender: string }) => {
      const response = await apiRequest("POST", "/api/bmi/analyze", data);
      return response.json();
    },
    onSuccess: (data: BMIResult) => {
      setResult(data);
    }
  });

  const handleCalculate = () => {
    if (!height || !weight) return;
    analyzeMutation.mutate({ height, weight, age, gender });
  };

  const getColorClass = (category: string) => {
    switch (category) {
      case "Underweight": return "text-chart-2";
      case "Normal": return "text-chart-1";
      case "Overweight": return "text-chart-5";
      case "Obese": return "text-destructive";
      default: return "text-foreground";
    }
  };

  const getBMIProgress = () => {
    if (!result) return 0;
    return Math.min((result.bmi / 40) * 100, 100);
  };

  return (
    <Card id="bmi-calculator" className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">BMI Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate your Body Mass Index and get AI-powered health insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" data-testid="label-height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              data-testid="input-height"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight" data-testid="label-weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              data-testid="input-weight"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age" data-testid="label-age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              data-testid="input-age"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender" data-testid="label-gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender" data-testid="select-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={handleCalculate}
          className="w-full"
          disabled={!height || !weight || analyzeMutation.isPending}
          data-testid="button-calculate-bmi"
        >
          {analyzeMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI is analyzing...
            </>
          ) : (
            "Calculate BMI"
          )}
        </Button>
        
        {result && (
          <div className="space-y-4 p-6 bg-card border border-card-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your BMI</p>
                <p className={`text-4xl font-medium ${getColorClass(result.category)}`} data-testid="text-bmi-result">
                  {result.bmi}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className={`text-xl font-medium ${getColorClass(result.category)}`} data-testid="text-bmi-category">
                  {result.category}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <Progress value={getBMIProgress()} className="h-3" data-testid="progress-bmi" />
            </div>
            
            <div className="flex items-start gap-2 p-4 bg-accent rounded-md">
              <TrendingUp className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-accent-foreground">AI Health Insight</p>
                <p className="text-sm text-accent-foreground/80" data-testid="text-ai-recommendation">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {analyzeMutation.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            Failed to analyze BMI. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
