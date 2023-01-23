import { createStyles, Card, Text, Badge, Title, Stack } from '@mantine/core'

import { iconPicker } from '../utils/functions'
import parkPicture from '../public/placeholder.png'

import { setColor } from '../utils/functions'

import Image from 'next/image'
import Link from 'next/link'

const useStyles = createStyles((theme) => ({
	// card: {
	// 	backgroundColor:
	// 		theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
	// 	width: '15rem',
	// },
}))

export function NewCard({ park }) {
	const activities = [
		{ name: 'Playground', status: park.Playground, icon: 'GiKidSlide' },
		{
			name: 'Pavilion',
			status: park.Pavilion,
			icon: 'TbBuildingWarehouse',
		},
		{
			name: 'Splash Pad',
			status: park.Splash_pad,
			icon: 'GiWaterSplash',
		},
		{
			name: 'Basketball',
			status: park.Basketball,
			icon: 'GiBasketballBasket',
		},
		{ name: 'Skate park', status: park.Skate_park, icon: 'GiSkateboard' },
		{ name: 'Dog park', status: park.Dog_park, icon: 'GiSittingDog' },
		{ name: 'sport fields', status: park.Fields, icon: 'GiSoccerField' },
		{ name: 'tennis', status: park.Tennis, icon: 'GiTennisBall' },
	]

	const { classes } = useStyles()

	return (
		<Link href={`/park/${park.ID}`}>
			<Card
				withBorder
				p='md'
				m='sm'
				className={`${classes.card} hover:scale-102 transition-transform w-70`}
				shadow='sm'
				radius='sm'
			>
				<Card.Section className='relative'>
					<Image src={parkPicture} alt={park.Name} height={200} width={288} />
					<Badge
						color={setColor(park)}
						variant='light'
						className='absolute z-2 top-3 right-3'
					>
						{park.Classification}
					</Badge>
				</Card.Section>

				<Stack mt='xs' h={100} justify='start' spacing='xs'>
					<Title order={4} weight={700}>
						{park.Name}
					</Title>
					<Text mb='md' color='dimmed' size='xs'>
						<p className='text-sm'>{park.Address}</p>
					</Text>
				</Stack>

				<Card.Section className='h-10 border-t '>
					<div className='flex justify-center my-2'>
						{activities.map((item) => {
							if (item.status) {
								return (
									<div key={item.name} className='inline-block mx-1 text-xl'>
										{iconPicker(item.icon)}
									</div>
								)
							}
						})}
					</div>
				</Card.Section>
			</Card>
		</Link>
	)
}
