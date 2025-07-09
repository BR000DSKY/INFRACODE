"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { BarChart, Users, CheckCircle, Percent, Clock, HelpCircle, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Quiz, QuizAttempt } from "@/types";
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Mock user data mapping userId to names
const userMap: { [key: string]: string } = {
  "user-1": "TEST1",
  "user-3": "TEST2",
  "user-5": "TEST3",
  "user-6": "TEST4",
};

// Sample Quiz Attempts Data
export const initialQuizAttempts: QuizAttempt[] = [
  {
    id: "attempt-1",
    quizId: "quiz-1",
    userId: "user-1", 
    answers: [
      { questionId: "q1-1", answer: "Hyper Text Markup Language" },
      { questionId: "q1-2", answer: "background-color" },
      { questionId: "q1-3", answer: "Vrai" },
    ],
    score: 3,
    totalQuestions: 3,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 5, // minutes
  },
  {
    id: "attempt-2",
    quizId: "quiz-1",
    userId: "user-3",
    answers: [
      { questionId: "q1-1", answer: "Hyper Text Markup Language" },
      { questionId: "q1-2", answer: "color" }, // Incorrect
      { questionId: "q1-3", answer: "Vrai" },
    ],
    score: 2,
    totalQuestions: 3,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 7,
  },
  {
    id: "attempt-3",
    quizId: "quiz-2",
    userId: "user-1",
    answers: [
      { questionId: "q2-1", answer: "Internet Protocol" },
      { questionId: "q2-2", answer: "80" },
    ],
    score: 2,
    totalQuestions: 2,
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    timeTaken: 10,
  },
  {
    id: "attempt-4",
    quizId: "quiz-1",
    userId: "user-5",
    answers: [
      { questionId: "q1-1", answer: "Hyper Text Markup Language" },
      { questionId: "q1-2", answer: "background-color" },
      { questionId: "q1-3", answer: "Vrai" },
    ],
    score: 3,
    totalQuestions: 3,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 4,
  },
  {
    id: "attempt-5",
    quizId: "quiz-2",
    userId: "user-6", 
    answers: [
      { questionId: "q2-1", answer: "Internet Protocol" },
      { questionId: "q2-2", answer: "443" }, // Incorrect
    ],
    score: 1,
    totalQuestions: 2,
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    timeTaken: 12,
  },
];

// Mock quiz questions to determine correct answers
const quizQuestions = [
  {
    id: "q1-1",
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    id: "q1-2",
    correctAnswer: "background-color",
  },
  {
    id: "q1-3",
    correctAnswer: "Vrai",
  },
  {
    id: "q2-1",
    correctAnswer: "Internet Protocol",
  },
  {
    id: "q2-2",
    correctAnswer: "80",
  },
];

export default function QuizResultsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock quizzes data - replace with actual data or fetch from backend
    const storedQuizzes: Quiz[] = [
      { id: "quiz-1", title: "Quiz Développement Web", published: true },
      { id: "quiz-2", title: "Quiz Réseaux", published: true },
    ];
    setQuizzes(storedQuizzes);

    // Use initialQuizAttempts instead of mock data
    const enhancedAttempts = initialQuizAttempts.map((attempt) => {
      const correctAnswers = attempt.answers.filter((a) =>
        quizQuestions.find((q) => q.id === a.questionId)?.correctAnswer === a.answer
      ).length;
      const incorrectAnswers = attempt.totalQuestions - correctAnswers;
      return {
        ...attempt,
        studentName: userMap[attempt.userId] || `User ${attempt.userId.split("-")[1]}`, // Use mapped name or fallback
        correctAnswers,
        incorrectAnswers,
      };
    });
    setAllAttempts(enhancedAttempts);

    if (storedQuizzes.length > 0) {
      setSelectedQuizId(storedQuizzes[0].id);
    }
  }, []);

  const selectedQuizAttempts = useMemo(() => {
    if (!selectedQuizId) return [];
    return allAttempts
      .filter((attempt) => attempt.quizId === selectedQuizId)
      .filter((attempt) => attempt.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [selectedQuizId, allAttempts, searchTerm]);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  const overallStats = useMemo(() => {
    if (allAttempts.length === 0) return { totalAttempts: 0, avgScore: 0, avgCompletionRate: 0, uniqueParticipants: 0 };
    const totalScore = allAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0);
    const uniqueParticipants = new Set(allAttempts.map((a) => a.userId)).size;
    return {
      totalAttempts: allAttempts.length,
      avgScore: Number.parseFloat((totalScore / allAttempts.length).toFixed(1)) || 0,
      avgCompletionRate: Number.parseFloat(
        (allAttempts.reduce((sum, attempt) => sum + (attempt.correctAnswers / attempt.totalQuestions) * 100, 0) /
          allAttempts.length).toFixed(1)
      ) || 0,
      uniqueParticipants,
    };
  }, [allAttempts]);

  const quizSpecificStats = useMemo(() => {
    if (selectedQuizAttempts.length === 0 || !selectedQuiz) return { avgScore: 0, completionRate: 0, avgTime: "N/A" };
    const totalScore = selectedQuizAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0);
    const totalCorrect = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.correctAnswers, 0);
    const totalPossible = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const totalTime = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
    const avgTimeSeconds = (totalTime / selectedQuizAttempts.length) * 60; // Convert to seconds
    const minutes = Math.floor(avgTimeSeconds / 60);
    const seconds = Math.floor(avgTimeSeconds % 60);

    return {
      avgScore: Number.parseFloat((totalScore / selectedQuizAttempts.length).toFixed(1)) || 0,
      completionRate: Number.parseFloat(((totalCorrect / totalPossible) * 100).toFixed(1)) || 0,
      avgTime: `${minutes}m ${seconds}s`,
    };
  }, [selectedQuizAttempts, selectedQuiz]);

  const scoreDistribution = useMemo(() => {
    if (selectedQuizAttempts.length === 0) return [];
    const distribution = [
      { range: "0-20%", count: 0 },
      { range: "21-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ];
    selectedQuizAttempts.forEach((attempt) => {
      const percentage = (attempt.score / attempt.totalQuestions) * 100;
      if (percentage <= 20) distribution[0].count++;
      else if (percentage <= 40) distribution[1].count++;
      else if (percentage <= 60) distribution[2].count++;
      else if (percentage <= 80) distribution[3].count++;
      else distribution[4].count++;
    });
    return distribution;
  }, [selectedQuizAttempts]);

  // Function to convert data to CSV
  const exportToCSV = () => {
    if (selectedQuizAttempts.length === 0) return;

    const headers = ["Étudiant", "Score", "Bonnes Réponses", "Mauvaises Réponses", "Date", "Temps Pris"];
    const data = selectedQuizAttempts.map((attempt) => [
      attempt.studentName,
      `${((attempt.score / attempt.totalQuestions) * 100).toFixed(0)}%`,
      attempt.correctAnswers,
      attempt.incorrectAnswers,
      format(new Date(attempt.completedAt), "dd MMM yyyy, HH:mm", { locale: fr }),
      `${Math.floor(attempt.timeTaken)}m ${attempt.timeTaken % 60}s`,
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `results_${selectedQuiz?.title || "quiz"}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Résultats des Quiz</CardTitle>
          <CardDescription>Analysez les performances des étudiants sur les quiz publiés.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BarChart} title="Tentatives Totales" value={overallStats.totalAttempts.toString()} />
          <StatCard icon={Users} title="Participants Uniques" value={overallStats.uniqueParticipants.toString()} />
          <StatCard icon={Percent} title="Score Moyen (Tous Quiz)" value={`${overallStats.avgScore}%`} />
          <StatCard icon={CheckCircle} title="Taux Réussite Moyen" value={`${overallStats.avgCompletionRate}%`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold">Résultats par Quiz</CardTitle>
              <CardDescription>Sélectionnez un quiz pour voir les détails des performances.</CardDescription>
            </div>
            {quizzes.length > 0 ? (
              <Select value={selectedQuizId || ""} onValueChange={setSelectedQuizId}>
                <SelectTrigger className="w-full md:w-[300px] text-base py-3">
                  <SelectValue placeholder="Sélectionner un quiz" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id} className="text-base">
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">Aucun quiz publié pour afficher les résultats.</p>
            )}
          </div>
        </CardHeader>
        {selectedQuizId && selectedQuiz ? (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard icon={Percent} title="Score Moyen (Quiz)" value={`${quizSpecificStats.avgScore}%`} />
              <StatCard
                icon={CheckCircle}
                title="Taux Réussite (Quiz)"
                value={`${quizSpecificStats.completionRate}%`}
              />
              <StatCard icon={Clock} title="Temps Moyen" value={quizSpecificStats.avgTime} />
            </div>

            {selectedQuizAttempts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Distribution des Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={scoreDistribution}>
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#333", // Dark background for dark mode compatibility
                        color: "#fff", // White text for contrast
                        border: "1px solid #ccc",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar dataKey="count" fill="#FF9500" name="Nombre d'étudiants" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un étudiant..."
                  className="w-full md:w-1/2 lg:w-1/3 pl-10 text-base py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {selectedQuizAttempts.length === 0 ? (
              <div className="text-center py-10">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                  Aucune tentative pour ce quiz ou correspondant à votre recherche.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-lg">Étudiant</TableHead>
                      <TableHead className="text-lg">Score</TableHead>
                      <TableHead className="text-lg">Bonnes Réponses</TableHead>
                      <TableHead className="text-lg">Mauvaises Réponses</TableHead>
                      <TableHead className="text-lg">Date</TableHead>
                      <TableHead className="text-lg">Temps Pris</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuizAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium text-base py-3">{attempt.studentName}</TableCell>
                        <TableCell className="text-base py-3">{((attempt.score / attempt.totalQuestions) * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-green-600 text-base py-3">{attempt.correctAnswers}</TableCell>
                        <TableCell className="text-red-600 text-base py-3">{attempt.incorrectAnswers}</TableCell>
                        <TableCell className="text-base py-3">
                          {format(new Date(attempt.completedAt), "dd MMM yyyy, HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell className="text-base py-3">
                          {Math.floor(attempt.timeTaken)}m {attempt.timeTaken % 60}s
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" /> Exporter les Résultats (CSV)
              </Button>
            </div>
          </CardContent>
        ) : (
          !quizzes.length &&
          !allAttempts.length && (
            <CardContent className="text-center py-10">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">
                Veuillez sélectionner un quiz pour afficher les résultats.
              </p>
            </CardContent>
          )
        )}
      </Card>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description?: string;
}

function StatCard({ icon: Icon, title, value, description }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}