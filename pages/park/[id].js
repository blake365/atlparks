import { Wrapper } from '@googlemaps/react-wrapper'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'

import GMap from '../../components/map'
import {
	IconExternalLink,
	IconArrowRight,
	IconArrowLeft,
	IconThumbUp,
} from '@tabler/icons'

import {
	createStyles,
	Container,
	Title,
	Button,
	Group,
	Text,
	List,
	ThemeIcon,
	Loader,
	Paper,
	Stack,
	Badge,
	Box,
	Spoiler,
	Center,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import { supabase } from '../../config/config'
import { useRouter } from 'next/router'

import parkPicture from '../../public/placeholder.png'
import Marker from '../../components/marker'

import { Classifications } from '../../config/classifications'
import { NewCard } from '../../components/newcard'
import SubmitFeedback from '../../components/submitfeedback'
import { setColor } from '../../utils/functions'

const useStyles = createStyles((theme) => ({
	inner: {
		// display: 'flex',
		// justifyContent: 'space-between',
		paddingTop: theme.spacing.xl * 1,
		// paddingBottom: theme.spacing.xl * 1,
		// [theme.fn.smallerThan('md')]: {
		// 	flexDirection: 'column-reverse',
		// },
	},

	content: {
		maxWidth: '100%',
		margin: 'auto',
	},

	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontFamily: `${theme.fontFamily}`,
		fontSize: 55,
		lineHeight: 1.2,
		fontWeight: 900,
		// [theme.fn.smallerThan('xs')]: {
		// 	fontSize: 28,
		// },
	},

	image: {
		flex: 1,
		margin: 'auto',
		marginBottom: '1rem',
	},

	pages: {
		width: 80,
	},
}))

export async function getStaticPaths() {
	// Get all the homes IDs from the database
	let { data: parks, error } = await supabase.from('parks').select('ID')

	// console.log(parks)

	const paths = parks.map((park) => ({
		params: { id: park.toString() },
	}))

	return {
		paths: paths,
		fallback: 'blocking',
	}
}

export async function getStaticProps({ params }) {
	// console.log(params.id)
	let { data: parkData, error } = await supabase
		.from('parks')
		.select('*')
		.eq('ID', params.id)

	// console.log(typeof params.id)
	if (!parkData) {
		return {
			notFound: true,
		}
	}

	// console.log(error)
	let { data: pictures, errors } = await supabase
		.from('pictures')
		.select()
		.eq('park_id', parseInt(params.id))

	return {
		props: {
			parkData,
			pictures,
		},
		revalidate: 86400, // In seconds
	}
}

async function updateLikes(id, currentLikes) {
	// console.log(id, currentLikes)
	const newLikes = currentLikes + 1
	const result = await supabase
		.from('likes')
		.update({ likes: newLikes })
		.eq('ID', id)
		.select()
	// console.log(result.data[0].likes)
	return result.data[0].likes
}

const compileData = (data) => {
	// console.log(data)
	const traits = [
		'Playground',
		'Splash_pad',
		'Basketball',
		'Tennis',
		'Fields',
		'Pavilion',
		'Dog_park',
		'Skate_park',
	]
	let output = []

	traits.forEach((element) => {
		// console.log(data[element])
		if (data[element]) {
			let string = element
			if (string === 'Splash_pad') {
				output.push('Pool / Splash Pad')
			} else if (string.indexOf('_') !== -1) {
				const [first, second] = string.split('_')
				const result = `${first} ${second
					.charAt(0)
					.toUpperCase()}${second.slice(1)}`
				output.push(result)
			} else {
				output.push(string)
			}
		}
	})

	return output
}

const processClass = (string) => {
	if (string) {
		const searchWords = string.split(' ')
		for (let key in Classifications) {
			for (let i = 0; i < searchWords.length; i++) {
				if (key.toLowerCase().includes(searchWords[i].toLowerCase())) {
					return Classifications[key]
				}
			}
		}
	} else {
		return ''
	}
}

const setZoom = (acres) => {
	if (acres < 5) {
		return 18
	} else if (acres < 15) {
		return 17
	} else if (acres < 100) {
		return 16
	} else {
		return 15
	}
}

const render = (status) => {
	return <h1>{status}</h1>
}

const Park = ({ parkData, pictures }) => {
	const router = useRouter()
	const { id } = router.query
	const { classes } = useStyles()

	const [likes, setLikes] = useState(null)
	const [token, setToken] = useState(null)
	const [nearby, setNearby] = useState([])

	const mapRef = useRef(null)

	const handleAddressClick = () => {
		mapRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	let park = null
	let features = null
	let color = null
	let center = null
	let zoom = 10

	if (parkData) {
		park = parkData[0]
		features = compileData(park)
		color = setColor(park)
		center = { lat: park.latitude, lng: park.longitude }
		// setLikes(park.likes)
		zoom = setZoom(park.Acreage)
	}

	useEffect(() => {
		const storedToken = localStorage.getItem('AtlParkLikes')
		if (storedToken) {
			setToken(JSON.parse(storedToken))
		}

		const fetchLikes = async () => {
			if (id) {
				let { data: parks, error } = await supabase
					.from('likes')
					.select('likes')
					.eq('ID', id)
				// console.log('data', parks[0].likes)
				// console.log(error)
				setLikes(parks[0].likes)
			}
		}
		fetchLikes()
	}, [id])

	useEffect(() => {
		const fetchNearby = async () => {
			const { data, error } = await supabase.rpc('nearby_parks', {
				lat: parkData[0].latitude,
				long: parkData[0].longitude,
			})
			// console.log(error)
			// console.log(data)
			return data
		}

		if (park) {
			fetchNearby().then((data) => setNearby(data))
		}
		// return setNearby(fetchNearby().slice(2))
	}, [park, parkData])

	// console.log(nearby)

	const handleLike = async () => {
		if (!token) {
			const token = { likes: [id] }
			localStorage.setItem('AtlParkLikes', JSON.stringify(token))
			setToken(token)
			const newLikes = await updateLikes(parseInt(id), likes)
			// console.log(newLikes)
			setLikes(newLikes)
		} else if (!token.likes.includes(id)) {
			const updateToken = (token) => {
				token = {
					likes: [...token.likes, id],
				}
				return token
			}
			let newToken = updateToken(token)
			localStorage.setItem('AtlParkLikes', JSON.stringify(newToken))
			setToken(newToken)
			const newLikes = await updateLikes(parseInt(id), likes)
			// console.log(newLikes)
			setLikes(newLikes)
		} else {
			return
		}
	}

	const pageTitle = `${park?.Name} in Atlanta, Georgia`

	return (
		<div>
			{park && features && color ? (
				<div className='pt-0 pb-8 mb-14'>
					<Head>
						<title>{pageTitle}</title>
						<meta name='description' content={park?.description} />
						<meta property='og:title' content={pageTitle} />
						<meta property='og:description' content={park?.description} />
					</Head>
					<Box mt='lg'>
						<Container>
							<Group position='apart' mb='sm'>
								<Button
									radius='sm'
									size='xs'
									component='a'
									href={`/park/${park.ID - 1}`}
									variant='default'
									leftIcon={<IconArrowLeft size={18} />}
									disabled={park.ID < 102}
									px='xs'
									w='110px'
								>
									Previous
								</Button>
								<Button
									radius='sm'
									size='xs'
									px='xs'
									variant='default'
									rightIcon={<IconThumbUp size={20} />}
									onClick={handleLike}
									c={token?.likes.includes(id) ? 'blue' : 'black'}
								>
									{likes}
								</Button>
								<Button
									radius='sm'
									size='xs'
									component='a'
									href={`/park/${park.ID + 1}`}
									variant='default'
									rightIcon={<IconArrowRight size={18} />}
									// TODO: function to find highest ID at the time
									disabled={park.ID > 496}
									px='xs'
									w='110px'
								>
									Next
								</Button>
							</Group>

							<div>
								<Group position='apart'>
									<Title
										variant='gradient'
										gradient={{ from: color, to: 'gray', deg: 135 }}
										// gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
										// fz={50}
										// fw={700}
										className={classes.title}
									>
										{park.Name}{' '}
									</Title>
									<Badge color={color} variant='outline'>
										{park.Classification}
									</Badge>
								</Group>
								<Text
									color='dimmed'
									mt='md'
									className='hover:underline'
									onClick={handleAddressClick}
								>
									{park.Address}
								</Text>
							</div>
							<div className={classes.inner}>
								<div className={classes.content}>
									{pictures.length > 0 ? (
										<Image
											src={pictures[0].url}
											alt={pictures[0].description}
											className={classes.image}
											width={700}
											height={800}
											priority
										/>
									) : (
										<Image
											src={parkPicture}
											alt='default'
											className={classes.image}
											width={300}
											height={800}
											priority
										/>
									)}
									<Group position='center' spacing='sm' align='center'>
										<Paper
											shadow='sm'
											p='sm'
											withBorder
											className={classes.pages}
										>
											<Text c='dimmed' ta='center'>
												Acres
											</Text>
											<Text fw='bold' fz='xl' ta='center'>
												{park.Acreage > 50
													? Math.round(park.Acreage)
													: park.Acreage}
											</Text>
										</Paper>
										<Paper
											shadow='sm'
											p='sm'
											withBorder
											className={classes.pages}
										>
											<Text c='dimmed' ta='center'>
												District
											</Text>
											<Text fw='bold' fz='xl' ta='center'>
												{park.Council_District}
											</Text>
										</Paper>
										<Paper
											shadow='sm'
											p='sm'
											withBorder
											className={classes.pages}
										>
											<Text c='dimmed' ta='center'>
												NPU
											</Text>
											<Text fw='bold' fz='xl' ta='center'>
												{park.NPU}
											</Text>
										</Paper>
									</Group>
									<Text color='' mt='md'>
										{park.description}
									</Text>

									<List
										my={15}
										spacing='sm'
										size='md'
										icon={
											<ThemeIcon size={16} radius='xl' color={color}>
												<IconCheck size={12} stroke={1.5} />
											</ThemeIcon>
										}
									>
										{features.length !== 0 && (
											<Title color='' order={4} mb='sm'>
												Amenities
											</Title>
										)}
										{features.map((item, index) => (
											<List.Item key={index}>{item}</List.Item>
										))}
									</List>
									<Stack spacing='xs'>
										<Title order={4}>{park.Classification}</Title>
										<Text>{processClass(park.Classification)}</Text>
									</Stack>
									<Group mt={30}>
										{park.website ? (
											<Button
												radius='sm'
												size='md'
												className={classes.control}
												component='a'
												href={park.website}
												variant='outline'
												rightIcon={<IconExternalLink size={20} />}
												target='_blank'
											>
												Park Website
											</Button>
										) : (
											''
										)}
									</Group>
								</div>
							</div>

							<SubmitFeedback id={park.ID} />

							{pictures.length > 1 && (
								<Text color='' size='xl' fw='bold'>
									Photos
								</Text>
							)}

							<Group
								className='flex justify-center mx-auto my-4'
								spacing='sm'
								position='center'
							>
								{pictures.map((image, index) => {
									if (index !== 0) {
										return (
											<Image
												src={image.url}
												alt='default'
												width={310}
												height={300}
												key={image.id}
											/>
										)
									}
								})}
							</Group>

							<Paper
								shadow='lg'
								radius='md'
								withBorder
								style={{ display: 'flex', height: '400px' }}
								ref={mapRef}
							>
								<Wrapper
									apiKey={process.env.NEXT_PUBLIC_MAPSAPI}
									render={render}
								>
									<GMap
										center={center}
										zoom={zoom}
										style={{
											height: '100%',
											flexGrow: 1,
											borderRadius: 10,
										}}
									>
										<Marker
											position={{ lat: park.latitude, lng: park.longitude }}
											title={park.Name}
										/>
									</GMap>
								</Wrapper>
							</Paper>
							{nearby.length > 0 ? (
								<Title align='center' mt='lg' pt='lg'>
									Nearby Parks
								</Title>
							) : (
								''
							)}
							<Group position='center' spacing='xs'>
								{nearby.length > 0 &&
									nearby.map((park) => {
										return <NewCard park={park} key={park.ID} />
									})}
							</Group>
						</Container>
					</Box>
				</div>
			) : (
				<Center>
					<Loader size='xl' variant='dots' mt='lg' />
				</Center>
			)}
		</div>
	)
}

export default Park
