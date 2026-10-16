// Portfolio content, taken from Andrés's CV (Andres_Julian_Bustos_Complete_CV_ATS_English.docx).

export const stats = [
  { value: '8', suffix: '+', label: 'years shipping production software' },
  { value: '10', label: 'products across retail, health, energy, finance, AI' },
  { value: '2', label: 'long-term engagements running in parallel' },
]

// Engagement periods for the timeline, as fractional years.
export const timeline = [
  { who: 'Imometrics', from: 2020 + 7 / 12, to: 2021, contract: true },
  { who: 'Grability · BVC', from: 2021 + 2 / 12, to: 2021 + 5 / 12, contract: true },
  { who: '10Pearls · Cyberbank', from: 2021 + 5 / 12, to: 2022 + 5 / 12, contract: true },
  { who: 'Whale & Jaguar', from: 2021 + 8 / 12, to: 2022 + 8 / 12, contract: true },
  { who: 'Globant', from: 2021 + 5 / 12, now: true },
  { who: 'EPAM Anywhere', from: 2022 + 3 / 12, now: true },
]

export const experience = [
  {
    org: 'Globant',
    when: 'Jun 2021 – Present',
    sub: 'Grew from Junior Salesforce Commerce Cloud Developer to Senior Full Stack Developer.',
    jobs: [
      {
        when: '2025 – Now', title: 'Senior Full Stack Developer', client: 'Globant Enterprise AI',
        text: "End-to-end features for Globant's enterprise AI agent marketplace: React front end, Node.js services and the middleware that orchestrates requests, business rules and integrations. Technical lead for design, reviews, mentoring and incident analysis.",
        tags: ['React', 'Node.js', 'Middleware', 'AI agents'],
      },
      {
        when: '2023 – 2025', title: 'Full Stack Developer', client: 'Soriana',
        text: 'Headless e-commerce with React and Salesforce Commerce Cloud PWA Kit: catalog, cart, promotions, multi-inventory and store-level fulfillment, plus Marketing Cloud journeys and data governance across CRM and commerce.',
        tags: ['PWA Kit', 'Commerce API', 'SFMC', 'AMPscript'],
      },
      {
        when: '2021 – 2023', title: 'Salesforce Commerce Cloud Developer', client: 'El Palacio de Hierro',
        text: 'SFRA storefront and back-end logic, site redesign and production support for a large retail platform; integrations across commerce, CRM and marketing.',
        tags: ['SFRA', 'OCAPI / SCAPI', 'ISML'],
      },
    ],
  },
  {
    org: 'EPAM Anywhere',
    when: 'Apr 2022 – Present',
    sub: 'Senior Software Engineer on concurrent remote client engagements.',
    jobs: [
      {
        when: '2025 – Now', title: 'Full Stack Developer', client: 'Baker Hughes',
        text: 'Operational data visualization, alerting and internal tools with C#, ASP.NET Core, SQL Server and Azure.',
        tags: ['.NET', 'Azure', 'SQL Server'],
      },
      {
        when: '2024 – 2025', title: 'Key Developer', client: 'Oracle Health',
        text: 'Healthcare platform features and cloud integrations with Oracle JET, Visual Builder and Oracle Cloud Infrastructure.',
        tags: ['Oracle JET', 'OCI', 'TypeScript'],
      },
      {
        when: '2022 – 2024', title: 'Frontend Lead', client: 'Equality Health',
        text: 'Led the front end of a healthcare platform in React and Next.js with two developers reporting to the workstream; owned architecture, conventions and reviews.',
        tags: ['Next.js', 'Leadership', 'Sass'],
      },
    ],
  },
  {
    org: 'Contractor',
    when: 'Aug 2020 – Sep 2022',
    jobs: [
      {
        when: '2021 – 2022', title: 'Senior Full Stack Developer', client: 'Whale & Jaguar',
        text: 'Built most of Oceana, an AI social-media analytics platform: Meta Graph API, NLP and sentiment analysis with Hugging Face, dashboards on Azure.',
        tags: ['Python', 'Hugging Face', 'React'],
      },
      {
        when: '2021 – 2022', title: 'Full Stack Developer', client: '10Pearls · Cyberbank',
        text: 'Digital banking web and mobile: microfrontends, shared npm libraries, React Native and NestJS services.',
        tags: ['React Native', 'NestJS', 'Microfrontends'],
      },
      {
        when: '2021', title: 'Junior Developer', client: 'Grability · BVC',
        text: 'Front-end refactoring and Selenium end-to-end testing for a Bolsa de Valores de Colombia project.',
      },
      {
        when: '2020 – 2021', title: 'Full Stack Developer', client: 'Imometrics',
        text: 'Real-time IoT readings, alarm rules and Twilio SMS alerts on AWS with MQTT, WebSockets and RabbitMQ.',
      },
    ],
  },
]

export const projects = [
  {
    slug: 'cronica-del-aventurero',
    title: 'Crónica del Aventurero',
    text: 'My Google Health data as a 16-bit RPG, refreshed every morning, with advice and weekly chapters written by Claude.',
  },
  {
    slug: 'guia-pokemon-platino',
    title: 'Guía de Pokémon Platino',
    text: 'Interactive walkthrough with checklists, chapter maps and a full Sinnoh Pokédex.',
  },
]

// Devicon icons (MIT) in static/images/stack. `mono` marks black icons that are inverted on black.
export const stack = [
  ['react-original', 'React'], ['nextjs-original', 'Next.js', true], ['typescript-original', 'TypeScript'],
  ['javascript-original', 'JavaScript'], ['nodejs-original', 'Node.js'], ['nestjs-original', 'NestJS'],
  ['python-original', 'Python'], ['csharp-original', 'C#'], ['dotnetcore-original', '.NET'],
  ['salesforce-original', 'Salesforce'], ['sass-original', 'Sass'], ['postgresql-original', 'PostgreSQL'],
  ['mongodb-original', 'MongoDB'], ['redis-original', 'Redis'], ['docker-original', 'Docker'],
  ['azure-original', 'Azure'], ['amazonwebservices-original-wordmark', 'AWS'], ['oracle-original', 'Oracle Cloud'],
]

export const skillGroups = [
  ['Frontend', 'React, Next.js, React Native, TypeScript, Redux, Sass, reusable component systems, microfrontends.'],
  ['Backend & APIs', 'Node.js, NestJS, Express, Python (FastAPI, Flask, Django), C#/.NET, REST, SOAP, OAuth 2.0, middleware.'],
  ['Salesforce & MarTech', 'B2C Commerce, SFRA, PWA Kit, Managed Runtime, OCAPI/SCAPI, Marketing Cloud, Journey Builder, AMPscript.'],
  ['Data, Cloud & AI', 'PostgreSQL, SQL Server, MongoDB, AWS, Azure, Oracle Cloud, Docker, CI/CD, Hugging Face, NLP, generative AI.'],
]

export const contact = {
  email: 'andres0613@utp.edu.co',
  github: 'https://github.com/stolzz0613',
  linkedin: 'https://www.linkedin.com/in/andres613/',
}
