import '../styles/globals.css'

import { MantineProvider, createEmotionCache } from '@mantine/core'
import { HeaderResponsive } from '../components/navbar'

const myCache = createEmotionCache({
	key: 'mantine',
	prepend: false,
})

function MyApp({ Component, pageProps }) {
	return (
		<>
			<MantineProvider
				emotionCache={myCache}
				withGlobalStyles
				withNormalizeCSS
				theme={{
					fontFamily: 'Verdana, sans-serif',
					primaryColor: 'blue',
					primaryShade: 7,
					colorScheme: 'light',
					colors: {
						'olive-green': [
							'#A3B46A',
							'#9AAD5C',
							'#90A352',
							'#84954B',
							'#788844',
							'#6C7A3E',
							'#606C38',
							'#545F30',
							'#485129',
							'#3C4422',
						],
						beige: [
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
							'#FEFAE0',
						],
						'burnt-orange': [
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
							'#BC6C25',
						],
					},
				}}
			>
				<HeaderResponsive
					links={[
						{ link: '/about', label: 'About' },
						{ link: '/search', label: 'Find a Park' },
						{ link: '/contribute', label: 'Contribute' },
					]}
				/>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	)
}

export default MyApp
