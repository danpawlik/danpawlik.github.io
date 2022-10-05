
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','deb'),
  exact: true,
},
{
  path: '/blog',
  component: ComponentCreator('/blog','80f'),
  exact: true,
},
{
  path: '/blog/2020/04/14/blog-plugin',
  component: ComponentCreator('/blog/2020/04/14/blog-plugin','1c4'),
  exact: true,
},
{
  path: '/blog/2020/04/14/large-blog-post',
  component: ComponentCreator('/blog/2020/04/14/large-blog-post','a7f'),
  exact: true,
},
{
  path: '/blog/hello-world',
  component: ComponentCreator('/blog/hello-world','130'),
  exact: true,
},
{
  path: '/blog/hola',
  component: ComponentCreator('/blog/hola','abb'),
  exact: true,
},
{
  path: '/blog/tags',
  component: ComponentCreator('/blog/tags','c41'),
  exact: true,
},
{
  path: '/blog/tags/blog',
  component: ComponentCreator('/blog/tags/blog','6ab'),
  exact: true,
},
{
  path: '/blog/tags/docusaurus',
  component: ComponentCreator('/blog/tags/docusaurus','328'),
  exact: true,
},
{
  path: '/blog/tags/facebook',
  component: ComponentCreator('/blog/tags/facebook','60d'),
  exact: true,
},
{
  path: '/blog/tags/hello',
  component: ComponentCreator('/blog/tags/hello','2ec'),
  exact: true,
},
{
  path: '/blog/tags/hola',
  component: ComponentCreator('/blog/tags/hola','da5'),
  exact: true,
},
{
  path: '/blog/welcome',
  component: ComponentCreator('/blog/welcome','fd6'),
  exact: true,
},
{
  path: '/docs',
  component: ComponentCreator('/docs','96b'),
  
  routes: [
{
  path: '/docs/',
  component: ComponentCreator('/docs/','87d'),
  exact: true,
},
{
  path: '/docs/doc2',
  component: ComponentCreator('/docs/doc2','fd3'),
  exact: true,
},
{
  path: '/docs/doc3',
  component: ComponentCreator('/docs/doc3','e02'),
  exact: true,
},
{
  path: '/docs/mdx',
  component: ComponentCreator('/docs/mdx','955'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
