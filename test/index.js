'use strict'

const postcss = require('postcss');
const expect = require('chai').expect;

const plugin = require('../index.js');

const opts = {
	sizes: {
	    xxs: '-xxs-',
	    xs: '-xs-',
	    s: '-s-',
	    m: '-m-',
	    l: '-l-',
	    xl: '-xl-',
	    xxl: '-xxl-'
	}
}

describe('postcss-mq', () => {

	it('Должен заменять xs(val) на MediaQueries', () => {
		return run(patterns().one.input, patterns().one.output, opts);
	})

	it('Должен заменять xs(val), s(val), m(val) на несколько MediaQueries', () => {
		return run(patterns().many.input, patterns().many.output, opts);
	})

	it('Если в блоке нет правил кроме целевого, должен удалить блок', () => {
		return run(patterns().one.input, patterns().one.output, opts);
	})

	it('Если в блоке есть правила помимо целевого, должен оставлять блок, но удалить целевое правило', () => {
		return run(patterns().withAnotherDecl.input, patterns().withAnotherDecl.output, opts);
	})

	it('MediaQueries всегда следуют после остальных правил из блока', () => {
		return Promise.all([
			run(patterns().withAnotherDecl.input, patterns().withAnotherDecl.output, opts),
			run(patterns().withManyAnotherDecl.input, patterns().withManyAnotherDecl.output, opts)
		])
	})

	it('Правила из блока сохраняют порядок. MQ-правила следуют в том же порядке как объявлены в блоке', () => {
		return run(patterns().sequence.input, patterns().sequence.output, opts);
	})

	it('Порядок MQ для одного правила всегда соответствует порядку xxs,xs,s,m...', () => {
		return run(patterns().sequence.input, patterns().sequence.output, opts);
	})

	it('Если не переданы sizes, должен ничего не делать и возвращать как есть', () => {
		return run(patterns().many.input, patterns().many.input);
	})

})






function patterns(){
	return {
		one: { 
			input: '.block{ margin: xs(1px) }',
			output: `
				@media -xs- {
				    .block {
				        margin: 1px
				    }
				}
			`
		},
		many: { 
			input: '.block{ color: xs(red), s(green), m(blue) }',
			output: `
				@media -xs- {
				    .block {
				        color: red
				    }
				}
				@media -s- {
				    .block {
				        color: green
				    }
				}
				@media -m- {
				    .block {
				        color: blue
				    }
				}
			`
		},
		withAnotherDecl: {
			input: `
				.block { 
				    margin: xs(1px);
				    color: red
				}
			`,
			output: `
				.block {
			        color: red
			    }
				@media -xs- {
				    .block {
				        margin: 1px
				    }
				}
			`
		},
		withManyAnotherDecl: {
			input: `
				.block {
					padding: 10rem; 
				    margin: xs(1px);
				    color: red
				}
			`,
			output: `
				.block {
					padding: 10rem;
			        color: red
			    }
				@media -xs- {
				    .block {
				        margin: 1px
				    }
				}
			`
		},
		sequence: {
			input: `
				.block {
					padding: 10rem; 
				    margin: xs(1px), s(2px);
				    color: red;
				    padding: xs(3px), s(4px)
				}
			`,
			output: `
				.block {
					padding: 10rem;
			        color: red
			    }
				@media -xs- {
				    .block {
				        margin: 1px
				    }
				}
				@media -s- {
				    .block {
				        margin: 2px
				    }
				}
				@media -xs- {
				    .block {
				        padding: 3px
				    }
				}
				@media -s- {
				    .block {
				        padding: 4px
				    }
				}
			`
		},
		sequenceInDecl: {
			input: `
				.block { 
				    margin: s(1px), xs(2px), m(3px), l(4px);
				}
			`,
			output: `
				@media -xs- {
				    .block {
				        margin: 2px
				    }
				}
				@media -s- {
				    .block {
				        margin: 1px
				    }
				}
				@media -m- {
				    .block {
				        padding: 3px
				    }
				}
				@media -l- {
				    .block {
				        padding: 4px
				    }
				}
			`
		}
	}
} 

function toFormat(code){
	return code.replace(/[\s\t\n]+/gi, '')
}

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(toFormat(result.css)).to.equal(toFormat(output));
            expect(result.warnings().length).to.equal(0);
        });
}