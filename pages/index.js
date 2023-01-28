import Head from 'next/head'
import { useRouter } from 'next/router'

import GMap from '../components/map'
import Marker from '../components/marker'
import { Wrapper } from '@googlemaps/react-wrapper'

import { Title } from '@mantine/core'

import { supabase } from '../config/config'
import { useEffect, useState } from 'react'
import { HeroContentLeft } from '../components/hero'
import { NewCard } from '../components/newcard'

export async function getStaticProps() {
	let { data: parks, error } = await supabase
		.from('parks')
		.select('*')
		.is('favorite', true)
		.order('ID', { ascending: true })

	if (error) {
		// console.log(error)
	}

	return {
		props: {
			parks,
		},
	}
}

// const render = (status) => {
// 	return <h1>{status}</h1>
// }

// const handleClick = () => {
// 	console.log(park.ID)
// 	return router.push(`/park/${park.ID}`)
// }

export default function Home({ parks }) {
	return (
		<div className='pt-0 pb-8'>
			<Head>
				<title>Parks of Atlanta, Georgia</title>
				<meta name='description' content='Database of Atlanta Parks' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<HeroContentLeft />
			<main className='flex flex-col items-center justify-center flex-1 w-11/12 pb-4 mx-auto min-h-100'>
				<Title mt='lg'>Featured Parks</Title>
				<div className='flex flex-wrap items-center justify-center max-w-[960px] mb-8'>
					{parks.map((park) => {
						return <NewCard park={park} key={park.ID} />
					})}
				</div>
				{/* <div>Map of all ATL park locations?</div> */}
				{/* <Paper
					shadow='lg'
					radius='md'
					m='md'
					withBorder
					style={{
						display: 'flex',
						height: '500px',
						width: '90%',
						maxWidth: '960px',
					}}
				>
					<Wrapper apiKey={process.env.NEXT_PUBLIC_MAPSAPI} render={render}>
						<GMap
							center={{ lat: 33.755499, lng: -84.386421 }}
							zoom={12}
							style={{
								height: '100%',
								flexGrow: 1,
								borderRadius: 10,
							}}
						>
							{parks.map((park) => {
								if (park.latitude && park.longitude) {
									// console.log(park)
									return (
										<Marker
											position={{ lat: park.latitude, lng: park.longitude }}
											title={park.Name}
											key={park.ID}
											// onClick={(e) => alert(e.target.value)}
											// onClick={() => {
											// 	console.log(park.ID)
											// 	return router.push(`/park/${park.ID}`)
											// }}
										/>
									)
								}
							})}
						</GMap>
					</Wrapper>
				</Paper> */}
			</main>
		</div>
	)
}
