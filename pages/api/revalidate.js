const handler = async (req, res) => {
	console.log(req.body)
	await res.revalidate('/')

	const pathToRevalidate = `/park/${
		req.body?.record?.ID || req.body?.old_record?.ID
	}`
	await res.revalidate(pathToRevalidate)

	return res.send({ revalidated: true })
}

export default handler
