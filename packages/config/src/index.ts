import { CareerRole, ProficiencyLevel, Skill, SkillCategory } from '@skillgap/types';

export const PROFICIENCY_RANKS: Record<ProficiencyLevel, number> = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  beginner: 'Beginner (Familiar with syntax)',
  elementary: 'Elementary (Can write small scripts/functions)',
  intermediate: 'Intermediate (Can build and debug features independently)',
  advanced: 'Advanced (Deep architectural understanding, optimization)',
  expert: 'Expert (System internals, mentoring, high-scale design)',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
  'Data Analytics',
  'AI/ML',
  'Cybersecurity',
  'Testing',
  'Tools',
  'Soft Skills',
  'Business Skills',
  'Communication',
  'Leadership',
];

export const MASTER_SKILLS: Skill[] = [
  // Programming Languages
  {
    id: 'skill-python',
    name: 'Python',
    slug: 'python',
    category: 'Programming Languages',
    difficulty: 'Beginner',
    description: 'General-purpose, high-level programming language widely used in backend, data analysis, and AI/ML.',
    prerequisites: ['Basic Computing Logic'],
    relatedSkills: ['Django', 'FastAPI', 'Pandas', 'NumPy', 'Flask'],
    learningResources: [
      { title: 'Official Python Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation', isFree: true },
      { title: 'Automate the Boring Stuff with Python', url: 'https://automatetheboringstuff.com/', type: 'book', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Basic syntax, loops, lists, and dicts.',
      elementary: 'Functions, modules, file I/O, simple OOP.',
      intermediate: 'Decorators, generators, context managers, async, package development.',
      advanced: 'Metaclasses, C-extensions, memory profiling, high-concurrency patterns.',
      expert: 'CPython internals, GIL nuances, custom interpreters, architectural leadership.',
    },
  },
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    slug: 'typescript',
    category: 'Programming Languages',
    difficulty: 'Intermediate',
    description: 'Typed superset of JavaScript that compiles to plain JavaScript, essential for large-scale web applications.',
    prerequisites: ['JavaScript'],
    relatedSkills: ['JavaScript', 'React', 'Node.js', 'Next.js'],
    learningResources: [
      { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'documentation', isFree: true },
      { title: 'Execute Program TypeScript', url: 'https://www.executeprogram.com/courses/typescript', type: 'interactive', isFree: false },
    ],
    typicalProficiencyLevels: {
      beginner: 'Basic types (string, number, boolean) and interface declarations.',
      elementary: 'Union types, optional chaining, typing functions and arrays.',
      intermediate: 'Generics, keyof, Record/Partial/Omit utility types, type guards.',
      advanced: 'Conditional types, infer keyword, mapped types, template literal types.',
      expert: 'AST transformations, compiler plugin development, enterprise-wide type designs.',
    },
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript',
    slug: 'javascript',
    category: 'Programming Languages',
    difficulty: 'Beginner',
    description: 'Core web language for interactive client-side browser logic and server-side runtimes (Node.js/Bun).',
    prerequisites: ['HTML', 'CSS'],
    relatedSkills: ['TypeScript', 'React', 'Vue', 'Node.js'],
    learningResources: [
      { title: 'javascript.info', url: 'https://javascript.info/', type: 'tutorial', isFree: true },
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Variables, loops, DOM selection, basic click events.',
      elementary: 'Promises, fetch API, array methods (map, filter, reduce), closures.',
      intermediate: 'Event loop, prototypes, async/await error boundaries, ES modules.',
      advanced: 'Memory leak profiling, garbage collection quirks, microtasks/macrotasks deep dive.',
      expert: 'V8 engine optimization, JIT deoptimizations, custom bundler architecture.',
    },
  },
  {
    id: 'skill-java',
    name: 'Java',
    slug: 'java',
    category: 'Programming Languages',
    difficulty: 'Intermediate',
    description: 'Enterprise-grade object-oriented language running on the JVM, dominant in banking, large systems, and Android.',
    prerequisites: ['Object-Oriented Programming Fundamentals'],
    relatedSkills: ['Spring Boot', 'Kotlin', 'Maven', 'Hibernate'],
    learningResources: [
      { title: 'Dev.java Tutorials', url: 'https://dev.java/learn/', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Classes, primitives, loops, arrays, console apps.',
      elementary: 'Collections framework, exceptions, interfaces, abstract classes.',
      intermediate: 'Streams API, Lambdas, Generics, Concurrency primitives, JDBC.',
      advanced: 'JVM tuning, GC algorithms (G1, ZGC), classloaders, bytecode engineering.',
      expert: 'Distributed JVM architectures, low-latency zero-copy systems.',
    },
  },
  {
    id: 'skill-golang',
    name: 'Go (Golang)',
    slug: 'golang',
    category: 'Programming Languages',
    difficulty: 'Intermediate',
    description: 'Compiled, concurrent language created by Google for cloud-native infrastructure, microservices, and networking.',
    prerequisites: ['Basic Systems Concepts'],
    relatedSkills: ['Docker', 'Kubernetes', 'gRPC', 'Microservices'],
    learningResources: [
      { title: 'Tour of Go', url: 'https://go.dev/tour/welcome/1', type: 'interactive', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Structs, slices, maps, control flow.',
      elementary: 'Goroutines, channels, interfaces, error handling idioms.',
      intermediate: 'Sync primitives (Mutex, WaitGroup), context package, standard library HTTP.',
      advanced: 'Go runtime scheduler (GMP model), memory allocation/escape analysis, profiling (pprof).',
      expert: 'Custom network protocols, distributed consensus implementations, runtime hacking.',
    },
  },
  {
    id: 'skill-sql',
    name: 'SQL',
    slug: 'sql',
    category: 'Database',
    difficulty: 'Beginner',
    description: 'Standard declarative language for relational database query creation, schema definition, and data analysis.',
    prerequisites: ['Data Concepts'],
    relatedSkills: ['PostgreSQL', 'MySQL', 'Prisma', 'Database Indexing'],
    learningResources: [
      { title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'tutorial', isFree: true },
      { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/', type: 'book', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'SELECT, WHERE, ORDER BY, LIMIT, basic aggregations (COUNT, SUM).',
      elementary: 'INNER/LEFT/RIGHT JOINs, GROUP BY, HAVING, subqueries.',
      intermediate: 'Common Table Expressions (CTEs), Window functions (ROW_NUMBER, RANK, LAG), Indexes.',
      advanced: 'EXPLAIN ANALYZE, query plan optimization, partitioning, vacuum tuning, ACID isolation levels.',
      expert: 'Storage engine internals, distributed SQL (Spanner/CockroachDB), query planner extensions.',
    },
  },
  // Frontend Skills
  {
    id: 'skill-react',
    name: 'React',
    slug: 'react',
    category: 'Frontend',
    difficulty: 'Intermediate',
    description: 'Component-based JavaScript library for building responsive, scalable user interfaces.',
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
    relatedSkills: ['Next.js', 'Redux', 'Tailwind CSS', 'TypeScript'],
    learningResources: [
      { title: 'React Official Documentation (react.dev)', url: 'https://react.dev/learn', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'JSX syntax, props, basic state with useState.',
      elementary: 'useEffect, conditional rendering, forms, lifting state up.',
      intermediate: 'Custom hooks, useCallback, useMemo, Context API, component composition.',
      advanced: 'Concurrent mode, Suspense, Server Components, performance profiler, state machine integration.',
      expert: 'Virtual DOM reconciler mechanics, custom renderers, enterprise design system architecture.',
    },
  },
  {
    id: 'skill-nextjs',
    name: 'Next.js',
    slug: 'nextjs',
    category: 'Frontend',
    difficulty: 'Intermediate',
    description: 'Production React framework featuring SSR, ISR, App Router, and server actions.',
    prerequisites: ['React', 'TypeScript'],
    relatedSkills: ['React', 'Node.js', 'Vercel', 'Tailwind CSS'],
    learningResources: [
      { title: 'Next.js Learn', url: 'https://nextjs.org/learn', type: 'interactive', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'File-based routing, creating pages, static assets.',
      elementary: 'App router layout, Link navigation, basic server vs client components.',
      intermediate: 'Route handlers, Server Actions, dynamic caching, middleware, SEO meta tags.',
      advanced: 'Incremental Static Regeneration (ISR), streaming SSR, edge runtime, intercepting routes.',
      expert: 'Custom build pipeline optimization, multi-zone micro-frontends, edge caching architectures.',
    },
  },
  {
    id: 'skill-tailwind',
    name: 'Tailwind CSS',
    slug: 'tailwind-css',
    category: 'Frontend',
    difficulty: 'Beginner',
    description: 'Utility-first CSS framework for rapid modern UI development and responsive design.',
    prerequisites: ['CSS Fundamentals'],
    relatedSkills: ['CSS', 'React', 'UI Design System'],
    learningResources: [
      { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Basic spacing, flex, text colors, margins and padding.',
      elementary: 'Responsive prefixes (sm, md, lg), hover/focus states, grid layouts.',
      intermediate: 'Custom theme configuration, arbitrary values, animations, dark mode.',
      advanced: 'Tailwind plugin authoring, container queries, headless UI integration.',
      expert: 'Enterprise component token architecture, design system consistency enforcement.',
    },
  },
  // Backend Skills
  {
    id: 'skill-nodejs',
    name: 'Node.js',
    slug: 'nodejs',
    category: 'Backend',
    difficulty: 'Intermediate',
    description: 'Asynchronous event-driven JavaScript runtime built on Chrome V8 for scalable network services.',
    prerequisites: ['JavaScript'],
    relatedSkills: ['Express', 'TypeScript', 'REST API', 'GraphQL'],
    learningResources: [
      { title: 'Node.js Official Guides', url: 'https://nodejs.org/en/learn', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Running scripts, npm install, using built-in fs and path modules.',
      elementary: 'Creating basic HTTP servers, using event emitters, managing environment variables.',
      intermediate: 'Streams, Buffers, clustering, Express/Fastify API building, JWT auth.',
      advanced: 'Worker threads, memory heapdump inspection, event loop latency debugging, native addons.',
      expert: 'Ultra-high-throughput network architecture, libuv threading tuning, security hardening.',
    },
  },
  {
    id: 'skill-fastapi',
    name: 'FastAPI',
    slug: 'fastapi',
    category: 'Backend',
    difficulty: 'Intermediate',
    description: 'Modern, high-performance web framework for building APIs with Python based on standard type hints and Pydantic.',
    prerequisites: ['Python'],
    relatedSkills: ['Python', 'Pydantic', 'Docker', 'Swagger/OpenAPI'],
    learningResources: [
      { title: 'FastAPI Tutorial', url: 'https://fastapi.tiangolo.com/tutorial/', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Path operations, query parameters, basic responses.',
      elementary: 'Pydantic request body models, status codes, OpenAPI docs.',
      intermediate: 'Dependency injection system, OAuth2 with JWT, background tasks, CORS.',
      advanced: 'Async database sessions, custom middleware, response streaming, WebSocket endpoints.',
      expert: 'Microservice mesh integration, high-scale async concurrency patterns, custom ASGI middleware.',
    },
  },
  {
    id: 'skill-springboot',
    name: 'Spring Boot',
    slug: 'spring-boot',
    category: 'Backend',
    difficulty: 'Intermediate',
    description: 'Opinionated Java framework for production-ready stand-alone enterprise microservices.',
    prerequisites: ['Java'],
    relatedSkills: ['Java', 'Hibernate', 'Microservices', 'PostgreSQL'],
    learningResources: [
      { title: 'Spring Boot Guides', url: 'https://spring.io/guides', type: 'tutorial', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Creating starter apps with Spring Initializr, basic @RestController.',
      elementary: 'Dependency injection (@Autowired, @Service), Spring Data JPA repositories.',
      intermediate: 'Spring Security, exception handlers, validation annotations, configuration profiles.',
      advanced: 'Actuator metrics, WebFlux reactive pipelines, custom autoconfigurations, caching (Redis).',
      expert: 'Distributed transactions (Saga), enterprise microservice chassis, GraalVM native image optimization.',
    },
  },
  // Database & Cache
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    slug: 'postgresql',
    category: 'Database',
    difficulty: 'Intermediate',
    description: 'Powerful, open-source object-relational database system known for reliability, robustness, and extensible data types.',
    prerequisites: ['SQL'],
    relatedSkills: ['SQL', 'Prisma', 'Database Indexing', 'Redis'],
    learningResources: [
      { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Creating tables, inserting, updating, and querying records.',
      elementary: 'Foreign keys, indexes (B-Tree), transactions (BEGIN/COMMIT).',
      intermediate: 'JSONB columns, complex aggregations, connection pooling (PgBouncer), schema migrations.',
      advanced: 'Partial indexes, GiST/GIN indexes, WAL configuration, replication slots, query optimization.',
      expert: 'Multi-terabyte sharding, custom C extensions, high-availability failover architectures (Patroni).',
    },
  },
  {
    id: 'skill-mongodb',
    name: 'MongoDB',
    slug: 'mongodb',
    category: 'Database',
    difficulty: 'Intermediate',
    description: 'Document-oriented NoSQL database that stores data in flexible, JSON-like documents.',
    prerequisites: ['JSON', 'Database Concepts'],
    relatedSkills: ['Node.js', 'Mongoose', 'NoSQL Design'],
    learningResources: [
      { title: 'MongoDB University', url: 'https://learn.mongodb.com/', type: 'course', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Basic CRUD operations via compass or shell.',
      elementary: 'Mongoose schema definition, embedded documents vs references.',
      intermediate: 'Aggregation pipeline ($match, $group, $lookup, $unwind), compound indexes.',
      advanced: 'Sharding keys selection, replica set failover configurations, change streams.',
      expert: 'Distributed consistency tuning, multi-region cluster topologies, low-latency document models.',
    },
  },
  {
    id: 'skill-redis',
    name: 'Redis',
    slug: 'redis',
    category: 'Database',
    difficulty: 'Intermediate',
    description: 'In-memory data structure store used as a database, cache, streaming engine, and message broker.',
    prerequisites: ['Backend Architecture'],
    relatedSkills: ['Node.js', 'PostgreSQL', 'System Design'],
    learningResources: [
      { title: 'Redis University', url: 'https://university.redis.com/', type: 'course', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Basic GET/SET key-value pairs, string expiration (TTL).',
      elementary: 'Data structures: Hashes, Lists, Sets, and Sorted Sets (ZSET).',
      intermediate: 'Pub/Sub, rate limiting implementations, session storage, cache eviction policies.',
      advanced: 'Redis Streams, Lua scripting, Redis Sentinel high-availability, clustering.',
      expert: 'Memory footprint tuning, distributed locking (Redlock), persistence tradeoffs (RDB vs AOF).',
    },
  },
  // DevOps & Cloud
  {
    id: 'skill-docker',
    name: 'Docker',
    slug: 'docker',
    category: 'DevOps',
    difficulty: 'Beginner',
    description: 'Platform for developing, shipping, and running applications inside lightweight, isolated containers.',
    prerequisites: ['Linux Command Line'],
    relatedSkills: ['Kubernetes', 'CI/CD', 'Linux'],
    learningResources: [
      { title: 'Docker Documentation', url: 'https://docs.docker.com/get-started/', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'docker run, docker ps, pulling images from Docker Hub.',
      elementary: 'Writing standard Dockerfiles, building images, exposing ports, environment variables.',
      intermediate: 'Multi-stage builds, docker-compose for multi-service environments, volumes and bind mounts.',
      advanced: 'Layer caching optimization, container security scanning, rootless containers, slim image builds.',
      expert: 'Custom containerd runtimes, kernel cgroup/namespace tuning, edge container deployments.',
    },
  },
  {
    id: 'skill-kubernetes',
    name: 'Kubernetes',
    slug: 'kubernetes',
    category: 'DevOps',
    difficulty: 'Advanced',
    description: 'Automated container orchestration system for deploying, scaling, and managing containerized applications.',
    prerequisites: ['Docker', 'Networking'],
    relatedSkills: ['Docker', 'Helm', 'Cloud', 'Prometheus'],
    learningResources: [
      { title: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', type: 'interactive', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'kubectl commands, understanding Pods and Namespaces.',
      elementary: 'Deployments, Services (ClusterIP, NodePort), ConfigMaps, Secrets.',
      intermediate: 'Ingress controllers, PersistentVolumes, Helm charts, Horizontal Pod Autoscalers (HPA).',
      advanced: 'Network policies, DaemonSets, StatefulSets, custom resource definitions (CRDs), operators.',
      expert: 'Multi-cluster service meshes (Istio), cluster provisioning (Kubeadm/Terraform), etcd disaster recovery.',
    },
  },
  {
    id: 'skill-aws',
    name: 'AWS Cloud Services',
    slug: 'aws',
    category: 'Cloud',
    difficulty: 'Intermediate',
    description: 'Comprehensive cloud computing platform offering compute, storage, networking, and managed databases.',
    prerequisites: ['Networking', 'Linux'],
    relatedSkills: ['Terraform', 'Docker', 'DevOps'],
    learningResources: [
      { title: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/', type: 'course', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Navigating AWS console, launching an EC2 instance, S3 bucket storage.',
      elementary: 'IAM users & roles, security groups, basic RDS database setup.',
      intermediate: 'VPC subnets, routing tables, Lambda functions, API Gateway, CloudWatch monitoring.',
      advanced: 'ECS/EKS container workloads, CloudFront CDN, DynamoDB single-table design, Terraform IaC.',
      expert: 'Multi-account AWS Organizations, Well-Architected Framework reviews, disaster recovery across regions.',
    },
  },
  {
    id: 'skill-cicd',
    name: 'CI/CD Pipelines (GitHub Actions)',
    slug: 'cicd',
    category: 'DevOps',
    difficulty: 'Intermediate',
    description: 'Continuous Integration and Continuous Deployment automation for automated testing, linting, and zero-downtime shipping.',
    prerequisites: ['Git'],
    relatedSkills: ['Git', 'Docker', 'Testing'],
    learningResources: [
      { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Triggering workflows on git push, running basic npm test.',
      elementary: 'Matrix builds across node/python versions, using environment secrets, status badges.',
      intermediate: 'Building and pushing Docker containers to registries, automated releases, lint check gates.',
      advanced: 'Reusable workflows, composite actions, self-hosted runners, deployment approvals.',
      expert: 'Enterprise pipeline governance, zero-trust secrets management (OIDC with AWS/GCP), artifact caching.',
    },
  },
  // Data Analytics & AI/ML
  {
    id: 'skill-pandas',
    name: 'Pandas & NumPy',
    slug: 'pandas-numpy',
    category: 'Data Analytics',
    difficulty: 'Intermediate',
    description: 'Foundational Python libraries for data manipulation, cleaning, tabular analysis, and vectorized numerical computing.',
    prerequisites: ['Python'],
    relatedSkills: ['Python', 'SQL', 'Data Visualization', 'Machine Learning'],
    learningResources: [
      { title: '10 Minutes to pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Loading CSVs, basic DataFrame inspections (head, info, describe).',
      elementary: 'Filtering rows, selecting columns, handling missing values (fillna, dropna).',
      intermediate: 'Groupby aggregations, merge/join operations, apply/vectorized operations, pivot tables.',
      advanced: 'Multi-indexing, memory optimization with categorical types, processing time-series data.',
      expert: 'Scaling with Polars/Dask, writing custom C/Cython extensions for high-frequency data pipelines.',
    },
  },
  {
    id: 'skill-scikit-learn',
    name: 'Machine Learning (Scikit-Learn)',
    slug: 'scikit-learn',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    description: 'Classical machine learning algorithms for classification, regression, clustering, and data preprocessing.',
    prerequisites: ['Python', 'Pandas & NumPy', 'Linear Algebra & Statistics'],
    relatedSkills: ['Python', 'Deep Learning', 'Data Science'],
    learningResources: [
      { title: 'Scikit-Learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Train-test split, fitting a Linear Regression or Decision Tree model.',
      elementary: 'Model evaluation metrics (Accuracy, Precision, Recall, F1, ROC-AUC), cross-validation.',
      intermediate: 'Pipelines, Feature scaling (StandardScaler), Hyperparameter tuning (GridSearchCV), Random Forests/XGBoost.',
      advanced: 'Feature selection techniques, imbalanced dataset handling (SMOTE), custom transformers.',
      expert: 'Production model serialization (ONNX), inference latency optimization, automated ML pipelines.',
    },
  },
  {
    id: 'skill-deep-learning',
    name: 'Deep Learning (PyTorch)',
    slug: 'pytorch',
    category: 'AI/ML',
    difficulty: 'Advanced',
    description: 'Leading deep learning framework for neural networks, computer vision, NLP, and modern LLM development.',
    prerequisites: ['Python', 'Calculus', 'Linear Algebra'],
    relatedSkills: ['Machine Learning', 'Computer Vision', 'LLMs & Generative AI'],
    learningResources: [
      { title: 'Deep Learning with PyTorch: A 60 Minute Blitz', url: 'https://pytorch.org/tutorials/beginner/blitz/', type: 'tutorial', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Tensors, basic autograd, simple feed-forward neural networks.',
      elementary: 'Dataset & DataLoader classes, training loops, loss functions, optimizers (Adam).',
      intermediate: 'Convolutional neural nets (CNNs), transfer learning with torchvision, saving/loading weights.',
      advanced: 'Custom loss functions, recurrent networks/Transformers, GPU acceleration, mixed precision (AMP).',
      expert: 'Distributed data parallel (DDP), tensor parallel training, CUDA kernel customization, model quantization.',
    },
  },
  {
    id: 'skill-llms',
    name: 'LLMs & Generative AI',
    slug: 'llms-generative-ai',
    category: 'AI/ML',
    difficulty: 'Advanced',
    description: 'Building production applications with Large Language Models, prompt engineering, RAG, and vector databases.',
    prerequisites: ['Python', 'APIs'],
    relatedSkills: ['Python', 'FastAPI', 'Vector Databases', 'LangChain'],
    learningResources: [
      { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'documentation', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'OpenAI/Anthropic API calls, basic zero-shot and few-shot prompting.',
      elementary: 'Structured JSON outputs, function calling/tool use, temperature tuning.',
      intermediate: 'Retrieval-Augmented Generation (RAG), vector embeddings, chunking strategies, vector search.',
      advanced: 'Reranking, hybrid search (BM25 + vector), agentic loops, evaluation frameworks (RAGAS).',
      expert: 'Fine-tuning (LoRA/QLoRA), alignment (DPO/RLHF), local inference optimization (vLLM, Ollama), guardrails.',
    },
  },
  // Testing & Quality
  {
    id: 'skill-testing',
    name: 'Automated Testing (Unit & Integration)',
    slug: 'automated-testing',
    category: 'Testing',
    difficulty: 'Intermediate',
    description: 'Writing automated test suites using frameworks like Jest, Vitest, Pytest, or JUnit to ensure software reliability.',
    prerequisites: ['Coding Proficiency'],
    relatedSkills: ['CI/CD', 'Software Architecture'],
    learningResources: [
      { title: 'Testing JavaScript by Kent C. Dodds', url: 'https://testingjavascript.com/', type: 'course', isFree: false },
    ],
    typicalProficiencyLevels: {
      beginner: 'Writing simple assertions (expect(a).toBe(b)), testing pure functions.',
      elementary: 'Test suites, mocks, spies, fixtures, measuring basic code coverage.',
      intermediate: 'Integration tests with in-memory databases, testing async operations, API endpoint testing (Supertest).',
      advanced: 'Test-driven development (TDD), mocking third-party external services, contract testing (Pact).',
      expert: 'Mutation testing, chaos engineering test strategies, flaky test triage architecture in large monorepos.',
    },
  },
  // Soft Skills & Communication
  {
    id: 'skill-communication',
    name: 'Technical Communication & Collaboration',
    slug: 'technical-communication',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    description: 'Communicating complex architectural decisions clearly to both technical peers and business stakeholders.',
    prerequisites: [],
    relatedSkills: ['Leadership', 'System Design'],
    learningResources: [
      { title: 'Google Technical Writing Course', url: 'https://developers.google.com/tech-writing', type: 'course', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Writing clear commit messages and descriptive PR summaries.',
      elementary: 'Active listening in standups, articulating blockers concisely.',
      intermediate: 'Writing technical design documents (RFCs), conducting constructive code reviews.',
      advanced: 'Cross-functional alignment with product and design, mentoring junior engineers.',
      expert: 'Executive stakeholder briefings, industry speaking, engineering culture evangelism.',
    },
  },
  {
    id: 'skill-system-design',
    name: 'System Design & Distributed Systems',
    slug: 'system-design',
    category: 'Backend',
    difficulty: 'Advanced',
    description: 'Designing highly available, scalable, fault-tolerant software systems and architectures.',
    prerequisites: ['Databases', 'Networking', 'Backend Frameworks'],
    relatedSkills: ['Microservices', 'PostgreSQL', 'Redis', 'Docker'],
    learningResources: [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'book', isFree: true },
    ],
    typicalProficiencyLevels: {
      beginner: 'Understanding client-server model, load balancers, and monolithic architectures.',
      elementary: 'Caching strategies, vertical vs horizontal scaling, database replication basics.',
      intermediate: 'Microservices decomposition, message queues (RabbitMQ/Kafka), rate limiting, CDN integration.',
      advanced: 'CAP theorem tradeoffs, event-driven architecture, distributed transactions, database sharding.',
      expert: 'Globally distributed active-active systems, zero-downtime database migrations at petabyte scale.',
    },
  },
];

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'role-fullstack',
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    department: 'Engineering',
    description: 'Designs and implements end-to-end web applications, uniting responsive modern frontends with resilient cloud APIs.',
    minExperienceYears: 0,
    minEducationDegree: 'Bachelor of Science in Computer Science or related STEM field (or equivalent portfolio)',
    averageSalaryUsd: '$95,000 - $145,000',
    marketDemand: 'Very High',
    weights: {
      technicalSkills: 45,
      experience: 20,
      education: 10,
      softSkills: 10,
      projects: 15,
    },
    requiredSkills: [
      { name: 'JavaScript', category: 'Programming Languages', minProficiency: 'intermediate', weight: 5, description: 'Core web fundamentals, event loop, and asynchronous patterns.' },
      { name: 'TypeScript', category: 'Programming Languages', minProficiency: 'intermediate', weight: 4, description: 'Type-safe contracts across frontend and backend boundaries.' },
      { name: 'React', category: 'Frontend', minProficiency: 'intermediate', weight: 5, description: 'Modern hook-based state management, component architecture, and responsive UX.' },
      { name: 'Node.js', category: 'Backend', minProficiency: 'intermediate', weight: 5, description: 'Building RESTful microservices, asynchronous I/O, and secure middleware.' },
      { name: 'SQL', category: 'Database', minProficiency: 'intermediate', weight: 4, description: 'Relational data modeling, foreign keys, aggregations, and query optimization.' },
      { name: 'PostgreSQL', category: 'Database', minProficiency: 'intermediate', weight: 4, description: 'ACID transactions, indexing, and schema migrations.' },
      { name: 'Docker', category: 'DevOps', minProficiency: 'elementary', weight: 3, description: 'Containerizing services for consistent local and production environments.' },
      { name: 'Automated Testing (Unit & Integration)', category: 'Testing', minProficiency: 'elementary', weight: 3, description: 'Writing unit and integration tests for critical business paths.' },
    ],
    preferredSkills: [
      { name: 'Next.js', category: 'Frontend', minProficiency: 'intermediate', weight: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', minProficiency: 'intermediate', weight: 3 },
      { name: 'Redis', category: 'Database', minProficiency: 'elementary', weight: 2 },
      { name: 'AWS Cloud Services', category: 'Cloud', minProficiency: 'elementary', weight: 2 },
      { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', minProficiency: 'elementary', weight: 2 },
      { name: 'System Design & Distributed Systems', category: 'Backend', minProficiency: 'elementary', weight: 3 },
    ],
    softSkills: [
      'Technical Communication & Collaboration',
      'Problem Decomposition',
      'Code Review Discipline',
      'Time Management',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Modern Web & TypeScript Mastery',
        description: 'Solidify your core asynchronous JavaScript foundations and learn production-grade TypeScript.',
        skillsFocus: ['JavaScript', 'TypeScript'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Master async/await, promise combinators, and error handling boundaries.',
          'Build a typed utility library using generics, keyof, and mapped types.',
          'Configure a strict tsconfig with zero implicit any.',
        ],
        resources: [
          { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'documentation', isFree: true },
          { title: 'JavaScript Event Loop Deep Dive', url: 'https://javascript.info/event-loop', type: 'tutorial', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Full-Stack REST Architecture with React & Node',
        description: 'Build robust REST APIs with Node.js and pair them with dynamic, accessible React frontends.',
        skillsFocus: ['React', 'Node.js', 'PostgreSQL', 'SQL'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Design a normalized relational database schema with PostgreSQL.',
          'Implement JWT authentication with refresh token rotation and bcrypt password hashing.',
          'Create reusable UI components with responsive layouts and accessible form validation.',
          'Implement client-side data fetching with caching and optimistic UI updates.',
        ],
        resources: [
          { title: 'React Documentation', url: 'https://react.dev/learn', type: 'documentation', isFree: true },
          { title: 'Prisma Getting Started', url: 'https://www.prisma.io/docs/getting-started', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 3,
        phase: 'Advanced System Design',
        title: 'Performance, Caching & Containerization',
        description: 'Take your application to production standards with Redis caching and Docker container workflows.',
        skillsFocus: ['Docker', 'Redis', 'CI/CD Pipelines (GitHub Actions)'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Write a multi-stage Dockerfile that builds slim production containers.',
          'Introduce Redis for API response caching and rate-limiting.',
          'Set up a GitHub Actions workflow that runs linting, unit tests, and builds.',
        ],
        resources: [
          { title: 'Docker Official Get Started', url: 'https://docs.docker.com/get-started/', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 4,
        phase: 'Capstone & Proof of Work',
        title: 'Production Full-Stack Application Deployment',
        description: 'Build and deploy a real-world, multi-tenant web application with complete documentation.',
        skillsFocus: ['React', 'Node.js', 'PostgreSQL', 'Automated Testing (Unit & Integration)'],
        estimatedWeeks: 2,
        actionableTasks: [
          'Develop an end-to-end portfolio project featuring authentication, billing/payments mock, and analytics.',
          'Achieve >80% test coverage on API controllers and critical business logic.',
          'Deploy to cloud hosting with custom domain and SSL certificates.',
        ],
        resources: [
          { title: 'Production Ready Node.js Checklist', url: 'https://goldbergyoni.com/node-best-practices/', type: 'documentation', isFree: true },
        ],
      },
    ],
  },
  {
    id: 'role-frontend',
    title: 'Frontend Engineer',
    slug: 'frontend-engineer',
    department: 'Engineering',
    description: 'Crafts high-performance, accessible, and delighting user interfaces across modern browsers and devices.',
    minExperienceYears: 0,
    minEducationDegree: 'Bachelor in Computer Science or related degree',
    averageSalaryUsd: '$90,000 - $140,000',
    marketDemand: 'High',
    weights: {
      technicalSkills: 50,
      experience: 15,
      education: 10,
      softSkills: 10,
      projects: 15,
    },
    requiredSkills: [
      { name: 'JavaScript', category: 'Programming Languages', minProficiency: 'advanced', weight: 5, description: 'DOM manipulation, rendering lifecycle, and event delegation.' },
      { name: 'TypeScript', category: 'Programming Languages', minProficiency: 'intermediate', weight: 4, description: 'Type-safe props, hooks, and API responses.' },
      { name: 'React', category: 'Frontend', minProficiency: 'advanced', weight: 5, description: 'Component lifecycle, hooks, context, reconciliation, and performance profiling.' },
      { name: 'Tailwind CSS', category: 'Frontend', minProficiency: 'intermediate', weight: 4, description: 'Responsive layouts, design systems, and mobile-first architecture.' },
      { name: 'Automated Testing (Unit & Integration)', category: 'Testing', minProficiency: 'intermediate', weight: 3, description: 'Component testing with React Testing Library and Vitest.' },
    ],
    preferredSkills: [
      { name: 'Next.js', category: 'Frontend', minProficiency: 'intermediate', weight: 4 },
      { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', minProficiency: 'elementary', weight: 2 },
      { name: 'Docker', category: 'DevOps', minProficiency: 'beginner', weight: 2 },
    ],
    softSkills: [
      'UI/UX Empathy',
      'Technical Communication & Collaboration',
      'Attention to Detail',
      'Cross-Browser Troubleshooting',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Deep JavaScript & CSS Architecture',
        description: 'Master core CSS grid/flexbox, accessibility (WCAG), and modern JavaScript standards.',
        skillsFocus: ['JavaScript', 'Tailwind CSS'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Build responsive layouts from Figma designs without relying on bloated libraries.',
          'Audit accessibility using screen readers, keyboard navigation, and axe-core.',
          'Implement custom animations using CSS transforms and transition timing curves.',
        ],
        resources: [
          { title: 'web.dev Learn CSS', url: 'https://web.dev/learn/css/', type: 'tutorial', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Advanced React & State Patterns',
        description: 'Scale complex frontend state, custom hooks, and server-side rendering with Next.js.',
        skillsFocus: ['React', 'TypeScript', 'Next.js'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Build a customizable UI component library (Button, Modal, Dropdown, Table).',
          'Implement optimistic state management with React Query / SWR.',
          'Migrate an SPA to Next.js App Router for instant initial load times.',
        ],
        resources: [
          { title: 'React.dev In-Depth', url: 'https://react.dev/learn', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 3,
        phase: 'Advanced System Design',
        title: 'Frontend Performance & Web Vitals Optimization',
        description: 'Achieve 95+ Google Lighthouse scores across Core Web Vitals (LCP, INP, CLS).',
        skillsFocus: ['React', 'Next.js', 'Automated Testing (Unit & Integration)'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Implement bundle splitting, code splitting with dynamic imports, and image optimization.',
          'Write comprehensive integration test suites using React Testing Library.',
          'Profile and eradicate unnecessary re-renders using React Profiler.',
        ],
        resources: [
          { title: 'Core Web Vitals Guide', url: 'https://web.dev/vitals/', type: 'documentation', isFree: true },
        ],
      },
    ],
  },
  {
    id: 'role-backend',
    title: 'Backend Engineer',
    slug: 'backend-engineer',
    department: 'Engineering',
    description: 'Architects robust server-side APIs, manages distributed data pipelines, and ensures high availability and security.',
    minExperienceYears: 1,
    minEducationDegree: 'Bachelor in Computer Science or Software Engineering',
    averageSalaryUsd: '$100,000 - $155,000',
    marketDemand: 'Very High',
    weights: {
      technicalSkills: 50,
      experience: 20,
      education: 10,
      softSkills: 10,
      projects: 10,
    },
    requiredSkills: [
      { name: 'Python', category: 'Programming Languages', minProficiency: 'advanced', weight: 4, description: 'Clean async backend services or Go/Java alternative.' },
      { name: 'Node.js', category: 'Backend', minProficiency: 'advanced', weight: 4, description: 'Event-driven server services, API gateway design, and concurrency.' },
      { name: 'SQL', category: 'Database', minProficiency: 'advanced', weight: 5, description: 'Complex joins, window functions, query analysis, and schema indexing.' },
      { name: 'PostgreSQL', category: 'Database', minProficiency: 'advanced', weight: 5, description: 'Connection pooling, transactions, vacuuming, and replication.' },
      { name: 'System Design & Distributed Systems', category: 'Backend', minProficiency: 'intermediate', weight: 4, description: 'Microservices, message brokering, caching, and resiliency.' },
      { name: 'Docker', category: 'DevOps', minProficiency: 'intermediate', weight: 3, description: 'Containerizing backend services and managing environment parity.' },
    ],
    preferredSkills: [
      { name: 'Redis', category: 'Database', minProficiency: 'intermediate', weight: 4 },
      { name: 'AWS Cloud Services', category: 'Cloud', minProficiency: 'intermediate', weight: 3 },
      { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', minProficiency: 'intermediate', weight: 3 },
      { name: 'Automated Testing (Unit & Integration)', category: 'Testing', minProficiency: 'intermediate', weight: 4 },
    ],
    softSkills: [
      'Incident Response Composure',
      'Technical Communication & Collaboration',
      'Root Cause Analysis',
      'API Contract Design',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Database Internals & Advanced SQL',
        description: 'Level up from basic queries to enterprise-grade query optimization, indexing, and transaction management.',
        skillsFocus: ['SQL', 'PostgreSQL'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Run EXPLAIN ANALYZE on complex subqueries to diagnose index scans vs sequential scans.',
          'Implement composite, partial, and expression indexes to accelerate query speeds 10x.',
          'Understand isolation levels (Read Committed, Repeatable Read, Serializable) and concurrency locks.',
        ],
        resources: [
          { title: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/', type: 'book', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Microservices, Authentication & Middleware',
        description: 'Engineer secure, stateless microservices with resilient rate-limiting and authorization.',
        skillsFocus: ['Node.js', 'Redis', 'Docker'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Build an OAuth2 / JWT authentication service with token revocation via Redis blacklists.',
          'Implement token-bucket and sliding-window rate-limiting algorithms.',
          'Integrate structured logging (Pino/Winston) with correlation IDs for distributed tracing.',
        ],
        resources: [
          { title: 'Twelve-Factor App Methodology', url: 'https://12factor.net/', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 3,
        phase: 'Advanced System Design',
        title: 'Distributed Message Queues & High Scalability',
        description: 'Decouple synchronous API bottlenecks with asynchronous event streams and message workers.',
        skillsFocus: ['System Design & Distributed Systems', 'AWS Cloud Services'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Implement an asynchronous worker queue for email dispatch, file processing, and webhook callbacks.',
          'Design an idempotent consumer architecture to prevent duplicate transactions.',
          'Simulate database failover and test graceful service degradation under load spikes.',
        ],
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'book', isFree: true },
        ],
      },
    ],
  },
  {
    id: 'role-data-analyst',
    title: 'Data Analyst',
    slug: 'data-analyst',
    department: 'Data & Analytics',
    description: 'Transforms raw operational data into actionable strategic insights, executive dashboards, and statistical models.',
    minExperienceYears: 0,
    minEducationDegree: 'Bachelor in Mathematics, Statistics, Computer Science, Economics or related field',
    averageSalaryUsd: '$75,000 - $115,000',
    marketDemand: 'High',
    weights: {
      technicalSkills: 45,
      experience: 20,
      education: 15,
      softSkills: 10,
      projects: 10,
    },
    requiredSkills: [
      { name: 'SQL', category: 'Database', minProficiency: 'advanced', weight: 5, description: 'Complex aggregations, CTEs, cohort retention analysis, and window functions.' },
      { name: 'Python', category: 'Programming Languages', minProficiency: 'intermediate', weight: 4, description: 'Automating data pipelines and statistical modeling.' },
      { name: 'Pandas & NumPy', category: 'Data Analytics', minProficiency: 'advanced', weight: 5, description: 'Data wrangling, cleaning, pivot tables, and statistical summaries.' },
    ],
    preferredSkills: [
      { name: 'PostgreSQL', category: 'Database', minProficiency: 'intermediate', weight: 3 },
      { name: 'Machine Learning (Scikit-Learn)', category: 'AI/ML', minProficiency: 'beginner', weight: 2 },
    ],
    softSkills: [
      'Data Storytelling',
      'Technical Communication & Collaboration',
      'Business Acumen',
      'Critical Thinking',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Advanced Analytical SQL & Data Modeling',
        description: 'Master analytical SQL for complex cohort analysis, churn modeling, and funnel metrics.',
        skillsFocus: ['SQL', 'PostgreSQL'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Write CTEs and Window Functions (LAG, LEAD, NTILE) to compute month-over-month growth.',
          'Model star and snowflake schemas for business intelligence data marts.',
          'Clean dirty transactional data containing nulls, duplicates, and inconsistent timestamps.',
        ],
        resources: [
          { title: 'Mode Analytics Advanced SQL', url: 'https://mode.com/sql-tutorial/sql-advanced/', type: 'tutorial', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Exploratory Data Analysis with Pandas',
        description: 'Clean, transform, and visualize large datasets programmatically using Python and Pandas.',
        skillsFocus: ['Python', 'Pandas & NumPy'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Conduct comprehensive exploratory data analysis (EDA) on a 1M+ row dataset.',
          'Automate monthly reporting by transforming raw CSV exports into structured analysis datasets.',
          'Perform statistical hypothesis testing (t-test, chi-square, p-value calculation).',
        ],
        resources: [
          { title: 'Python for Data Analysis (Wes McKinney)', url: 'https://wesmckinney.com/book/', type: 'book', isFree: true },
        ],
      },
    ],
  },
  {
    id: 'role-ml-engineer',
    title: 'Machine Learning Engineer',
    slug: 'machine-learning-engineer',
    department: 'AI & Data Science',
    description: 'Bridges data science and software engineering to train, deploy, and monitor scalable machine learning models in production.',
    minExperienceYears: 1,
    minEducationDegree: 'Bachelor or Master in Computer Science, Data Science, or Mathematics',
    averageSalaryUsd: '$120,000 - $185,000',
    marketDemand: 'Very High',
    weights: {
      technicalSkills: 50,
      experience: 20,
      education: 15,
      softSkills: 5,
      projects: 10,
    },
    requiredSkills: [
      { name: 'Python', category: 'Programming Languages', minProficiency: 'advanced', weight: 5, description: 'Idiomatic Python, vectorization, and data structures.' },
      { name: 'Pandas & NumPy', category: 'Data Analytics', minProficiency: 'advanced', weight: 5, description: 'High-speed data manipulation and matrix computation.' },
      { name: 'Machine Learning (Scikit-Learn)', category: 'AI/ML', minProficiency: 'advanced', weight: 5, description: 'Supervised/unsupervised algorithms, hyperparameter tuning, and validation.' },
      { name: 'Deep Learning (PyTorch)', category: 'AI/ML', minProficiency: 'intermediate', weight: 4, description: 'Neural networks, loss optimization, and GPU model training.' },
      { name: 'Docker', category: 'DevOps', minProficiency: 'intermediate', weight: 3, description: 'Packaging inference pipelines into portable containers.' },
      { name: 'FastAPI', category: 'Backend', minProficiency: 'intermediate', weight: 3, description: 'Serving low-latency REST/gRPC inference endpoints.' },
    ],
    preferredSkills: [
      { name: 'LLMs & Generative AI', category: 'AI/ML', minProficiency: 'intermediate', weight: 4 },
      { name: 'AWS Cloud Services', category: 'Cloud', minProficiency: 'intermediate', weight: 3 },
      { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', minProficiency: 'intermediate', weight: 2 },
    ],
    softSkills: [
      'Scientific Rigor',
      'Technical Communication & Collaboration',
      'Experiment Tracking Discipline',
      'Pragmatic Engineering',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Classical Machine Learning & Feature Engineering',
        description: 'Deep dive into feature engineering, cross-validation, and gradient boosted trees (XGBoost/LightGBM).',
        skillsFocus: ['Python', 'Pandas & NumPy', 'Machine Learning (Scikit-Learn)'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Build end-to-end preprocessing pipelines with ColumnTransformer and StandardScaler.',
          'Implement cross-validation with stratification to prevent data leakage.',
          'Compare Logistic Regression, Random Forests, and XGBoost on real-world tabular data.',
        ],
        resources: [
          { title: 'Scikit-Learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Deep Learning with PyTorch',
        description: 'Build neural network architectures, custom loss functions, and optimize training on GPUs.',
        skillsFocus: ['Deep Learning (PyTorch)'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Write custom PyTorch Dataset and DataLoader with dynamic data augmentations.',
          'Implement training loops with early stopping, learning rate schedulers, and checkpointing.',
          'Fine-tune pre-trained vision and language models using transfer learning.',
        ],
        resources: [
          { title: 'PyTorch Deep Learning Blitz', url: 'https://pytorch.org/tutorials/beginner/blitz/', type: 'tutorial', isFree: true },
        ],
      },
      {
        order: 3,
        phase: 'Advanced System Design',
        title: 'Production Model Serving & MLOps',
        description: 'Deploy models behind FastAPI endpoints, containerize with Docker, and monitor inference latency.',
        skillsFocus: ['FastAPI', 'Docker', 'AWS Cloud Services'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Package a model into a Dockerized FastAPI microservice with input schema validation.',
          'Implement batch prediction endpoints with async concurrency.',
          'Monitor data drift and model latency in production.',
        ],
        resources: [
          { title: 'Made With ML - MLOps Course', url: 'https://madewithml.com/', type: 'course', isFree: true },
        ],
      },
    ],
  },
  {
    id: 'role-devops',
    title: 'DevOps & Cloud Engineer',
    slug: 'devops-engineer',
    department: 'Infrastructure',
    description: 'Automates deployment pipelines, manages cloud infrastructure as code, and maintains 99.99% system reliability.',
    minExperienceYears: 1,
    minEducationDegree: 'Bachelor in Computer Science, IT, or related engineering discipline',
    averageSalaryUsd: '$105,000 - $160,000',
    marketDemand: 'Very High',
    weights: {
      technicalSkills: 50,
      experience: 25,
      education: 5,
      softSkills: 10,
      projects: 10,
    },
    requiredSkills: [
      { name: 'Docker', category: 'DevOps', minProficiency: 'advanced', weight: 5, description: 'Container security, multi-stage builds, and orchestration.' },
      { name: 'Kubernetes', category: 'DevOps', minProficiency: 'intermediate', weight: 5, description: 'Pod lifecycle, ingress controllers, Helm packaging, and scaling.' },
      { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', minProficiency: 'advanced', weight: 5, description: 'Automated test runners, security scanning, and deployment automation.' },
      { name: 'AWS Cloud Services', category: 'Cloud', minProficiency: 'intermediate', weight: 4, description: 'VPC networking, IAM security, EC2/ECS/EKS, and S3.' },
      { name: 'Python', category: 'Programming Languages', minProficiency: 'intermediate', weight: 3, description: 'Infrastructure automation scripting and CLI tooling.' },
    ],
    preferredSkills: [
      { name: 'Go (Golang)', category: 'Programming Languages', minProficiency: 'elementary', weight: 2 },
      { name: 'PostgreSQL', category: 'Database', minProficiency: 'elementary', weight: 2 },
      { name: 'Redis', category: 'Database', minProficiency: 'elementary', weight: 2 },
    ],
    softSkills: [
      'High-Stakes Incident Management',
      'Technical Communication & Collaboration',
      'Security-First Mindset',
      'Documentation Rigor',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Linux Systems & Container Mastery',
        description: 'Master Linux kernel networking, bash scripting, and production Docker container patterns.',
        skillsFocus: ['Docker'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Write hardened Dockerfiles with non-root users and minimized attack surface.',
          'Configure multi-stage builds that yield images under 50MB.',
          'Manage persistent state, bind mounts, and docker network bridges.',
        ],
        resources: [
          { title: 'Docker Official Documentation', url: 'https://docs.docker.com/', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Automated CI/CD & Cloud Infrastructure',
        description: 'Deploy repeatable cloud environments on AWS using GitHub Actions and automated pipelines.',
        skillsFocus: ['CI/CD Pipelines (GitHub Actions)', 'AWS Cloud Services'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Design a zero-downtime rolling deployment pipeline with rollback triggers.',
          'Set up IAM least-privilege security roles and OpenID Connect (OIDC) authentication.',
          'Configure AWS VPC subnets with NAT gateways, security groups, and routing tables.',
        ],
        resources: [
          { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 3,
        phase: 'Advanced System Design',
        title: 'Kubernetes Cluster Orchestration & Observability',
        description: 'Orchestrate microservice clusters, auto-scale based on CPU/memory pressure, and implement Prometheus monitoring.',
        skillsFocus: ['Kubernetes'],
        estimatedWeeks: 5,
        actionableTasks: [
          'Deploy multi-tier applications with Deployments, ClusterIP Services, and Ingress.',
          'Package Kubernetes manifests into versioned Helm charts.',
          'Set up Horizontal Pod Autoscaling (HPA) and configure liveness/readiness probes.',
        ],
        resources: [
          { title: 'Kubernetes Official Tutorials', url: 'https://kubernetes.io/docs/tutorials/', type: 'documentation', isFree: true },
        ],
      },
    ],
  },
  {
    id: 'role-ai-engineer',
    title: 'AI & LLM Application Engineer',
    slug: 'ai-engineer',
    department: 'AI & Emerging Tech',
    description: 'Designs and builds intelligent software products powered by Large Language Models, RAG architectures, and AI agents.',
    minExperienceYears: 0,
    minEducationDegree: 'Bachelor in Computer Science, Software Engineering, or related technical field',
    averageSalaryUsd: '$110,000 - $170,000',
    marketDemand: 'Very High',
    weights: {
      technicalSkills: 45,
      experience: 15,
      education: 10,
      softSkills: 10,
      projects: 20,
    },
    requiredSkills: [
      { name: 'Python', category: 'Programming Languages', minProficiency: 'advanced', weight: 5, description: 'Idiomatic async programming, API integrations, and data handling.' },
      { name: 'LLMs & Generative AI', category: 'AI/ML', minProficiency: 'advanced', weight: 5, description: 'RAG architecture, prompt engineering, vector embeddings, and evaluation.' },
      { name: 'FastAPI', category: 'Backend', minProficiency: 'intermediate', weight: 4, description: 'Streaming response endpoints, WebSockets, and async task execution.' },
      { name: 'TypeScript', category: 'Programming Languages', minProficiency: 'intermediate', weight: 4, description: 'Building AI-driven interactive user interfaces.' },
      { name: 'React', category: 'Frontend', minProficiency: 'intermediate', weight: 4, description: 'Streaming text UI, chat interfaces, and state synchronization.' },
    ],
    preferredSkills: [
      { name: 'Docker', category: 'DevOps', minProficiency: 'intermediate', weight: 3 },
      { name: 'PostgreSQL', category: 'Database', minProficiency: 'intermediate', weight: 3 },
      { name: 'Deep Learning (PyTorch)', category: 'AI/ML', minProficiency: 'elementary', weight: 3 },
    ],
    softSkills: [
      'Curiosity & Fast Learning',
      'Technical Communication & Collaboration',
      'User Experience Sensitivity',
      'Hallucination Risk Awareness',
    ],
    roadmaps: [
      {
        order: 1,
        phase: 'Foundation',
        title: 'Prompt Engineering & Structured Outputs',
        description: 'Master deterministic JSON schema extraction, few-shot prompting, and API integrations with LLMs.',
        skillsFocus: ['Python', 'LLMs & Generative AI'],
        estimatedWeeks: 3,
        actionableTasks: [
          'Enforce strict JSON schemas using Pydantic and function calling.',
          'Build guardrails to detect and handle adversarial prompt injections.',
          'Implement streaming completions using Server-Sent Events (SSE).',
        ],
        resources: [
          { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'documentation', isFree: true },
        ],
      },
      {
        order: 2,
        phase: 'Core Engineering',
        title: 'Production RAG Architecture',
        description: 'Build high-accuracy retrieval systems using semantic embeddings and vector databases (pgvector/Pinecone).',
        skillsFocus: ['LLMs & Generative AI', 'FastAPI', 'PostgreSQL'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Implement document parsing, intelligent recursive chunking, and metadata tagging.',
          'Store and query dense vector embeddings using PostgreSQL pgvector extension.',
          'Integrate hybrid search combining BM25 keyword matching with cosine similarity.',
        ],
        resources: [
          { title: 'Pinecone Learning Center', url: 'https://www.pinecone.io/learn/', type: 'tutorial', isFree: true },
        ],
      },
      {
        order: 3,
        phase: 'Capstone & Proof of Work',
        title: 'Autonomous Multi-Tool Agent Deployment',
        description: 'Build an autonomous agent with tool execution, memory management, and interactive React UI.',
        skillsFocus: ['React', 'TypeScript', 'FastAPI', 'LLMs & Generative AI'],
        estimatedWeeks: 4,
        actionableTasks: [
          'Build an agent loop that plans, searches external databases, and verifies results.',
          'Create a snappy React chat interface with Markdown rendering and code syntax highlighting.',
          'Benchmark retrieval accuracy and cost per query using automated test suites.',
        ],
        resources: [
          { title: 'LangChain Documentation', url: 'https://python.langchain.com/docs/get_started/introduction', type: 'documentation', isFree: true },
        ],
      },
    ],
  },
];

export const SAMPLE_BENCHMARK_JOBS = [
  {
    id: 'sample-stripe-fullstack',
    jobTitle: 'Software Engineer - Full Stack',
    company: 'Stripe',
    location: 'San Francisco, CA / Remote',
    targetRoleId: 'role-fullstack',
    description: `About the Role:
At Stripe, we are building the financial infrastructure of the internet. Our teams build interfaces and scalable services used by millions of businesses around the globe, from budding startups to public enterprises.

Responsibilities:
- Build delightful, accessible, and resilient web applications using React, TypeScript, and modern CSS.
- Design, build, and maintain high-throughput backend APIs with Node.js and Ruby/Go.
- Work closely with PostgreSQL databases, designing schemas, writing optimized queries, and ensuring data consistency.
- Collaborate with designers, product managers, and security engineers to ship features iteratively.
- Write thorough unit and integration tests, ensuring zero regression in critical payment flows.
- Containerize services using Docker and deploy through automated CI/CD pipelines.

Qualifications:
- 1+ years of software development experience (internships count).
- Strong proficiency in JavaScript/TypeScript and at least one backend language (Node.js or Python).
- Solid grasp of relational databases (PostgreSQL or MySQL) and SQL query mechanics.
- Experience with React or modern frontend frameworks.
- Understanding of web fundamentals: HTTP, REST, asynchronous event handling, and security practices.
- Excellent communication and ability to explain complex technical tradeoffs.`,
  },
  {
    id: 'sample-meta-frontend',
    jobTitle: 'Frontend Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA / Remote',
    targetRoleId: 'role-frontend',
    description: `About the Role:
Meta is seeking Frontend Engineers to craft experiences that connect billions of people. You will be responsible for creating fluid, accessible, and high-performance interfaces across Instagram, Messenger, and Facebook.

Responsibilities:
- Build responsive, reliable, and accessible user interfaces using React, JavaScript, and TypeScript.
- Collaborate with Product Designers to refine design systems and component libraries.
- Optimize frontend performance, reducing Core Web Vitals (LCP, INP, CLS) and minimizing bundle sizes.
- Write robust automated tests with Vitest/Jest and React Testing Library.
- Work with REST and GraphQL APIs to fetch and synchronize client-side application state.

Minimum Qualifications:
- Demonstrated experience building interactive single-page applications with React.
- Advanced understanding of JavaScript (ES6+), DOM operations, and CSS layout architecture.
- Experience with modern styling frameworks like Tailwind CSS or CSS-in-JS.
- Familiarity with CI/CD workflows and automated testing.
- Strong problem-solving skills and empathy for end-user accessibility.`,
  },
  {
    id: 'sample-netflix-backend',
    jobTitle: 'Backend Engineer - Core Platform',
    company: 'Netflix',
    location: 'Los Gatos, CA / Remote',
    targetRoleId: 'role-backend',
    description: `About the Role:
Netflix streaming reaches over 260 million members across 190 countries. The Core Platform team builds the foundational distributed microservices and database infrastructure that power member playback and personalization.

Responsibilities:
- Design, develop, and maintain high-throughput, low-latency microservices using Node.js, Python, or Go.
- Architect complex relational data models in PostgreSQL and caching layers using Redis.
- Write optimized SQL queries, manage database indexing, and analyze query execution plans.
- Implement reliable messaging queues, asynchronous workers, and resilient retry mechanisms.
- Package services in Docker containers and deploy onto AWS cloud infrastructure.
- Monitor service health, latency metrics, and participate in blameless post-mortems.

Qualifications:
- Solid background in backend software development and API design.
- Deep understanding of SQL, indexing strategies, and database concurrency.
- Hands-on experience with in-memory caching solutions like Redis.
- Practical experience with Docker and cloud environments (AWS).
- Strong foundation in distributed systems concepts: CAP theorem, caching, rate limiting.`,
  },
  {
    id: 'sample-openai-ai-eng',
    jobTitle: 'AI Application Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    targetRoleId: 'role-ai-engineer',
    description: `About the Role:
OpenAI is creating safe AGI that benefits all of humanity. The Applications team builds the consumer and developer-facing platforms that make advanced AI models accessible, intuitive, and safe.

Responsibilities:
- Build production applications leveraging OpenAI APIs, LLMs, and prompt engineering techniques.
- Design and deploy Retrieval-Augmented Generation (RAG) pipelines using vector embeddings and PostgreSQL pgvector.
- Develop low-latency backend services with FastAPI and Python to stream model completions to users.
- Create responsive, interactive user experiences with React and TypeScript.
- Implement security guardrails against adversarial prompts and test model output reliability.

Requirements:
- Strong programming skills in Python and TypeScript.
- Experience building full-stack web applications with FastAPI and React.
- Practical understanding of LLM application architecture: embeddings, chunking, vector search, and token limits.
- Familiarity with containerization using Docker.
- A relentless desire to experiment, iterate rapidly, and solve ambiguous engineering challenges.`,
  },
];
