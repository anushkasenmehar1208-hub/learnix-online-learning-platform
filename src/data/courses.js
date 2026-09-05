const courses = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    category: "Web Development",
    popular:true,
    description: "Learn how to build complete web applications from frontend to backend using modern web technologies.",
    instructor: "Alex",
    duration: "32 hours",
    students: 12450,
    rating: 4.8,
    image: "💻",
    lesson:10,
    whatYouWillLearn: [
      "Build responsive websites",
      "Work with JavaScript and React",
      "Create backend APIs with Node.js",
      "Work with databases",
      "Deploy full-stack applications"
    ]
  },
  {
    id: 2,
    title: "React.js From Zero to Advanced",
    category: "Web Development",
    popular: true,
    description: "Learn React from the basics and gradually move into advanced concepts used in modern web applications.",
    instructor: "Sarah",
    duration: "24 hours",
    students: 18320,
    rating: 4.9,
    image: "⚛️",
    lesson:12,
    whatYouWillLearn: [
      "Build React components",
      "Understand props and state",
      "Work with React Hooks",
      "Build reusable UI components",
      "Create real-world React applications"
    ]
  },
  {
    id: 3,
    title: "Python Programming Masterclass",
    category: "Programming",
    popular: true,
    description: "Master Python programming from the fundamentals to advanced concepts through practical examples and projects.",
    instructor: "Daniel",
    duration: "28 hours",
    students: 15680,
    rating: 4.8,
    image: "🐍",
    lesson:13,
    whatYouWillLearn: [
      "Learn Python fundamentals",
      "Work with functions and modules",
      "Understand object-oriented programming",
      "Work with files and APIs",
      "Build Python projects"
    ]
  },
  {
    id: 4,
    title: "JavaScript Essentials",
    category: "Programming",
    popular: false,
    description: "Build a strong foundation in JavaScript and learn the core concepts needed for modern web development.",
    instructor: "Michael",
    duration: "18 hours",
    students: 9820,
    rating: 4.7,
    image: "🟨",
    lesson:18,
    whatYouWillLearn: [
      "Understand JavaScript fundamentals",
      "Work with arrays and objects",
      "Use functions and events",
      "Manipulate the DOM",
      "Work with asynchronous JavaScript"
    ]
  },
  {
    id: 5,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    popular: true,
    description: "Learn the fundamentals of user interface and user experience design and create clean, user-friendly digital products.",
    instructor: "Emma",
    duration: "16 hours",
    students: 7640,
    rating: 4.6,
    image: "🎨",
    lesson:19,
    whatYouWillLearn: [
      "Understand UI and UX principles",
      "Create user flows and wireframes",
      "Design modern interfaces",
      "Understand typography and color",
      "Create interactive prototypes"
    ]
  },
  {
    id: 6,
    title: "Machine Learning with Python",
    category: "AI & ML",
    popular: true,
    description: "Learn machine learning concepts and build practical models using Python and popular machine learning libraries.",
    instructor: "James",
    duration: "35 hours",
    students: 11250,
    rating: 4.8,
    image: "🤖",
    lesson:20,
    whatYouWillLearn: [
      "Understand machine learning fundamentals",
      "Prepare and clean datasets",
      "Build regression and classification models",
      "Evaluate machine learning models",
      "Build practical ML projects"
    ]
  },
  {
    id: 7,
    title: "Data Science with Python",
    category: "Data Science",
    description: "Learn how to analyze, visualize, and understand data using Python and popular data science tools.",
    instructor: "Olivia",
    duration: "30 hours",
    students: 8930,
    rating: 4.7,
    lesson:13,
    image: "📊",
    whatYouWillLearn: [
      "Work with NumPy and Pandas",
      "Clean and prepare datasets",
      "Create data visualizations",
      "Perform exploratory data analysis",
      "Work with real-world datasets"
    ]
  },
  {
    id: 8,
    title: "SQL & Database Design",
    category: "Database",
    description: "Learn SQL and database design from the basics and understand how modern applications store and retrieve data.",
    instructor: "Robert",
    duration: "14 hours",
    students: 6740,
    rating: 4.6,
    lesson:21,
    image: "🗄️",
    whatYouWillLearn: [
      "Write SQL queries",
      "Create and manage databases",
      "Understand relationships between tables",
      "Use joins and subqueries",
      "Design efficient database structures"
    ]
  },
  {
    id: 9,
    title: "Git & GitHub for Developers",
    category: "Development",
    description: "Learn Git and GitHub and understand how developers manage, collaborate on, and maintain their code.",
    instructor: "Chris",
    duration: "8 hours",
    students: 14350,
    rating: 4.9,
    image: "🐙",
    lesson:22,
    whatYouWillLearn: [
      "Understand Git fundamentals",
      "Create and manage repositories",
      "Work with branches",
      "Create pull requests",
      "Collaborate with other developers"
    ]
  },
  {
    id: 10,
    title: "Node.js & Express Backend Development",
    category: "Backend",
    description: "Learn how to build powerful backend applications and REST APIs using Node.js and Express.",
    instructor: "Ryan",
    duration: "22 hours",
    students: 7210,
    rating: 4.7,
    image: "🟢",
    lesson:20,
    whatYouWillLearn: [
      "Understand Node.js fundamentals",
      "Build REST APIs",
      "Work with Express.js",
      "Connect applications to databases",
      "Handle authentication and APIs"
    ]
  },
  {
    id: 11,
    title: "Figma for UI Designers",
    category: "Design",
    description: "Learn how to use Figma to design modern interfaces, create prototypes, and collaborate with other designers.",
    instructor: "Sophia",
    duration: "12 hours",
    students: 5860,
    rating: 4.8,
    image: "🖌️",
    lesson:9,
    whatYouWillLearn: [
      "Understand the Figma interface",
      "Create UI designs",
      "Use components and auto layout",
      "Create interactive prototypes",
      "Collaborate with design teams"
    ]
  },
  {
    id: 12,
    title: "C Programming Fundamentals",
    category: "Programming",
    description: "Build a strong foundation in C programming and understand the core concepts behind low-level programming.",
    instructor: "Harris",
    duration: "20 hours",
    students: 6340,
    rating: 4.6,
    image: "⚙️",
    lesson:13,
    whatYouWillLearn: [
      "Learn C syntax and fundamentals",
      "Work with arrays and strings",
      "Understand pointers",
      "Work with structures",
      "Use dynamic memory allocation"
    ]
  },
];

const categories = [
  "All",
  "Web Development",
  "Programming",
  "Design",
  "AI & ML",
  "Data Science",
  "Database",
  "Backend"
]
export { courses, categories };