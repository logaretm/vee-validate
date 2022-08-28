import { visit } from 'unist-util-visit';

export default function addBasePath(basePath: string) {
  return function () {
    return function (ast) {
      visit(ast, 'link', node => {
        if (node.url.startsWith('/') && !node.url.startsWith(`${basePath}/`)) {
          node.url = `${basePath}${node.url}`;
        }

        if (node.url.startsWith('http')) {
          addProperties(node, {
            rel: 'noopener',
            target: '_blank',
          });
        }
      });

      return ast;
    };
  };
}

function addProperties(node: any, props: Record<string, string>) {
  if (!node.data) {
    node.data = {};
  }

  if (!node.data.hProperties) {
    node.data.hProperties = {};
  }

  node.data.hProperties = {
    ...node.data.hProperties,
    ...props,
  };
}
