module.exports = {
  siteMetadata: {
    title: "Andres Bustos FullStack developer",
    description: "Passionate developer with +5 years of experience. Committed to delivering clean, responsive, and accessible websites optimized for performance and usability. Dedicated to providing the best possible user experience.",
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
            name: `Raleway`,
            file: `https://fonts.googleapis.com/css2?family=Raleway:wght@100;300;500;700&display=swap`,
          },
        ],
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sass"
  ],
};