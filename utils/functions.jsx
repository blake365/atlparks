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
