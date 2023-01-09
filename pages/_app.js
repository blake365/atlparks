import '../styles/globals.css'

import { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { HeaderResponsive } from '../components/navbar'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					primaryColor: 'red',
					primaryShade: 8,
					colorScheme: 'light',
				}}
			>
				<HeaderResponsive
					links={[
						{ link: '/about', label: 'About' },
						{ link: '/search', label: 'Find a Park' },
						{ link: '/feedback', label: 'Help Out' },
					]}
				/>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	)
}

export default MyApp
