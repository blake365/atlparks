import Image from "next/image"
import Link from "next/link"

import { GiKidSlide, GiWaterSplash, GiBasketballBasket, GiSkateboard, GiSittingDog, GiSoccerField, GiTennisBall } from 'react-icons/gi'

import { TbBuildingWarehouse } from 'react-icons/tb'

import parkPicture from '../public/osarugue-igbinoba-xiTTfeBdbs8-unsplash.jpg'

export default function Card({ park })
{
    const activities = [
        { name: 'playground', status: park.playground, icon: GiKidSlide },
        { name: 'splash pad', status: park.splashpad, icon: GiWaterSplash },
        { name: 'basketball', status: park.basketball, icon: GiBasketballBasket },
        { name: 'gazebo', status: park.gazebo, icon: TbBuildingWarehouse },
        { name: 'skate park', status: park.skate, icon: GiSkateboard },
        { name: 'dog park', status: park['dog park'], icon: GiSittingDog },
        { name: 'sport fields', status: park['sport fields'], icon: GiSoccerField },
        { name: 'tennis', status: park.tennis, icon: GiTennisBall },
    ]

    return (
        <div className="border rounded-sm w-80 p-2 m-2 hover:scale-102 transition-transform min-h-80 hover:bg-slate-200 bg-slate-100"><Link
            href={`/park/${park.ID}`}
        >
            <div className="flex-col">
                <Image src={parkPicture} alt='park picture' />
                <h2 className="text-lg mt-2 font-semibold">{park.Name}</h2>
                <p>{park.Address}</p>
                {park.Acreage ? (<p>{park.Acreage} Acres</p>) : ('')}
            </div>
            <div>
                {activities.map(item =>
                {
                    if (item.status) {
                        return item.icon
                    }
                })}
            </div>
        </Link>
        </div>
    )
}