export default {
  "title": "Welcome on Dan Pawlik web page!",
  "url": "https://danpawlik.github.io",
  "baseUrl": "/",
  "onBrokenLinks": "throw",
  "onBrokenMarkdownLinks": "warn",
  "favicon": "img/favicon.ico",
  "organizationName": "danpawlik",
  "projectName": "danpawlik.github.io",
  "themeConfig": {
    "footer": {
      "style": "dark",
      "links": [
        {
          "title": "Social media",
          "items": [
            {
              "label": "Twitter",
              "href": "https://twitter.com/dan_pawlik"
            },
            {
              "label": "Facebook",
              "href": "https://www.facebook.com/pawlik.dan"
            },
            {
              "label": "LinkedIn",
              "href": "https://www.linkedin.com/in/daniel-pawlik-010839a7/"
            },
            {
              "label": "Github",
              "href": "https://github.com/danpawlik"
            }
          ]
        },
        {
          "title": "External Projects",
          "items": [
            {
              "label": "Software Factory",
              "to": "https://softwarefactory-project.io/"
            },
            {
              "label": "RDO Project",
              "href": "https://www.rdoproject.org/"
            },
            {
              "label": "Opendev Project",
              "href": "https://opendev.org"
            },
            {
              "label": "Pagure",
              "href": "https://pagure.io/user/danpawlik"
            },
            {
              "label": "Copr",
              "href": "https://copr.fedorainfracloud.org/coprs/danpawlik/"
            }
          ]
        },
        {
          "title": "External Blogs",
          "items": [
            {
              "label": "Software Factory Project blog",
              "to": "https://www.softwarefactory-project.io/"
            },
            {
              "label": "RDO Project",
              "href": "https://blogs.rdoproject.org/tag/news/"
            },
            {
              "label": "Opendev Project",
              "href": "https://www.openstack.org/blog/"
            },
            {
              "label": "Fedora",
              "href": "https://communityblog.fedoraproject.org/"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2020 by Dan Pawlik. Built with Docusaurus."
    }
  },
  "presets": [
    [
      "@docusaurus/preset-bootstrap",
      {
        "docs": {
          "sidebarPath": "/home/dpawlik/danpawlik2/my-web-page/sidebars.js",
          "editUrl": "https://github.com/danpawlik/danpawlik.github.io/edit/master/website/"
        },
        "blog": {
          "showReadingTime": true,
          "editUrl": "https://github.com/danpawlik/danpawlik.github.io/edit/master/website/blog"
        }
      }
    ]
  ],
  "baseUrlIssueBanner": true,
  "onDuplicateRoutes": "warn",
  "customFields": {},
  "plugins": [],
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};