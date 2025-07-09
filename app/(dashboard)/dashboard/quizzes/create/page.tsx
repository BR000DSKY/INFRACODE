"use client";

import { useState, type FormEvent } from "react";
import { PlusCircle, Trash2, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Quiz, Question, QuestionType } from "@/types";

const initialQuestion: Question = {
  id: crypto.randomUUID(),
  text: "",
  type: "QCM",
  options: [{ id: crypto.randomUUID(), text: "", isCorrect: false }],
  correctAnswer: "",
};

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30); // Default 30 minutes
  const [difficulty, setDifficulty] = useState<"Facile" | "Moyen" | "Difficile">("Moyen");
  const [questions, setQuestions] = useState<Question[]>([initialQuestion]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "QCM",
        options: [{ id: crypto.randomUUID(), text: "", isCorrect: false }],
        correctAnswer: "",
      },
    ]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    } else {
      toast({
        title: "Action impossible",
        description: "Un quiz doit contenir au moins une question.",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />,
      });
    }
  };

  const handleQuestionChange = (questionId: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              [field]: value,
              // Reset options and correctAnswer based on new type
              ...(field === "type" && {
                options:
                  value === "QCM" || value === "QRM"
                    ? [{ id: crypto.randomUUID(), text: "", isCorrect: false }]
                    : [],
                correctAnswer: ["Vrai/Faux", "Texte"].includes(value) ? "" : q.correctAnswer,
              }),
            }
          : q,
      ),
    );
  };

  const handleOptionChange = (questionId: string, optionId: string, field: "text" | "isCorrect", value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt) =>
                opt.id === optionId
                  ? { ...opt, [field]: value }
                  : q.type === "QCM" && field === "isCorrect" && value === true // For QCM, ensure only one correct option
                    ? { ...opt, isCorrect: false }
                    : opt,
              ),
            }
          : q,
      ),
    );
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), { id: crypto.randomUUID(), text: "", isCorrect: false }],
            }
          : q,
      ),
    );
  };

  const handleRemoveOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((opt) => opt.id !== optionId),
            }
          : q,
      ),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title.trim() || !description.trim() || questions.some((q) => !q.text.trim())) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir le titre, la description et le texte de toutes les questions.",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />,
      });
      setIsLoading(false);
      return;
    }

    const newQuiz: Quiz = {
      id: crypto.randomUUID(),
      title,
      description,
      questions,
      timeLimit,
      difficulty,
      createdBy: "enseignant_id_placeholder", // Replace with actual teacher ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      views: 0,
      completions: 0,
      averageScore: 0,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const existingQuizzes: Quiz[] = JSON.parse(localStorage.getItem("quizzes") || "[]");
    localStorage.setItem("quizzes", JSON.stringify([...existingQuizzes, newQuiz]));

    toast({
      title: "Quiz créé avec succès!",
      description: `Le quiz "${title}" a été ajouté.`,
      variant: "success",
      icon: <CheckCircle className="h-5 w-5" />,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTimeLimit(30);
    setDifficulty("Moyen");
    setQuestions([initialQuestion]);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Créer un Nouveau Quiz</CardTitle>
          <CardDescription>
            Remplissez les détails ci-dessous pour créer un nouveau quiz pour vos étudiants.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quiz-title" className="text-lg font-semibold">
                Titre du Quiz
              </Label>
              <Input
                id="quiz-title"
                placeholder="Ex: Introduction à JavaScript"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-description" className="text-lg font-semibold">
                Description
              </Label>
              <Textarea
                id="quiz-description"
                placeholder="Une brève description du contenu du quiz."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="text-base min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quiz-time-limit" className="text-lg font-semibold">
                  Temps Limite (minutes)
                </Label>
                <Input
                  id="quiz-time-limit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                  min="5"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-difficulty" className="text-lg font-semibold">
                  Difficulté
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(value: "Facile" | "Moyen" | "Difficile") => setDifficulty(value)}
                >
                  <SelectTrigger id="quiz-difficulty" className="text-base">
                    <SelectValue placeholder="Sélectionner la difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facile">Facile</SelectItem>
                    <SelectItem value="Moyen">Moyen</SelectItem>
                    <SelectItem value="Difficile">Difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h3 className="text-2xl font-semibold border-t pt-6 mt-6">Questions</h3>
            {questions.map((question, qIndex) => (
              <Card key={question.id} className="p-4 space-y-4 bg-secondary/30">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`question-text-${qIndex}`} className="text-xl font-semibold">
                    Question {qIndex + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.id)}
                    disabled={questions.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                  </Button>
                </div>
                <Textarea
                  id={`question-text-${qIndex}`}
                  placeholder="Texte de la question"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                  required
                  className="text-base min-h-[80px]"
                />
                <div className="space-y-2">
                  <Label htmlFor={`question-type-${qIndex}`} className="text-lg font-semibold">
                    Type de Question
                  </Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: QuestionType) => handleQuestionChange(question.id, "type", value)}
                  >
                    <SelectTrigger id={`question-type-${qIndex}`} className="text-base">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QCM">Choix Multiple (QCM)</SelectItem>
                      <SelectItem value="QRM">Réponses Multiples (QRM)</SelectItem>
                      <SelectItem value="Vrai/Faux">Vrai/Faux</SelectItem>
                      <SelectItem value="Texte">Réponse Courte (Texte)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {question.type === "QCM" && question.options && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary">
                    <Label className="text-lg font-semibold">Options (QCM)</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, "text", e.target.value)}
                          className="flex-grow text-base"
                          required
                        />
                        <input
                          type="radio"
                          name={`correct-option-${question.id}`}
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(question.id, option.id, "isCorrect", e.target.checked)}
                          className="form-radio h-5 w-5 text-primary focus:ring-primary border-gray-300"
                        />
                        <Label className="text-sm">Correct</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(question.id, option.id)}
                          disabled={question.options!.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddOption(question.id)}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Ajouter Option
                    </Button>
                  </div>
                )}

                {question.type === "QRM" && question.options && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary">
                    <Label className="text-lg font-semibold">Options (QRM)</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, "text", e.target.value)}
                          className="flex-grow text-base"
                          required
                        />
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(question.id, option.id, "isCorrect", e.target.checked)}
                          className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <Label className="text-sm">Correct</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(question.id, option.id)}
                          disabled={question.options!.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddOption(question.id)}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Ajouter Option
                    </Button>
                  </div>
                )}

                {question.type === "Vrai/Faux" && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <Label className="text-lg font-semibold">Réponse Correcte (Vrai/Faux)</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(value) => handleQuestionChange(question.id, "correctAnswer", value)}
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Sélectionner la réponse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vrai">Vrai</SelectItem>
                        <SelectItem value="Faux">Faux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {question.type === "Texte" && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <Label htmlFor={`correct-answer-text-${qIndex}`} className="text-lg font-semibold">
                      Réponse Correcte (Texte)
                    </Label>
                    <Input
                      id={`correct-answer-text-${qIndex}`}
                      placeholder="Entrer la réponse exacte attendue"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(question.id, "correctAnswer", e.target.value)}
                      className="text-base"
                      required
                    />
                  </div>
                )}
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={handleAddQuestion} className="w-full text-lg py-3">
              <PlusCircle className="h-5 w-5 mr-2" /> Ajouter une Question
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" size="lg" className="w-full text-lg py-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="h-5 w-5 mr-2 animate-spin" /> Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" /> Créer le Quiz
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}