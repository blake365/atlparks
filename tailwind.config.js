/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			scale: {
				102: '1.02',
			},
			height: {
				84: '22rem',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
