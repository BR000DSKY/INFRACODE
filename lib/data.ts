import type { User, Project, Task, Quiz, QuizAttempt } from "@/types"

export const initialUsers: User[] = [
  {
    id: "user-1",
    name: "TEST1 Stagiaire",
    email: "TEST1@stagiaire.com",
    password: "password",
    username: "TEST_dev",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "DEV",
    role: "stagiaire",
    points: 250,
    badges: ["Premier Projet", "Collaborateur"],
  },
  {
    id: "user-2",
    name: "TEST2 Enseignant",
    email: "TEST2@enseignant.com",
    password: "password",
    username: "TEST2_prof",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "DEV",
    role: "enseignant",
    points: 0,
    badges: [],
  },
  {
    id: "user-3",
    name: "TEST3 Stagiaire",
    email: "TEST3@stagiaire.com",
    password: "password",
    username: "TEST3_dev",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "ID",
    role: "stagiaire",
    points: 320,
    badges: ["Premier Projet", "Quiz Master", "Collaborateur"],
  },
  {
    id: "user-4",
    name: "TEST4 Stagiaire",
    email: "TEST4@stagiaire.com",
    password: "password",
    username: "TEST4_dev",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "ID",
    role: "stagiaire",
    points: 180,
    badges: ["Premier Projet"],
  },
  {
    id: "user-5",
    name: "TEST5 Stagiaire",
    email: "TEST5@stagiaire.com",
    password: "password",
    username: "TEST5_dev",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "DEV",
    role: "stagiaire",
    points: 400,
    badges: ["Premier Projet", "Innovateur", "Collaborateur"],
  },
  {
    id: "user-6",
    name: "TEST6 Stagiaire",
    email: "TEST6@stagiaire.com",
    password: "password",
    username: "TEST6_dev",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "DEV", // Corrected based on TopStudentsSection
    role: "stagiaire",
    points: 350,
    badges: ["Premier Projet", "Mobile Expert"],
  },
  {
    id: "user-7",
    name: "TEST7 Stagiaire",
    email: "TEST7@stagiaire.com",
    password: "password",
    username: "TEST7_ai",
    logo: "/placeholder.png?width=150&height=150",
    filiereId: "DEV",
    role: "stagiaire",
    points: 500,
    badges: ["Premier Projet", "AI Specialist", "Innovateur"],
  },
]

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Core Security Components: Identity Verification, Access Control, and Resource Tracking",
    description:
      "Une plateforme d'apprentissage en ligne révolutionnaire avec des modules interactifs, des quiz et un suivi de progression personnalisé pour les étudiants du Pôle Digital.",
    goals:
      "Améliorer l'engagement des étudiants, faciliter l'accès aux ressources pédagogiques et personnaliser les parcours d'apprentissage.",
    banner: "/projet4.png?width=800&height=450",
    ownerId: "user-1",
    category: "Développement Digital",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    files: [
      {
        id: "f1",
        name: "doc.pdf",
        size: 1024,
        type: "application/pdf",
        url: "#",
        uploadedAt: new Date().toISOString(),
      },
    ],
    videos: [
      { id: "v1", name: "demo.mp4", size: 5000, type: "video/mp4", url: "#", uploadedAt: new Date().toISOString() },
    ],
    collaborators: [],
    comments: [],
    ratings: [],
    views: 120,
    likes: 15,
  },
  {
    id: "proj-2",
    title: "Dashboard de Monitoring Réseau Avancé",
    description:
      "Un outil de visualisation des performances réseau en temps réel, offrant des analyses détaillées, des alertes proactives et des rapports personnalisables pour l'infrastructure du Pôle.",
    goals:
      "Identifier rapidement les goulots d'étranglement, optimiser l'utilisation des ressources réseau et garantir une haute disponibilité des services.",
    banner: "/projet5.png?width=800&height=450",
    ownerId: "user-3",
    category: "Infrastructure Digitale",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    files: [],
    videos: [],
    collaborators: [],
    comments: [],
    ratings: [],
    views: 85,
    likes: 8,
  },
  {
    id: "proj-ahmed-1",
    title: "E-Commerce Platform",
    description: "Une plateforme e-commerce moderne développée avec React et Node.js.",
    goals: "Créer une solution e-commerce complète et scalable.",
    banner: "/projet1.png?width=800&height=450",
    ownerId: "user-5",
    category: "Développement Web",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    files: [
      {
        id: "ahmed-f1",
        name: "tech_spec.pdf",
        size: 2048,
        type: "application/pdf",
        url: "#",
        uploadedAt: new Date().toISOString(),
      },
    ],
    videos: [],
    collaborators: [],
    comments: [],
    ratings: [],
    views: 1250,
    likes: 89,
  },
  {
    id: "proj-fatima-1",
    title: "AAA Framework: Authentication, Authorization, and Accounting",
    description: "Application mobile de banking développée avec Flutter.",
    goals: "Développer une application bancaire mobile sécurisée.",
    banner: "/projet2.png?width=800&height=450",
    ownerId: "user-6",
    category: "Développement Mobile",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    files: [],
    videos: [
      {
        id: "fatima-v1",
        name: "app_demo.mp4",
        size: 10240,
        type: "video/mp4",
        url: "#",
        uploadedAt: new Date().toISOString(),
      },
    ],
    collaborators: [],
    comments: [],
    ratings: [],
    views: 980,
    likes: 67,
  },
  {
    id: "proj-youssef-1",
    title: "AI Chatbot",
    description: "Chatbot intelligent développé avec Python et TensorFlow.",
    goals: "Créer un assistant virtuel intelligent.",
    banner: "/projet3.png?width=800&height=450",
    ownerId: "user-7",
    category: "Intelligence Artificielle",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    files: [],
    videos: [],
    collaborators: [],
    comments: [],
    ratings: [],
    views: 1500,
    likes: 120,
  },
]

export const initialTasks: Task[] = [
  {
    id: "task-1",
    name: "Mettre en place la base de données",
    completed: true,
    dueDate: "2025-06-10",
    projectId: "proj-1",
  },
  {
    id: "task-2",
    name: "Développer le module d'authentification",
    completed: true,
    dueDate: "2025-06-11",
    projectId: "proj-1",
  },
  { id: "task-3", name: "Créer le design du dashboard", completed: false, dueDate: "2025-06-15", projectId: "proj-2" },
]

export const initialQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Les Bases du Développement Web",
    description: "Testez vos connaissances sur les fondamentaux du développement web, HTML, CSS et JavaScript.",
    teacherId: "user-2",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Développement Web",
    difficulty: "Facile",
    timeLimit: 10, // minutes
    questions: [
      {
        id: "q1-1",
        text: "Que signifie HTML ?",
        type: "qcm",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
      },
      {
        id: "q1-2",
        text: "Quelle propriété CSS est utilisée pour changer la couleur de fond d'un élément ?",
        type: "qcm",
        options: ["color", "background-color", "bgcolor", "font-color"],
        correctAnswer: "background-color",
      },
      {
        id: "q1-3",
        text: "JavaScript est un langage de programmation orienté objet.",
        type: "truefalse",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
      },
      {
        id: "q1-4",
        text: "Que signifie CSS ?",
        type: "qcm",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correctAnswer: "Cascading Style Sheets",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Réseaux Informatiques",
    description: "Évaluez votre compréhension des concepts fondamentaux des réseaux informatiques et des protocoles.",
    teacherId: "user-2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Infrastructure Digitale",
    difficulty: "Moyen",
    timeLimit: 15,
    questions: [
      {
        id: "q2-1",
        text: "Que signifie IP ?",
        type: "qcm",
        options: ["Internet Protocol", "Internal Processing", "Intranet Provider", "Information Pathway"],
        correctAnswer: "Internet Protocol",
      },
      {
        id: "q2-2",
        text: "Quel est le port par défaut pour HTTP ?",
        type: "text",
        correctAnswer: "80",
      },
    ],
  },
]

// Sample Quiz Attempts Data
export const initialQuizAttempts: QuizAttempt[] = [
  {
    id: "attempt-1",
    quizId: "quiz-1",
    userId: "user-1", // Alice
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
    userId: "user-3", // Carlos
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
    userId: "user-1", // Alice
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
    userId: "user-5", // Ahmed
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
    userId: "user-6", // Fatima
    answers: [
      { questionId: "q2-1", answer: "Internet Protocol" },
      { questionId: "q2-2", answer: "443" }, // Incorrect
    ],
    score: 1,
    totalQuestions: 2,
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    timeTaken: 12,
  },
]
