import { visit } from 'unist-util-visit';

export default function addBasePath(basePath: string) {
  return function () {
    return function (ast) {
      visit(ast, 'link', node => {
        if (node.url.startsWith('/') && !node.url.startsWith(`${basePath}/`)) {
          node.url = `${basePath}${node.url}`;
        }
      });

      return ast;
    };
  };
}
