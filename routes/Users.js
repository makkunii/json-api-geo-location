const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const fs = require('fs');

// Get all routes
router.get('/', async (req, res) => {
	const users = await User.find();

	res.json(users);
});

// Create new quote
router.post('/new', async (req, res) => {
	const newUser = new User(req.body);
	
	const savedUser = await newUser.save();

	res.json(savedUser);
});

// Get specific quote
router.get('/get/:id', async (req, res) => {
	const q = await User.findById({ _id: req.params.id });

	res.json(q);
});

// Delete a quote
router.delete('/delete/:id', async (req, res) => {
	const result = await User.findByIdAndDelete({ _id: req.params.id });

	res.json(result);
});

// Update a quote
router.patch('/update/:id', async (req, res) => {
	const q = await User.updateOne({_id: req.params.id}, {$set: req.body});

	res.json(q);
});


const filePath = './data/geolocation.json';
let data = null;

try {
  data = JSON.parse(fs.readFileSync(filePath));
} catch (err) {
  console.error(err);
}

// Display All geolocation
router.get('/api/geolocation', (req, res) => {
	const regions = Object.values(data);
	res.send(regions);
  });

// Display Regions Only
router.get('/api/region', (req, res) => {
	const regions = Object.values(data).map(regionData => regionData.region_name);
	res.send(regions);
  });

//Display Province Base in Regions  
router.get('/api/provinces/:region_name', async (req, res) => {
	const region_name = req.params.region_name;
	const regionData = Object.values(data).find(regionData => regionData.region_name === region_name);

	if (!regionData) {
	res.status(404).send('Region not found');
	return;
	}
	const provinces = Object.keys(regionData.province_list);
	res.send(provinces);
});

// Display City Base on Province, region
router.get('/api/cities/:province_list/:region_name', async (req, res) => {
	
	const province_name = req.params.province_list;
	const region_name = req.params.region_name;

	const regionData = Object.values(data).find(regionData => regionData.region_name === region_name);
	const provinceData = Object.values(regionData.province_list).find(provinceData => provinceData.province_name = province_name);
	console.log(provinceData);

	if (!provinceData) {
		res.status(404).send('Province not found');
		return;
		}

		const provinces = Object.keys(provinceData.municipality_list);
		res.send(provinces);
	
});

// Display Barangay Base on City,Province, region
router.get('/api/barangay/:municipality_list/:province_list/:region_name', async (req, res) => {
	
	const municipality_list = req.params.municipality_list;
	const province_name = req.params.province_list;
	const region_name = req.params.region_name;

	const regionData = Object.values(data).find(regionData => regionData.region_name === region_name);
	const provinceData = Object.values(regionData.province_list).find(provinceData => provinceData.province_name = province_name);
	const cityData = Object.values(provinceData.municipality_list).find(cityData => cityData.municipality_list = municipality_list);
	
	if (!cityData) {
		res.status(404).send('City not found');
		return;
		}

		const cities = Object.values(cityData.barangay_list);
		res.send(cities);
	
});


module.exports = router;