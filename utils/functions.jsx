import { GiKidSlide, GiWaterSplash, GiBasketballBasket, GiSkateboard, GiSittingDog, GiSoccerField, GiTennisBall } from 'react-icons/gi'

import { MdPool } from 'react-icons/md'

import { TbBuildingWarehouse } from 'react-icons/tb'

export function iconPicker(icon)
{
	switch (icon) {
		case 'GiKidSlide':
			return <GiKidSlide />
		case 'GiWaterSplash':
			return <MdPool />
		case 'GiBasketballBasket':
			return <GiBasketballBasket />
		case 'GiSkateboard':
			return <GiSkateboard />
		case 'GiSittingDog':
			return <GiSittingDog />
		case 'GiSoccerField':
			return <GiSoccerField />
		case 'GiTennisBall':
			return <GiTennisBall />
		case 'TbBuildingWarehouse':
			return <TbBuildingWarehouse />
		default:
			return null
	}
}

export const setColor = (data) =>
{
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