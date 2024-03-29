import {
	createStyles,
	Container,
	Title,
	Text,
	Button,
	Group,
} from '@mantine/core'

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 80,
		paddingBottom: 80,
	},

	inner: {
		position: 'relative',
	},

	image: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		zIndex: 0,
		opacity: 0.75,
	},

	content: {
		paddingTop: 0,
		position: 'relative',
		zIndex: 1,

		[theme.fn.smallerThan('sm')]: {
			paddingTop: 120,
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		textAlign: 'center',
		fontWeight: 900,
		fontSize: 38,

		[theme.fn.smallerThan('sm')]: {
			fontSize: 32,
		},
	},

	description: {
		maxWidth: 540,
		margin: 'auto',
		marginTop: theme.spacing.xl,
		marginBottom: theme.spacing.xl * 1.5,
	},
}))

export default function NothingFoundBackground() {
	const { classes } = useStyles()

	return (
		<Container className={classes.root}>
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title className={classes.title}>404</Title>
					<Title className={classes.title}>Nothing here</Title>
					<Text
						color='dimmed'
						size='lg'
						align='center'
						className={classes.description}
					>
						Page you are trying to open does not exist. You may have mistyped
						the address, or the page has been moved to another URL. If you think
						this is an error contact support.
					</Text>
					<Group position='center'>
						<Button component='a' href='/' size='md'>
							Take me home
						</Button>
					</Group>
				</div>
			</div>
		</Container>
	)
}
