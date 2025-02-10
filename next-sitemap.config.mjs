/* eslint-env node */

/** @type {import('next-sitemap').IConfig} */
export default {
  // siteUrl: "https://EzCalc.cc",
  siteUrl: "https://ezcalc.vercel.app",
  generateIndexSitemap: false,
  generateRobotsTxt: false,
  // output: "export", // Set static output here
  exclude: ["/icon.svg"]
}
