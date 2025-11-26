import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Heart, Zap, Target, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Exercise {
  id: string;
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "cardio" | "strength" | "flexibility";
  icon: typeof Heart;
  description: string;
}

export default function ExerciseRecommendation() {
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleGetRecommendations = () => {
    setIsLoading(true);
    console.log("Getting AI recommendations for:", { fitnessLevel, goal });
    
    setTimeout(() => {
      const mockExercises: Exercise[] = [
        {
          id: "1",
          name: "Brisk Walking",
          duration: "30 mins",
          difficulty: "beginner",
          type: "cardio",
          icon: Heart,
          description: "Start with a comfortable pace to boost your cardiovascular health and burn calories."
        },
        {
          id: "2",
          name: "Bodyweight Squats",
          duration: "3 sets of 12",
          difficulty: "beginner",
          type: "strength",
          icon: Dumbbell,
          description: "Build leg strength and improve your metabolism with this fundamental exercise."
        },
        {
          id: "3",
          name: "Yoga Flow",
          duration: "20 mins",
          difficulty: "beginner",
          type: "flexibility",
          icon: Zap,
          description: "Enhance flexibility and reduce stress with guided stretching sequences."
        },
        {
          id: "4",
          name: "Push-ups",
          duration: "3 sets of 10",
          difficulty: "intermediate",
          type: "strength",
          icon: Dumbbell,
          description: "Strengthen your upper body and core muscles with proper form."
        }
      ];
      
      setExercises(mockExercises);
      setIsLoading(false);
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-chart-1 text-primary-foreground";
      case "intermediate": return "bg-chart-5 text-primary-foreground";
      case "advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
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
          Get personalized workout suggestions based on your fitness level and goals
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
          disabled={!fitnessLevel || !goal || isLoading}
          data-testid="button-get-recommendations"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI is analyzing...
            </>
          ) : (
            "Get AI Recommendations"
          )}
        </Button>
        
        {exercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise) => {
              const Icon = exercise.icon;
              return (
                <Card key={exercise.id} className="hover-elevate" data-testid={`card-exercise-${exercise.id}`}>
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
                      onClick={() => console.log("Log exercise:", exercise.name)}
                      data-testid={`button-log-${exercise.id}`}
                    >
                      Log This Exercise
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
