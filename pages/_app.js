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
