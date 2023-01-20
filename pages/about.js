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
		zIndex: 0,

		[theme.fn.smallerThan('sm')]: {
			paddingTop: 0,
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

export default function About() {
	const { classes } = useStyles()

	return (
		<Container className={classes.root}>
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title className={classes.title}>Atlanta Parks Database</Title>
					<Text
						color='dimmed'
						size='lg'
						align='center'
						className={classes.description}
					>
						This site is intended to be a resource for the people of Atlanta.
						This site is not affiliated with the city nor any government entity.
						The information provided on this site is a combination of publicly
						available data provided by the City of Atlanta and information
						gathered through research and visiting the many wonderful parks the
						city has to offer. Information provided here may be incomplete or
						inaccurate.
					</Text>
				</div>
			</div>
		</Container>
	)
}
