import Image from "next/image"
import Link from "next/link"

import { iconPicker } from "../utils/functions"

import parkPicture from '../public/osarugue-igbinoba-xiTTfeBdbs8-unsplash.jpg'

export default function Card({ park })
{
    const activities = [
        { name: 'Playground', status: park.Playground, icon: 'GiKidSlide' },
        { name: 'Pavilion', status: park.Pavilion, icon: 'TbBuildingWarehouse' },
        { name: 'Splash Pad', status: park.Splash_pad, icon: 'GiWaterSplash' },
        { name: 'Basketball', status: park.Basketball, icon: 'GiBasketballBasket' },
        { name: 'Skate park', status: park.Skate_park, icon: 'GiSkateboard' },
        { name: 'Dog park', status: park.Dog_park, icon: 'GiSittingDog' },
        { name: 'sport fields', status: park.Fields, icon: 'GiSoccerField' },
        { name: 'tennis', status: park.Tennis, icon: 'GiTennisBall' },
    ]

    return (
        <div className="p-2 m-2 transition-transform border rounded-sm w-80 hover:scale-102 h-84 hover:bg-slate-200 bg-slate-100">
            <Link
                href={`/park/${park.ID}`}
            >
                <div className="flex-col">
                    <Image src={parkPicture} alt='park picture' />
                    <h2 className="mt-2 text-lg font-semibold">{park.Name}</h2>
                    <p>{park.Address}</p>
                    {park.Acreage ? (<p>{park.Acreage} Acres</p>) : ('')}
                </div>
                <div>
                    {activities.map(item =>
                    {
                        if (item.status) {
                            return (<div key={item.name} className="inline-block mx-1 text-lg">{iconPicker(item.icon)}</div>)
                        }
                    })}
                </div>
            </Link>
        </div>
    )
}