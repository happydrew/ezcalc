export default {
  index: {
    type: 'page',
    title: 'Home',
    //display: 'hidden',
    theme: {
      layout: 'raw'
    }
  },
  "paycheck-calculator":{
    type: 'menu',
    title: 'Paycheck Calculator',
    items:{
      "pennsylvania-paycheck-calculator":{
        title: 'Pennsylvania Paycheck Calculator',
        href: '/paycheck-calculator/pennsylvania-paycheck-calculator'
      }
    }
  },
  docs: {
    type: 'page',
    title: 'Documentation'
  },
  tags: {
    display: "children",
    theme: {
      layout: "raw",
    },
  },
  blog: {
    type: "page",
    title: "Blog",
    theme: {
      layout: "raw",
      typesetting: "article",
      timestamp: false,
    }
  },
  concat: {
    type: 'page',
    title: 'Concat',
    theme: {
      layout: 'raw'
    }
  },
  404: {
    type: 'page',
    theme: {
      timestamp: false,
      typesetting: 'article'
    }
  }
}
