const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');


// Helper functions

const storageLocation = path.join(__dirname, "../", "db", "data.json");

const getData = () => {
	let content = JSON.parse(fs.readFileSync(storageLocation));
	return content.filter(x => x !== null);
};

const updateData = (content) => {
	let data = content.filter(x => x !== null)
	fs.writeFileSync(storageLocation, JSON.stringify(data));
};

function isValidUrl(url){
	try{
		new URL(url);
	}catch(_){
		return false;
	}
	return true;
}


// Controllers

exports.getURLS = (req, res) =>{
	res.status(200).json({
		success: true,
		message: "List of all bookmarks",
		bookmarks: getData(),
		count: getData().length
	});
};

exports.createURL = (req, res) =>{
	const { url } = req.body;

	if(url === undefined){
		res.status(500).json({
			success: false,
			message: "Oops! looks like you sent an invalid url. Please try again using a valid url!",
			error: "Invalid URL"
		});
	}else{
	
		request(url, (err, resp, html)=>{
			if(!err && resp.statusCode == 200){
				const $ = cheerio.load(html);
		
				const title = $('title').text();
				const desc = $('meta[name="description"]').attr('content');
				const favicon = $('link[rel="icon"]').attr('href') !== undefined ? $('link[rel="icon"]').attr('href') : $('link[rel="shortcut icon"]').attr('href');
	
				let imageURL = isValidUrl(favicon) === false ? `${url}/${favicon}` : favicon;
	
				let fileContent = getData();
				
				let bookmark = { title, desc, url, favicon: imageURL, id: ++fileContent.length };
	
				fileContent[fileContent.length] = bookmark;

				updateData(fileContent)
	
				res.status(201).json({
					success: true,
					message: "New Bookmark created successfully!"
				});
				
			}else{
				console.log(err);
				
				res.status(500).json({
					success: false,
					message: "Oops! looks like something went wrong. Please try again!",
					error: "Internal Server Error"
				});
			}
		})

	}
};


exports.deleteURL = (req, res) =>{
	let bookmarks = getData();

	let newlist = bookmarks.filter((bkm) => bkm.id != req.params.id);

	updateData(newlist);

	res.status(200).json({
		success: true,
		message: "Bookmark deleted successfully!"
	});
};