import { Card, Text, Badge, Title, Stack } from '@mantine/core'

import { iconPicker } from '../utils/functions'
import parkPicture from '../public/placeholder.png'

import { setColor } from '../utils/functions'
import { useEffect, useState } from 'react'

import { supabase } from '../config/config'

import Image from 'next/image'
import Link from 'next/link'

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

	const [picture, setPicture] = useState([])

	useEffect(() => {
		const fetchPicture = async () => {
			let { data: picture, errors } = await supabase
				.from('pictures')
				.select()
				.eq('park_id', parseInt(park.ID))
				.limit(1)
			console.log(errors)
			return picture
		}
		// fetchpicture()
		fetchPicture().then((data) => {
			// console.log(data)
			setPicture(data[0]?.url)
		})
	}, [park.ID])

	const color = setColor(park)

	return (
		<Link href={`/park/${park.ID}`}>
			<Card
				withBorder
				p='md'
				m='sm'
				className='transition-transform hover:scale-102 w-70'
				shadow='sm'
				radius='sm'
			>
				<Card.Section className='relative'>
					<Image
						src={picture ? picture : parkPicture}
						alt={park.Name}
						height={200}
						width={288}
						style={{
							height: '200px',
							objectFit: 'cover',
						}}
					/>
					<Badge
						color={color}
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

				<Card.Section className='h-10 border-t' bg={color + '.1'}>
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
