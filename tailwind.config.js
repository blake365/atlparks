/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	preflight: false,
	theme: {
		extend: {
			scale: {
				102: '1.02',
			},
			height: {
				83: '21rem',
				84: '22rem',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
