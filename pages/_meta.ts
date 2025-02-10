export default {
  index: {
    type: 'page',
    title: 'Home',
    //display: 'hidden',
    theme: {
      layout: 'raw'
    }
  },
  "paycheck-calculator": {
    type: 'menu',
    title: 'Paycheck Calculator',
    items: {
      "pennsylvania-paycheck-calculator": {
        title: 'Pennsylvania Paycheck Calculator',
        href: '/paycheck-calculator/pennsylvania-paycheck-calculator'
      },
      "new-jersey-paycheck-calculator": {
        title: 'New Jersey Paycheck Calculator',
        href: '/paycheck-calculator/new-jersey-paycheck-calculator'
      },
      "illinois-paycheck-calculator": {
        title: 'Illinois Paycheck Calculator',
        href: '/paycheck-calculator/illinois-paycheck-calculator'
      },
      "maryland-paycheck-calculator": {
        title: 'Maryland Paycheck Calculator',
        href: '/paycheck-calculator/maryland-paycheck-calculator'
      },
      "michigan-paycheck-calculator": {
        title: 'Michigan Paycheck Calculator',
        href: '/paycheck-calculator/michigan-paycheck-calculator'
      },
      "washington-paycheck-calculator": {
        title: 'Washington Paycheck Calculator',
        href: '/paycheck-calculator/washington-paycheck-calculator'
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
