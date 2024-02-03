# webpack-unstable-moduleid
Repository to troubleshoot Webpack unstable moduleId issue
[Discuss thread](https://github.com/webpack/webpack/issues/14521#issuecomment-1924161957)

## What is the issue
When I update any devDependencies that is used by Webpack, e.g. babel-loader, css-loader, JS files will
have a different hash. It invalidates long-term caching.

## How to reproduce

1. Run `npm install`
2. Run `npm build`
3. Change `"css-loader": "=6.9.1"` to `"css-loader": "=6.10.0"` and run `npm install` and `npm build` again

You will see JS filenames are changed.

I have also tried to change `"css-loader": "=6.9.1"` to `"css-loader": "=6.9.0"`. The JS filenames will change too.

