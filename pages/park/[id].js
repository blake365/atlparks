import { useRouter } from 'next/router'

import Image from 'next/image'

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
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import { supabase } from '../../config/config'

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

	// console.log(error)

	return {
		props: {
			parkData,
		},
	}
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

const Park = ({ parkData }) => {
	// const router = useRouter()
	// const { id } = router.query

	const { classes } = useStyles()

	let park = null
	let features = null
	let color = null
	if (parkData) {
		park = parkData[0]
		features = compileData(park)
		color = setColor(park)
	}

	// console.log(color)
	// console.log('component', park)

	return (
		<div className='pt-0 pb-8'>
			<main className='flex flex-col items-center justify-center flex-1 pb-0 min-h-100'>
				{park && features && color ? (
					<Box mt='lg'>
						<div>
							<Container>
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
													{Math.round(park.Acreage)}
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
												<ThemeIcon size={16} radius='xl'>
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
											<Button
												variant='outline'
												radius='sm'
												size='md'
												color={color}
												className={classes.control}
											>
												Submit A Tip
											</Button>
											<Button
												variant='default'
												radius='sm'
												size='md'
												className={classes.control}
											>
												Park Website
											</Button>
										</Group>
									</div>
									<Stack>
										<Image
											src={parkPicture}
											alt='park picture'
											className={classes.image}
										/>
									</Stack>
								</div>
							</Container>
							<div>Picture Gallery</div>
							<div>Maps</div>
						</div>
					</Box>
				) : (
					<Loader size='xl' variant='dots' />
				)}
			</main>
		</div>
	)
}

export default Park
