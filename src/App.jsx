import React from "react";
import { useMap } from "react-leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import countries from "./countries.json";
import cities from "./cities.json";
import regions from "./regions.json";

function ChangeView({ center, zoom }) {
	const map = useMap();
	map.setView(center, zoom);
	return null;
}

function App() {
	const [selected_country, set_selected_country] = React.useState(null);
	const [selected_city, set_selected_city] = React.useState(null);

	const [center, set_center] = React.useState([30.0561, 31.2394]);
	const [marker, set_marker] = React.useState(null);

	return (
		<>
			{/* Countries select box */}
			<select
				onChange={(e) => {
					set_selected_country(e.target.value);
					set_selected_city(null);
					set_marker(null);
				}}
			>
				<option selected disabled>
					Select country
				</option>
				{countries.map((c) => (
					<option value={c.id}>{c.name}</option>
				))}
			</select>

			{/* cities select box */}
			{selected_country && (
				<select
					onChange={(e) => {
						set_selected_city(e.target.value);
					}}
				>
					<option selected disabled>
						Select city
					</option>
					{cities
						.filter((c) => +c.country_id === +selected_country)
						.map((c) => (
							<option value={c.id}>{c.name}</option>
						))}
				</select>
			)}

			{selected_city && (
				<select
					onChange={(e) => {
						const region = regions.find((r) => +r.id === +e.target.value);
						if (region) {
							set_marker([region.lat, region.lng]);
							set_center([region.lat, region.lng]);
						}
					}}
				>
					<option selected disabled>
						Select region
					</option>
					{regions
						.filter((r) => +r.city_id === +selected_city)
						.map((r) => (
							<option value={r.id}>{r.name}</option>
						))}
				</select>
			)}

			<MapContainer center={center} zoom={6} scrollWheelZoom={false}>
				<ChangeView center={center} />

				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{marker && <Marker position={marker} />}
			</MapContainer>
		</>
	);
}

export default App;
