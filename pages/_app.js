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
						{ link: '/search', label: 'Find a Park' },
						{ link: '/about', label: 'About' },
						{ link: '/admin/dashboard', label: 'Admin' },
					]}
				/>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	)
}

export default MyApp
