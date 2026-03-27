export type Question = {
  id: number;
  q: string;
  a: string;
  askedBy: string[];
  difficulty: "Easy" | "Medium" | "Hard";
};

const companies = ["Google", "Microsoft", "Amazon", "Flipkart", "Uber", "Facebook", "TCS", "Infosys", "Deloitte", "IBM"];
const difficulties: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];

const getRandomCompany = () => {
  const shuffled = [...companies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
};

const getRandomDifficulty = () => difficulties[Math.floor(Math.random() * difficulties.length)];

// Common Behavioral Questions (20 questions)
const behavioralQuestions = [
  { q: "Tell me about yourself.", a: "Focus on your professional journey, key achievements, and why you are interested in this role." },
  { q: "What are your greatest strengths?", a: "Mention strengths relevant to the job, such as problem-solving, adaptability, or leadership, and provide examples." },
  { q: "What are your greatest weaknesses?", a: "Choose a real weakness but explain how you are working to improve it." },
  { q: "Why do you want to work for this company?", a: "Show that you have researched the company's values, products, and culture." },
  { q: "Describe a challenging situation and how you handled it.", a: "Use the STAR method (Situation, Task, Action, Result) to structure your answer." },
  { q: "Where do you see yourself in 5 years?", a: "Align your career goals with the company's growth and opportunities." },
  { q: "Why are you leaving your current job?", a: "Focus on seeking new challenges or growth opportunities rather than negativity about your current employer." },
  { q: "How do you handle stress and pressure?", a: "Discuss techniques like prioritization, time management, or taking short breaks." },
  { q: "Describe a time you failed. How did you handle it?", a: "Focus on what you learned from the failure and how you improved." },
  { q: "How do you prioritize your work?", a: "Mention tools or methods like to-do lists, urgency vs. importance matrices, etc." },
  { q: "Tell me about a time you showed leadership.", a: "Describe a situation where you took initiative or guided a team to success." },
  { q: "How do you handle conflict with a coworker?", a: "Emphasize communication, empathy, and finding a mutually beneficial solution." },
  { q: "What motivates you?", a: "Mention things like solving complex problems, learning new things, or achieving team goals." },
  { q: "What is your preferred work style?", a: "Discuss whether you prefer independent work or collaboration, but emphasize flexibility." },
  { q: "How do you stay updated with industry trends?", a: "Mention blogs, courses, conferences, or networking." },
  { q: "Describe a project you are proud of.", a: "Highlight your specific contributions and the impact of the project." },
  { q: "How do you handle feedback?", a: "Explain that you view feedback as an opportunity for growth and improvement." },
  { q: "Are you willing to relocate?", a: "Be honest about your flexibility." },
  { q: "What are your salary expectations?", a: "Provide a range based on market research and your experience." },
  { q: "Do you have any questions for us?", a: "Ask about team culture, upcoming projects, or expectations for the role." }
];

// Role-Specific Technical Questions (30 questions per role)
const roleSpecifics: Record<string, { q: string; a: string }[]> = {
  "Software Engineer": [
    { q: "What is the difference between a process and a thread?", a: "A process is an instance of a program in execution, while a thread is a lightweight process within a process." },
    { q: "Explain Object-Oriented Programming (OOP) concepts.", a: "The main concepts are Encapsulation, Abstraction, Inheritance, and Polymorphism." },
    { q: "What is a RESTful API?", a: "REST (Representational State Transfer) is an architectural style for designing networked applications." },
    { q: "Explain the concept of recursion.", a: "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem." },
    { q: "What is the difference between SQL and NoSQL?", a: "SQL databases are relational and table-based, while NoSQL databases are non-relational and document/key-value based." },
    { q: "What is a deadlock?", a: "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for the other to release a resource." },
    { q: "Explain the difference between TCP and UDP.", a: "TCP is connection-oriented and reliable, while UDP is connectionless and faster but unreliable." },
    { q: "What is the purpose of an index in a database?", a: "An index is used to speed up the retrieval of data from a database table." },
    { q: "What is Git?", a: "Git is a distributed version control system for tracking changes in source code." },
    { q: "Explain the concept of microservices.", a: "Microservices is an architectural style that structures an application as a collection of loosely coupled services." },
    { q: "What is CI/CD?", a: "CI/CD stands for Continuous Integration and Continuous Delivery/Deployment." },
    { q: "What is a layout in CSS?", a: "CSS Layout is the part of CSS that deals with how elements are arranged on the page." },
    { q: "Explain the Virtual DOM in React.", a: "The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize updates." },
    { q: "What is dependency injection?", a: "Dependency injection is a design pattern in which an object receives other objects that it depends on." },
    { q: "What is the difference between '==' and '===' in JavaScript?", a: "'==' checks for equality with type coercion, while '===' checks for strict equality without type coercion." },
    { q: "What is a closure in JavaScript?", a: "A closure is the combination of a function bundled together with references to its surrounding state." },
    { q: "Explain the concept of API Gateway.", a: "An API Gateway is a server that acts as an API front-end, receiving API requests, enforcing throttling and security policies, passing requests to the back-end service and then passing the response back to the requester." },
    { q: "What is Docker?", a: "Docker is a platform for developing, shipping, and running applications in containers." },
    { q: "What is Kubernetes?", a: "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications." },
    { q: "Explain the SOLID principles.", a: "SOLID stands for Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion." },
    { q: "What is unit testing?", a: "Unit testing is a software testing method where individual units or components of a software are tested." },
    { q: "What is a foreign key?", a: "A foreign key is a field (or collection of fields) in one table that refers to the primary key in another table." },
    { q: "What is normalization?", a: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity." },
    { q: "What is a binary tree?", a: "A binary tree is a tree data structure in which each node has at most two children." },
    { q: "What is a hash table?", a: "A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values." },
    { q: "What is dynamic programming?", a: "Dynamic programming is a method for solving complex problems by breaking them down into simpler subproblems." },
    { q: "What is Big O notation?", a: "Big O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity." },
    { q: "What is an interface?", a: "An interface is a reference type in Java (and other languages) that is similar to a class but can only contain constants, method signatures, default methods, static methods, and nested types." },
    { q: "What is inheritance?", a: "Inheritance is a mechanism in which one object acquires all the properties and behaviors of a parent object." },
    { q: "What is polymorphism?", a: "Polymorphism is the ability of an object to take on many forms." }
  ],
  "Business Analyst": [
    { q: "What is the role of a Business Analyst?", a: "A Business Analyst bridges the gap between IT and the business using data analytics to assess processes, determine requirements, and deliver data-driven recommendations." },
    { q: "What is a requirement?", a: "A requirement is a condition or capability needed by a user to solve a problem or achieve an objective." },
    { q: "What is a Use Case?", a: "A Use Case is a description of how a user uses a system to accomplish a particular goal." },
    { q: "What is a User Story?", a: "A User Story is a tool used in Agile software development to capture a description of a software feature from an end-user perspective." },
    { q: "What is SWOT analysis?", a: "SWOT stands for Strengths, Weaknesses, Opportunities, and Threats." },
    { q: "What is BPMN?", a: "BPMN stands for Business Process Model and Notation." },
    { q: "What is the difference between functional and non-functional requirements?", a: "Functional requirements define what a system is supposed to do, while non-functional requirements define how a system is supposed to be." },
    { q: "What is gap analysis?", a: "Gap analysis involves the comparison of actual performance with potential or desired performance." },
    { q: "What is a flowchart?", a: "A flowchart is a type of diagram that represents a workflow or process." },
    { q: "What is Agile methodology?", a: "Agile is an iterative approach to project management and software development." },
    { q: "What is Scrum?", a: "Scrum is a framework within which people can address complex adaptive problems, while productively and creatively delivering products of the highest possible value." },
    { q: "What is a backlog?", a: "A backlog is a list of tasks required to support a larger strategic plan." },
    { q: "What is a stakeholder?", a: "A stakeholder is a person with an interest or concern in something, especially a business." },
    { q: "How do you handle difficult stakeholders?", a: "Listen actively, communicate clearly, and focus on common goals." },
    { q: "What is UAT?", a: "UAT stands for User Acceptance Testing." },
    { q: "What is a traceability matrix?", a: "A traceability matrix is a document that traces and maps user requirements with test cases." },
    { q: "What is feasibility study?", a: "A feasibility study is an assessment of the practicality of a proposed project or system." },
    { q: "What is risk management?", a: "Risk management is the forecasting and evaluation of financial risks together with the identification of procedures to avoid or minimize their impact." },
    { q: "What is Pareto Analysis?", a: "Pareto Analysis is a statistical technique in decision-making based on the Pareto Principle (80/20 rule)." },
    { q: "What is Six Sigma?", a: "Six Sigma is a set of techniques and tools for process improvement." },
    { q: "What is a Gantt chart?", a: "A Gantt chart is a type of bar chart that illustrates a project schedule." },
    { q: "What is wireframing?", a: "Wireframing is a way to design a website service at the structural level." },
    { q: "What is prototyping?", a: "Prototyping is an early sample, model, or release of a product built to test a concept or process." },
    { q: "What is JIRA?", a: "JIRA is a proprietary issue tracking product developed by Atlassian that allows bug tracking and agile project management." },
    { q: "What is Confluence?", a: "Confluence is a team workspace where knowledge and collaboration meet." },
    { q: "What is SRS?", a: "SRS stands for Software Requirements Specification." },
    { q: "What is BRD?", a: "BRD stands for Business Requirement Document." },
    { q: "What is scope creep?", a: "Scope creep refers to changes, continuous or uncontrolled growth in a project's scope, at any point after the project begins." },
    { q: "What is root cause analysis?", a: "Root cause analysis is a method of problem solving used for identifying the root causes of faults or problems." },
    { q: "What is benchmarking?", a: "Benchmarking is the practice of comparing business processes and performance metrics to industry bests and best practices from other companies." }
  ],
  "Data Scientist": [
    { q: "What is Data Science?", a: "Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from noisy, structured and unstructured data." },
    { q: "What is the difference between supervised and unsupervised learning?", a: "Supervised learning uses labeled data, while unsupervised learning uses unlabeled data." },
    { q: "What is overfitting?", a: "Overfitting happens when a model learns the detail and noise in the training data to the extent that it negatively impacts the performance of the model on new data." },
    { q: "What is underfitting?", a: "Underfitting occurs when a statistical model cannot capture the underlying trend of the data." },
    { q: "What is a confusion matrix?", a: "A confusion matrix is a table that is often used to describe the performance of a classification model." },
    { q: "What is bias-variance tradeoff?", a: "The bias-variance tradeoff is the property of a model that the variance of the parameter estimated across samples can be reduced by increasing the bias in the estimated parameters." },
    { q: "What is regularization?", a: "Regularization is a technique used to prevent overfitting by adding a penalty term to the loss function." },
    { q: "What is a p-value?", a: "The p-value is the probability of obtaining test results at least as extreme as the results actually observed, under the assumption that the null hypothesis is correct." },
    { q: "What is A/B testing?", a: "A/B testing is a user experience research methodology." },
    { q: "What is Deep Learning?", a: "Deep learning is a subset of machine learning in artificial intelligence (AI) that has networks capable of learning unsupervised from data that is unstructured or unlabeled." },
    { q: "What is NLP?", a: "Natural Language Processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language." },
    { q: "What is a random forest?", a: "Random forest is an ensemble learning method for classification, regression and other tasks that operates by constructing a multitude of decision trees at training time." },
    { q: "What is logistic regression?", a: "Logistic regression is a statistical model that in its basic form uses a logistic function to model a binary dependent variable." },
    { q: "What is linear regression?", a: "Linear regression is a linear approach to modeling the relationship between a scalar response and one or more explanatory variables." },
    { q: "What is K-means clustering?", a: "K-means clustering is a method of vector quantization, originally from signal processing, that aims to partition n observations into k clusters." },
    { q: "What is PCA?", a: "Principal Component Analysis (PCA) is a dimensionality reduction technique." },
    { q: "What is SQL?", a: "Structured Query Language (SQL) is a domain-specific language used in programming and designed for managing data held in a relational database management system." },
    { q: "What is Python?", a: "Python is an interpreted, high-level and general-purpose programming language." },
    { q: "What is R?", a: "R is a programming language and free software environment for statistical computing and graphics." },
    { q: "What is data cleaning?", a: "Data cleaning is the process of detecting and correcting (or removing) corrupt or inaccurate records from a record set, table, or database." },
    { q: "What is feature engineering?", a: "Feature engineering is the process of using domain knowledge to extract features from raw data via data mining techniques." },
    { q: "What is cross-validation?", a: "Cross-validation is a resampling procedure used to evaluate machine learning models on a limited data sample." },
    { q: "What is a time series?", a: "A time series is a series of data points indexed (or listed or graphed) in time order." },
    { q: "What is Big Data?", a: "Big data is a field that treats ways to analyze, systematically extract information from, or otherwise deal with data sets that are too large or complex to be dealt with by traditional data-processing application software." },
    { q: "What is Hadoop?", a: "Apache Hadoop is a collection of open-source software utilities that facilitates using a network of many computers to solve problems involving massive amounts of data and computation." },
    { q: "What is Spark?", a: "Apache Spark is an open-source unified analytics engine for large-scale data processing." },
    { q: "What is visualization?", a: "Data visualization is the graphic representation of data." },
    { q: "What is Tableau?", a: "Tableau is a powerful and fastest growing data visualization tool used in the Business Intelligence Industry." },
    { q: "What is Power BI?", a: "Power BI is a business analytics service by Microsoft." },
    { q: "What is machine learning?", a: "Machine learning is the study of computer algorithms that improve automatically through experience and by the use of data." }
  ],
  "Product Manager": [
    { q: "What is Product Management?", a: "Product management is an organizational function within a company dealing with new product development, business justification, planning, verification, forecasting, pricing, product launch, and marketing of a product or products at all stages of the product lifecycle." },
    { q: "What is a product roadmap?", a: "A product roadmap is a high-level visual summary that maps out the vision and direction of your product offering over time." },
    { q: "What is MVP?", a: "MVP stands for Minimum Viable Product." },
    { q: "How do you prioritize features?", a: "Using frameworks like RICE, Kano, or MoSCoW." },
    { q: "What is a user persona?", a: "A user persona is a fictional character created to represent a user type that might use a site, brand, or product in a similar way." },
    { q: "What is a KPI?", a: "KPI stands for Key Performance Indicator." },
    { q: "What is OKR?", a: "OKR stands for Objectives and Key Results." },
    { q: "What is Agile?", a: "Agile is an iterative approach to project management and software development." },
    { q: "What is Scrum?", a: "Scrum is a framework for developing, delivering, and sustaining complex products." },
    { q: "What is a sprint?", a: "A sprint is a set period of time during which specific work has to be completed and made ready for review." },
    { q: "How do you handle feature requests?", a: "Evaluate them against the product vision and roadmap." },
    { q: "What is market research?", a: "Market research is the process of determining the viability of a new service or product through research conducted directly with potential customers." },
    { q: "What is competitive analysis?", a: "Competitive analysis is an assessment of the strengths and weaknesses of current and potential competitors." },
    { q: "What is Go-to-Market strategy?", a: "A go-to-market strategy is an action plan that specifies how a company will reach customers and achieve competitive advantage." },
    { q: "What is A/B testing?", a: "A/B testing is a method of comparing two versions of a webpage or app against each other to determine which one performs better." },
    { q: "What is churn rate?", a: "Churn rate is the rate at which customers stop doing business with an entity." },
    { q: "What is retention rate?", a: "Retention rate is the percentage of customers who continue paying for a product over a given timeframe." },
    { q: "What is CAC?", a: "CAC stands for Customer Acquisition Cost." },
    { q: "What is LTV?", a: "LTV stands for Lifetime Value." },
    { q: "What is NPS?", a: "NPS stands for Net Promoter Score." },
    { q: "How do you define success for a product?", a: "By defining clear KPIs and metrics aligned with business goals." },
    { q: "What is design thinking?", a: "Design thinking is a non-linear, iterative process that teams use to understand users, challenge assumptions, redefine problems and create innovative solutions to prototype and test." },
    { q: "What is a backlog?", a: "A backlog is a prioritized list of work for the development team that is derived from the roadmap and its requirements." },
    { q: "What is a user story?", a: "A user story is an informal, natural language description of one or more features of a software system." },
    { q: "What is acceptance criteria?", a: "Acceptance criteria are the conditions that a software product must satisfy to be accepted by a user, customer, or in the case of system level functionality, the consuming system." },
    { q: "How do you work with engineers?", a: "Build trust, communicate clearly, and involve them early in the process." },
    { q: "How do you work with designers?", a: "Collaborate on user flows, wireframes, and prototypes." },
    { q: "What is a product launch?", a: "A product launch is a planned effort to bring a new product to market." },
    { q: "How do you handle a product failure?", a: "Analyze the root cause, learn from it, and iterate." },
    { q: "What is your favorite product and why?", a: "Choose a product you use often and explain what makes it successful." }
  ],
  "HR Executive": [
    { q: "What is Human Resource Management?", a: "HRM is the strategic approach to the effective management of people in a company or organization such that they help their business gain a competitive advantage." },
    { q: "What is recruitment?", a: "Recruitment is the process of finding and hiring the best-qualified candidate (from within or outside of an organization) for a job opening." },
    { q: "What is onboarding?", a: "Onboarding is the process of integrating a new employee with a company and its culture." },
    { q: "What is performance management?", a: "Performance management is an ongoing process of communication between a supervisor and an employee that occurs throughout the year, in support of accomplishing the strategic objectives of the organization." },
    { q: "What is employee engagement?", a: "Employee engagement is a fundamental concept in the effort to understand and describe, both qualitatively and quantitatively, the nature of the relationship between an organization and its employees." },
    { q: "How do you handle a difficult employee?", a: "Listen to their concerns, address the issue directly, and document the conversation." },
    { q: "What is a grievance?", a: "A grievance is a formal complaint raised by an employee towards an employer within the workplace." },
    { q: "What is diversity and inclusion?", a: "Diversity and inclusion is a company's mission, strategies, and practices to support a diverse workplace and leverage the effects of diversity to achieve a competitive business advantage." },
    { q: "What is HR compliance?", a: "HR compliance is the process of defining policies and procedures to ensure your employment and work practices demonstrate a thorough understanding of applicable laws and regulations." },
    { q: "What is payroll?", a: "Payroll is the list of employees of some company that is entitled to receive pay as well as other work benefits and the amounts that each should receive." },
    { q: "What is compensation and benefits?", a: "Compensation and benefits refers to the compensation/salary and other monetary and non-monetary benefits passed on by a firm to its employees." },
    { q: "What is talent management?", a: "Talent management is the anticipation of required human capital for an organization and the planning to meet those needs." },
    { q: "What is succession planning?", a: "Succession planning is a process for identifying and developing new leaders who can replace old leaders when they leave, retire or die." },
    { q: "What is HRIS?", a: "HRIS stands for Human Resources Information System." },
    { q: "How do you conduct an exit interview?", a: "Ask open-ended questions to understand the reasons for leaving and gather feedback." },
    { q: "What is a job description?", a: "A job description is a broad, general, and written statement of a specific job, based on the findings of a job analysis." },
    { q: "What is a KPI in HR?", a: "HR KPIs are metrics used to see how HR is contributing to the rest of the organization." },
    { q: "What is employee retention?", a: "Employee retention refers to the ability of an organization to retain its employees." },
    { q: "What is workplace culture?", a: "Workplace culture is the environment that you create for your employees." },
    { q: "How do you motivate employees?", a: "Recognition, professional development, and a positive work environment." },
    { q: "What is conflict resolution?", a: "Conflict resolution is a way for two or more parties to find a peaceful solution to a disagreement among them." },
    { q: "What is FMLA?", a: "FMLA stands for Family and Medical Leave Act." },
    { q: "What is EEOC?", a: "EEOC stands for Equal Employment Opportunity Commission." },
    { q: "What is OSHA?", a: "OSHA stands for Occupational Safety and Health Administration." },
    { q: "What is a 360-degree review?", a: "A 360-degree review is a professional feedback opportunity that enables a group of coworkers and managers to provide feedback about a fellow employee's performance." },
    { q: "What is an ATS?", a: "ATS stands for Applicant Tracking System." },
    { q: "What is employer branding?", a: "Employer branding is the process of promoting a company, or an organization, as the employer of choice to a desired target group, one which a company needs and wants to recruit and retain." },
    { q: "How do you handle confidential information?", a: "Strictly adhere to company policies and legal requirements regarding data privacy." },
    { q: "What is absenteeism?", a: "Absenteeism is a habitual pattern of absence from a duty or obligation." },
    { q: "What is turnover rate?", a: "Turnover rate is the percentage of employees in a workforce that leave during a certain period of time." }
  ],
  "Marketing Manager": [
    { q: "What is marketing?", a: "Marketing is the activity, set of institutions, and processes for creating, communicating, delivering, and exchanging offerings that have value for customers, clients, partners, and society at large." },
    { q: "What is the marketing mix?", a: "The marketing mix refers to the set of actions, or tactics, that a company uses to promote its brand or product in the market. The 4Ps make up a typical marketing mix - Price, Product, Promotion and Place." },
    { q: "What is SEO?", a: "SEO stands for Search Engine Optimization." },
    { q: "What is SEM?", a: "SEM stands for Search Engine Marketing." },
    { q: "What is content marketing?", a: "Content marketing is a strategic marketing approach focused on creating and distributing valuable, relevant, and consistent content to attract and retain a clearly defined audience." },
    { q: "What is social media marketing?", a: "Social media marketing is the use of social media platforms and websites to promote a product or service." },
    { q: "What is email marketing?", a: "Email marketing is the act of sending a commercial message, typically to a group of people, using email." },
    { q: "What is PPC?", a: "PPC stands for Pay-Per-Click." },
    { q: "What is a conversion rate?", a: "Conversion rate is the percentage of visitors to a website that complete a desired goal (a conversion) out of the total number of visitors." },
    { q: "What is ROI?", a: "ROI stands for Return on Investment." },
    { q: "What is a target audience?", a: "A target audience is the specific group of consumers most likely to want your product or service." },
    { q: "What is a buyer persona?", a: "A buyer persona is a semi-fictional representation of your ideal customer based on market research and real data about your existing customers." },
    { q: "What is branding?", a: "Branding is the process of giving a meaning to specific organization, company, products or services by creating and shaping a brand in consumers' minds." },
    { q: "What is a USP?", a: "USP stands for Unique Selling Proposition." },
    { q: "What is A/B testing?", a: "A/B testing is a user experience research methodology." },
    { q: "What is Google Analytics?", a: "Google Analytics is a web analytics service offered by Google that tracks and reports website traffic." },
    { q: "What is CRM?", a: "CRM stands for Customer Relationship Management." },
    { q: "What is B2B marketing?", a: "B2B marketing stands for Business-to-Business marketing." },
    { q: "What is B2C marketing?", a: "B2C marketing stands for Business-to-Consumer marketing." },
    { q: "What is influencer marketing?", a: "Influencer marketing is a form of social media marketing involving endorsements and product placement from influencers, people and organizations who have a purported expert level of knowledge or social influence in their field." },
    { q: "What is affiliate marketing?", a: "Affiliate marketing is a type of performance-based marketing in which a business rewards one or more affiliates for each visitor or customer brought by the affiliate's own marketing efforts." },
    { q: "What is viral marketing?", a: "Viral marketing is a method of marketing whereby consumers are encouraged to share information about a company's goods or services via the Internet." },
    { q: "What is guerilla marketing?", a: "Guerrilla marketing is an advertisement strategy in which a company uses surprise and/or unconventional interactions in order to promote a product or service." },
    { q: "What is a call to action?", a: "A call to action (CTA) is a marketing term for any device designed to prompt an immediate response or encourage an immediate sale." },
    { q: "What is lead generation?", a: "Lead generation is the initiation of consumer interest or enquiry into products or services of a business." },
    { q: "What is customer retention?", a: "Customer retention refers to the ability of a company or product to retain its customers over some specified period." },
    { q: "What is market segmentation?", a: "Market segmentation is the process of dividing a broad consumer or business market, normally consisting of existing and potential customers, into sub-groups of consumers (known as segments) based on some type of shared characteristics." },
    { q: "What is a landing page?", a: "A landing page is a standalone web page, created specifically for a marketing or advertising campaign." },
    { q: "What is bounce rate?", a: "Bounce rate is the percentage of visitors to a particular website who navigate away from the site after viewing only one page." },
    { q: "What is CTR?", a: "CTR stands for Click-Through Rate." }
  ]
};

export const getQuestionsByRole = (roleTitle: string) => {
  const specific = roleSpecifics[roleTitle] || [];
  
  // Combine specific and behavioral
  let allQuestions = [...specific, ...behavioralQuestions];
  
  // Assign IDs and random metadata
  return allQuestions.map((item, index) => ({
    id: index + 1,
    q: item.q,
    a: item.a,
    askedBy: getRandomCompany(),
    difficulty: getRandomDifficulty()
  }));
};
