import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { supabase } from '../config/config'

export async function getServerSideProps() {
	// Get the current home from the database

	let { data: parks, error } = await supabase
		.from('parks')
		.select('*')
		.range(0, 350)

	if (error) {
		console.log(error)
	}

	return {
		props: {
			parks,
		},
	}
}

export default function Admin({ parks }) {
	return (
		<div>
			<Head>
				<title>Parks of Atlanta, Georgia</title>
				<meta name='description' content='Database of Atlanta Parks' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<h1 className='text-xl'>Park Data Management</h1>
				<div>
					{parks.map((park) => (
						<div key={park.ID}>
							<h2>{park.Name}</h2>
							<p>{park.Address}</p>
						</div>
					))}
				</div>
			</main>
		</div>
	)
}
