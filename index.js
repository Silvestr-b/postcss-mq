'use strict'

const postcss = require('postcss');


module.exports = postcss.plugin('postcss-mq', (options = {}) => {
	const sizeSet = ['xxs','xs','s','m','l','xl','xxl'];

	return root => {
		root.walkRules(rule => {
          	const medias = []; 
            
			rule.walkDecls(decl => {
				if(options.sizes && /(xxs|xs|s|m|l|xl|xxl)\([0-9A-Za-z\-]+\)/gi.test(decl.value)){
					const selector = rule.selector;

					sizeSet.forEach(size => {
						decl.value.split(',').forEach(item => {
							const itemSize = item.slice(0, item.indexOf('(')).replace(/\s/,'');
	
							if(size === itemSize){
								medias.push(
									`@media ${options.sizes[size]}{
										${postcss.rule({ selector: selector }).append({ prop: decl.prop, value: item.match(/\([0-9A-Za-z\-]+\)/)[0].slice(1,-1) })}
									}`
								)
							}		

						})
					})
                  
					decl.remove()
				}
			});
          	
          	rule.parent.insertAfter(rule, medias.join(''))

            if(rule.nodes.length <= 0){ rule.remove() } 
		});
	};
});