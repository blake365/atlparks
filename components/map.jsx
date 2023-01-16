import { Wrapper } from '@googlemaps/react-wrapper'
import { createCustomEqual } from 'fast-equals'
import
{
	useRef,
	useEffect,
	useState,
	isValidElement,
	Children,
	cloneElement,
} from 'react'

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) =>
{
	if (
		isLatLngLiteral(a) ||
		a instanceof google.maps.LatLng ||
		isLatLngLiteral(b) ||
		b instanceof google.maps.LatLng
	) {
		return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
	}

	// TODO extend to other types

	// use fast-equals for other objects
	return deepEqual(a, b)
})

function useDeepCompareMemoize(value)
{
	const ref = useRef()

	if (!deepCompareEqualsForMaps(value, ref.current)) {
		ref.current = value
	}

	return ref.current
}

function useDeepCompareEffectForMaps(callback, dependencies)
{
	useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

const GMap = ({ onClick, onIdle, children, style, ...options }) =>
{
	const ref = useRef(null)
	const [map, setMap] = useState()

	useEffect(() =>
	{
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, {}))
		}
	}, [ref, map])

	// because React does not do deep comparisons, a custom hook is used
	useDeepCompareEffectForMaps(() =>
	{
		if (map) {
			map.setOptions(options)
		}
	}, [map, options])

	return (
		<>
			<div ref={ref} style={style} />
			{Children.map(children, (child) =>
			{
				if (isValidElement(child)) {
					// set the map prop on the child component
					// @ts-ignore
					return cloneElement(child, { map })
				}
			})}
		</>
	)
}

export default GMap