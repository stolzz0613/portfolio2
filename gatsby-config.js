module.exports = {
  siteMetadata: {
    title: "Andrés Bustos · Senior Full Stack Engineer",
    description: "Senior Full Stack Software Engineer and Technical Lead with 8+ years building enterprise web, mobile, e-commerce and AI products with React, Node.js, Salesforce Commerce Cloud and the cloud.",
    siteUrl: "https://andresb.dev",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static/images/`,
      },
    },
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        enableListener: true,
        preconnect: [`https://fonts.googleapis.com`, `https://fonts.gstatic.com`],
        web: [
          {
            name: `Bricolage Grotesque`,
            file: `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap`,
          },
        ],
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sass"
  ],
};