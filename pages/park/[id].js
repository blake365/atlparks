import { Wrapper, Status } from '@googlemaps/react-wrapper'
import Image from 'next/image'
import {
	useRef,
	useEffect,
	useState,
	isValidElement,
	Children,
	cloneElement,
} from 'react'

import { createCustomEqual } from 'fast-equals'
import {
	IconExternalLink,
	IconArrowRight,
	IconArrowLeft,
	IconThumbUp,
} from '@tabler/icons'

import {
	createStyles,
	// Image,
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
	ActionIcon,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import { supabase } from '../../config/config'
import { useRouter } from 'next/router'

import parkPicture from '../../public/osarugue-igbinoba-xiTTfeBdbs8-unsplash.jpg'

const useStyles = createStyles((theme) => ({
	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingTop: theme.spacing.xl * 1,
		paddingBottom: theme.spacing.xl * 2,
	},

	content: {
		maxWidth: 480,
		marginRight: theme.spacing.xl * 3,

		[theme.fn.smallerThan('md')]: {
			maxWidth: '100%',
			margin: 'auto',
		},
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

	control: {
		[theme.fn.smallerThan('xs')]: {
			flex: 1,
		},
	},

	image: {
		flex: 1,
		[theme.fn.smallerThan('sm')]: {
			display: 'none',
		},
		maxWidth: 500,
		maxHeight: '100%',
		margin: 'auto',
	},

	pages: {
		width: 80,
	},

	highlight: {
		position: 'relative',
		backgroundColor: theme.fn.variant({
			variant: 'light',
			color: theme.primaryColor,
		}).background,
		borderRadius: theme.radius.sm,
		padding: '4px 12px',
	},
}))

export async function getStaticPaths() {
	// Get all the homes IDs from the database
	let { data: parks, error } = await supabase.from('parks').select('ID')

	// console.log(parks)

	return {
		paths: parks.map((park) => ({
			params: { id: park.toString() },
		})),
		fallback: true,
	}
}

export async function getStaticProps({ params }) {
	// console.log(params.id)
	let { data: parkData, error } = await supabase
		.from('parks')
		.select('*')
		.eq('ID', params.id)

	// console.log(typeof params.id)

	// console.log(error)
	let { data: pictures, errors } = await supabase
		.from('pictures')
		.select()
		.eq('park_id', parseInt(params.id))

	// console.log('errors', errors)
	// console.log('pictures', pictures)
	// console.log('parkData', parkData)

	return {
		props: {
			parkData,
			pictures,
		},
	}
}

async function updateLikes(id, currentLikes) {
	console.log(id, currentLikes)
	const newLikes = currentLikes + 1
	const result = await supabase
		.from('parks')
		.update({ likes: newLikes })
		.eq('ID', id)
		.select()
	console.log(result.data[0].likes)
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
			if (string.indexOf('_') !== -1) {
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

const setColor = (data) => {
	let color
	switch (data.Classification) {
		case 'Regional':
			color = 'orange'
			break
		case 'Community':
			color = 'teal'
			break
		case 'Neighborhood':
			color = 'blue'
			break
		case 'Greenspot':
			color = 'green'
			break
		case 'Nature Preserve':
			color = 'lime'
			break
		case 'Playlot':
			color = 'violet'
			break
		case 'Park in Holding':
			color = 'yellow'
			break
		case 'Special Facility':
			color = 'gray'
			break
		case 'Plaza':
			color = 'indigo'
			break
		case 'Trail':
			color = 'lime'
			break
		default:
			color = 'white'
	}

	return color
}

const setZoom = (acres) => {
	if (acres < 5) {
		return 18
	} else if (acres < 25) {
		return 17
	} else if (acres < 100) {
		return 16
	} else {
		return 15
	}
}

const Map = ({ onClick, onIdle, children, style, ...options }) => {
	const ref = useRef(null)
	const [map, setMap] = useState()

	useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, {}))
		}
	}, [ref, map])

	// because React does not do deep comparisons, a custom hook is used
	useDeepCompareEffectForMaps(() => {
		if (map) {
			map.setOptions(options)
		}
	}, [map, options])

	return (
		<>
			<div ref={ref} style={style} />
			{Children.map(children, (child) => {
				if (isValidElement(child)) {
					// set the map prop on the child component
					// @ts-ignore
					return cloneElement(child, { map })
				}
			})}
		</>
	)
}

// const Marker = (options) => {
// 	const [marker, setMarker] = useState()

// 	useEffect(() => {
// 		if (!marker) {
// 			setMarker(new google.maps.Marker())
// 		}

// 		// remove marker from map on unmount
// 		return () => {
// 			if (marker) {
// 				marker.setMap(null)
// 			}
// 		}
// 	}, [marker])
// 	useEffect(() => {
// 		if (marker) {
// 			marker.setOptions(options)
// 		}
// 	}, [marker, options])
// 	return null
// }

const render = (status) => {
	return <h1>{status}</h1>
}

const Park = ({ parkData, pictures }) => {
	const router = useRouter()
	const { id } = router.query
	const { classes } = useStyles()

	const [likes, setLikes] = useState(null)
	const [token, setToken] = useState(null)

	useEffect(() => {
		const storedToken = localStorage.getItem('AtlParkLikes')
		if (storedToken) {
			setToken(JSON.parse(storedToken))
		}

		const fetchLikes = async () => {
			if (id) {
				let { data: parks, error } = await supabase
					.from('parks')
					.select('likes')
					.eq('ID', id)
				// console.log('data', parks[0].likes)
				console.log(error)
				setLikes(parks[0].likes)
			}
		}
		fetchLikes()
	}, [id])

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

	const handleLike = async () => {
		if (!token) {
			const token = { likes: [id] }
			localStorage.setItem('AtlParkLikes', JSON.stringify(token))
			setToken(token)
			const newLikes = await updateLikes(parseInt(id), likes)
			console.log(newLikes)
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
			console.log(newLikes)
			setLikes(newLikes)
		} else {
			return
		}
	}

	// console.log(pictures)

	// console.log(color)
	// console.log('component', park)

	return (
		<div className='pt-0 pb-8'>
			<main className='flex flex-col items-center justify-center flex-1 pb-0 min-h-100'>
				{park && features && color ? (
					<Box mt='lg'>
						<Container>
							<Group position='apart' mb='sm'>
								<Button
									radius='sm'
									size='sm'
									className={classes.control}
									component='a'
									href={`/park/${park.ID - 1}`}
									variant='default'
									leftIcon={<IconArrowLeft size={18} />}
									disabled={park.ID < 102}
								>
									Previous
								</Button>
								<Button
									radius='sm'
									size='sm'
									px='sm'
									className={classes.control}
									variant='default'
									rightIcon={<IconThumbUp size={20} />}
									onClick={handleLike}
									c={token?.likes.includes(id) ? 'blue' : 'black'}
								>
									{likes}
								</Button>
								<Button
									radius='sm'
									size='sm'
									className={classes.control}
									component='a'
									href={`/park/${park.ID + 1}`}
									variant='default'
									rightIcon={<IconArrowRight size={18} />}
									disabled={park.ID > 496}
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
								<Text color='dimmed' mt='md'>
									{park.Address}
								</Text>
							</div>
							<div className={classes.inner}>
								<div className={classes.content}>
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
										mt={30}
										spacing='sm'
										size='md'
										icon={
											<ThemeIcon size={16} radius='xl' color={color}>
												<IconCheck size={12} stroke={1.5} />
											</ThemeIcon>
										}
									>
										<Text color='' size='lg' fw='bold' mb='md'>
											Amenities:
										</Text>
										{features.map((item, index) => (
											<List.Item key={index}>{item}</List.Item>
										))}
										{features.length === 0 && (
											<Text color='red' size='sm'>
												Amenities not added yet
											</Text>
										)}
									</List>

									<Group mt={30}>
										{/* <Button
												variant='outline'
												radius='sm'
												size='md'
												color={color}
												className={classes.control}
											>
												Submit A Tip
											</Button> */}
										{park.website ? (
											<Button
												radius='sm'
												size='md'
												className={classes.control}
												component='a'
												href={park.website}
												variant='default'
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
								<Stack>
									{pictures.length > 0 ? (
										<Image
											src={pictures[0].url}
											alt={pictures[0].description}
											className={classes.image}
											width={300}
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
								</Stack>
							</div>

							<Text color='' size='xl' fw='bold'>
								Photo Gallery
							</Text>
							<Spoiler maxHeight={300} showLabel='Show more' hideLabel='Hide'>
								<Group>
									{pictures.map((image) => {
										return (
											<Image
												src={image.url}
												alt='default'
												width={300}
												height={300}
												key={image.id}
											/>
										)
									})}
								</Group>
							</Spoiler>
							<Paper
								shadow='lg'
								radius='md'
								m='md'
								withBorder
								style={{ display: 'flex', height: '400px' }}
							>
								<Wrapper
									apiKey={process.env.NEXT_PUBLIC_MAPSAPI}
									render={render}
								>
									<Map
										center={center}
										zoom={zoom}
										style={{
											height: '100%',
											flexGrow: 1,
											borderRadius: 10,
										}}
									></Map>
								</Wrapper>
							</Paper>
						</Container>
					</Box>
				) : (
					<Loader size='xl' variant='dots' mt='lg' />
				)}
			</main>
		</div>
	)
}

export default Park

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
	if (
		isLatLngLiteral(a) ||
		a instanceof google.maps.LatLng ||
		isLatLngLiteral(b) ||
		b instanceof google.maps.LatLng
	) {
		return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
	}

	// TODO extend to other types

	// use fast-equals for other objects
	return deepEqual(a, b)
})

function useDeepCompareMemoize(value) {
	const ref = useRef()

	if (!deepCompareEqualsForMaps(value, ref.current)) {
		ref.current = value
	}

	return ref.current
}

function useDeepCompareEffectForMaps(callback, dependencies) {
	useEffect(callback, dependencies.map(useDeepCompareMemoize))
}
