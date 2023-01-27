import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { supabase } from '../config/config'

export async function getServerSideProps() {
	let { data: parks, error } = await supabase
		.from('parks')
		.select('*')
		.range(0, 50)
		.order('ID', { ascending: true })

	if (error) {
		console.log(error)
	}

	return {
		props: {
			parks,
		},
	}
}

export default function Admin({ parks }) {
	let [isOpen, setIsOpen] = useState(false)

	let [onePark, setPark] = useState(null)
	// let [isSubmitting, setSubmitting] = useState(false)

	return (
		<div>
			<main>
				<Dialog
					open={isOpen}
					as='div'
					className='relative z-10'
					onClose={() => setIsOpen(false)}
				>
					<div className='fixed inset-0 bg-black/30' aria-hidden='true' />

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex items-center justify-center min-h-full p-4 text-center'>
							<Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl'>
								{onePark ? (
									<div>
										<Dialog.Title>Edit data for: {onePark.Name}</Dialog.Title>
										<Formik
											initialValues={{
												Name: onePark.Name,
												Address: onePark.Address,
												Acreage: onePark.Acreage,
												Classification: onePark.Classification,
												NPU: onePark.NPU,
												Council_District: onePark.Council_District,
												Zip_Code: onePark.Zip_Code,
												latitude: onePark.latitude,
												longitude: onePark.longitude,
												playground: onePark.playground,
												splashpad: onePark.splashpad,
												dog_park: onePark.dog_park,
												sport_fields: onePark.sport_fields,
												basketball: onePark.basketball,
												tennis: onePark.tennis,
												gazebo: onePark.gazebo,
												skate: onePark.skate,
												boundary: onePark.boundary,
												description: onePark.description,
												favorite: onePark.favorite,
												likes: onePark.likes,
											}}
											validate={(values) => {
												const errors = {}
											}}
											onSubmit={async (values) => {
												const { error } = await supabase
													.from('parks')
													.update({
														Name: values.Name,
														Address: values.Address,
														Acreage: values.Acreage,
														Classification: values.Classification,
														NPU: values.NPU,
														Council_District: values.Council_District,
														Zip_Code: values.Zip_Code,
														latitude: values.latitude,
														longitude: values.longitude,
														playground: values.playground,
														splashpad: values.splashpad,
														dog_park: values.dog_park,
														sport_fields: values.sport_fields,
														basketball: values.basketball,
														tennis: values.tennis,
														gazebo: values.gazebo,
														skate: values.skate,
														boundary: values.boundary,
														description: values.description,
														favorite: values.favorite,
														likes: values.likes,
													})
													.eq('ID', onePark.ID)

												console.log(error)
											}}
										>
											{() => (
												<Form className='flex flex-col'>
													<label>Park name:</label>
													<Field type='text' name='Name' />
													<label>Park Address:</label>
													<Field type='text' name='Address' />
													<label>Park Size (Acres):</label>
													<Field type='number' name='Acreage' />
													<label>Park Classification:</label>
													<Field type='text' name='Classification' />
													<label>Neighborhood Planning Unit:</label>
													<Field type='text' name='NPU' />
													<label>City Council District:</label>
													<Field type='number' name='Council_District' />
													<label>Zip Code:</label>
													<Field type='number' name='Zip_Code' />
													<label>Latitude:</label>
													<Field type='number' name='latitude' />
													<label>Longitude:</label>
													<Field type='number' name='longitude' />
													<div className='flex flex-row flex-wrap p-2 justify-evenly'>
														<label>
															Playground:
															<Field type='checkbox' name='playground' />
														</label>
														<label>
															Splash Pad:
															<Field type='checkbox' name='splashpad' />
														</label>{' '}
														<label>
															Dog Park:
															<Field type='checkbox' name='dog_park' />
														</label>{' '}
														<label>
															Sport Fields:
															<Field type='checkbox' name='sport_fields' />
														</label>
														<label>
															Basketball:
															<Field type='checkbox' name='basketball' />
														</label>{' '}
														<label>
															Tennis:
															<Field type='checkbox' name='tennis' />
														</label>{' '}
														<label>
															Gazebo:
															<Field type='checkbox' name='gazebo' />
														</label>{' '}
														<label>
															Skate Park:
															<Field type='checkbox' name='skate' />
														</label>
													</div>
													<label>Description:</label>
													<Field as='textarea' name='description' />
													<label>Boundary:</label>
													<Field as='textarea' name='boundary' />
													<label>
														Favorite:
														<Field type='checkbox' name='favorite' />
													</label>
													<label>Likes:</label>
													<Field type='number' name='likes' />
													<div className='flex flex-row justify-center '>
														<button
															className='w-auto px-2 my-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
															type='submit'
														>
															Submit
														</button>
														<button
															className='p-2 px-2 m-2 my-2 rounded-md bg-slate-200 hover:bg-slate-300'
															onClick={() => setIsOpen(false)}
														>
															Cancel
														</button>
													</div>
												</Form>
											)}
										</Formik>
									</div>
								) : (
									'loading'
								)}
							</Dialog.Panel>
						</div>
					</div>
				</Dialog>

				<h1 className='flex justify-center m-4 text-xl'>
					Park Data Management
				</h1>
				<div className='m-2'>
					<table className='text-sm table-auto'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Address</th>
								<th>Acres</th>
								<th>Classification</th>
								<th>NPU</th>
								<th>Council District</th>
								<th>Zip Code</th>
								<th>Lat</th>
								<th>Lon</th>
								<th>Playground</th>
								<th>Splash Pad</th>
								<th>Dog Park</th>
								<th>Sport Fields</th>
								<th>Basketball</th>
								<th>Tennis</th>
								<th>Gazebo</th>
								<th>Skate Park</th>
								<th>Boundary</th>
								<th>Pictures</th>
								<th>Description</th>
								<th>Favorite</th>
								<th>Likes</th>
							</tr>
						</thead>
						<tbody>
							{parks.map((park) => (
								<tr
									key={park.ID}
									onDoubleClick={() => {
										console.log('hello')
										setPark(park)
										setIsOpen(true)
									}}
									className='p-2 m-2 border rounded-md hover:bg-blue-300'
								>
									<td>{park.Name}</td>
									<td>{park.Address}</td>
									<td>{park.Acreage}</td>
									<td>{park.Classification}</td>
									<td>{park.NPU}</td>
									<td>{park.Council_District}</td>
									<td>{park.Zip_Code}</td>
									<td>{park.latitude}</td>
									<td>{park.longitude}</td>
									<td>{park.playground ? 'Y' : 'N'}</td>
									<td>{park.splashpad ? 'Y' : 'N'}</td>
									<td>{park.dog_park ? 'Y' : 'N'}</td>
									<td>{park.sport_fields ? 'Y' : 'N'}</td>
									<td>{park.basketball ? 'Y' : 'N'}</td>
									<td>{park.tennis ? 'Y' : 'N'}</td>
									<td>{park.gazebo ? 'Y' : 'N'}</td>
									<td>{park.skate ? 'Y' : 'N'}</td>
									<td>{park.boundary}</td>
									<td>{park.description}</td>
									<td>{park.favorite}</td>
									<td>{park.likes}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	)
}
