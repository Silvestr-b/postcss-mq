# PostCSS Mq [![Build Status][ci-img]][ci]

[PostCSS] plugin Make Media-Queries very easy to use. Try it!.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Silvestr-b/postcss-mq.svg
[ci]:      https://travis-ci.org/Silvestr-b/postcss-mq

From:
```css
.block{ 
	margin: s(4px), m(8px) 
}
```
To:
```css
.block{
  	color: red 
}
@media (min-width: 320px){
  	.block{
  	  	margin: 4px 
  	} 
}
@media (min-width: 460px){
  	.block{
  	  	margin: 8px 
  	} 
}
```

## Usage

```js
const options = {
	sizes: {
		xxs: '(min-width: 320px)', 
		xs: '(min-width: 460px)',
		// ...[s,m,l,xl,xxl]
	}
}

postcss([ require('postcss-mq')(options) ])
```

See [PostCSS] docs for examples for your environment.
