import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Heart, Zap, Target, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "cardio" | "strength" | "flexibility";
  description: string;
}

export default function ExerciseRecommendation() {
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { toast } = useToast();

  const recommendMutation = useMutation({
    mutationFn: async (data: { fitnessLevel: string; goal: string }) => {
      const response = await apiRequest("POST", "/api/exercises/recommend", data);
      return response.json();
    },
    onSuccess: (data: Exercise[]) => {
      setExercises(data);
    }
  });

  const logMutation = useMutation({
    mutationFn: async (exercise: Exercise) => {
      const response = await apiRequest("POST", "/api/exercises/log", {
        exerciseName: exercise.name,
        duration: exercise.duration,
        difficulty: exercise.difficulty,
        exerciseType: exercise.type
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exercise Logged",
        description: "Your workout has been saved to history."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/exercises/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/dashboard"] });
    }
  });

  const handleGetRecommendations = () => {
    if (!fitnessLevel || !goal) return;
    recommendMutation.mutate({ fitnessLevel, goal });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-chart-1 text-primary-foreground";
      case "intermediate": return "bg-chart-5 text-primary-foreground";
      case "advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cardio": return Heart;
      case "strength": return Dumbbell;
      case "flexibility": return Zap;
      default: return Dumbbell;
    }
  };

  return (
    <Card id="exercises" className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">AI Exercise Recommendations</CardTitle>
        </div>
        <CardDescription>
          Get personalized workout suggestions powered by AI based on your fitness level and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fitness-level" data-testid="label-fitness-level">Fitness Level</Label>
            <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
              <SelectTrigger id="fitness-level" data-testid="select-fitness-level">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal" data-testid="label-goal">Fitness Goal</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger id="goal" data-testid="select-goal">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={handleGetRecommendations}
          className="w-full"
          disabled={!fitnessLevel || !goal || recommendMutation.isPending}
          data-testid="button-get-recommendations"
        >
          {recommendMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI is generating recommendations...
            </>
          ) : (
            "Get AI Recommendations"
          )}
        </Button>
        
        {exercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise, index) => {
              const Icon = getTypeIcon(exercise.type);
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-exercise-${index}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {exercise.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {exercise.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exercise.description}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full mt-2"
                      onClick={() => logMutation.mutate(exercise)}
                      disabled={logMutation.isPending}
                      data-testid={`button-log-${index}`}
                    >
                      {logMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Log This Exercise"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {recommendMutation.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            Failed to get recommendations. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
