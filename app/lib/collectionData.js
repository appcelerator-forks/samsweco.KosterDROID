Ti.include('/SQL.js');

var info_urlCollection = Alloy.Collections.info_urlModel;
var info_Collection = Alloy.Collections.infoModel;
var media_Collection = Alloy.Collections.mediaModel;
var trail_Collection = Alloy.Collections.trailsModel;
var infoCoord_Collection = Alloy.Collections.infospotCoordinatesModel;
var hotspot_Collection = Alloy.Collections.hotspotModel;
var jsonfile_Collection = Alloy.Collections.jsonFilesModel;
var letter_Collection = Alloy.Collections.letterModel;
var hotspottrail_Collection = Alloy.Collections.hotspot_trailsModel;

//-----------------------------------------------------------
// infoUrl
//-----------------------------------------------------------
function returnUrlById(urlId) {
	info_urlCollection.fetch({
		query : getUrlById + urlId + '"'
	});
	var urlJson = info_urlCollection.toJSON();

	return urlJson;
}

function returnUrlByInfoId(infoId) {
	info_urlCollection.fetch({
		query : getUrlsByInfoId + infoId + '"'
	});
	var urlJson = info_urlCollection.toJSON();

	return urlJson;
}


//-----------------------------------------------------------
// info
//-----------------------------------------------------------
function returnAllInfo() {
	info_Collection.fetch();
	var infoJson = info_Collection.toJSON();

	return infoJson;
}

function returnSpecificInfo(infoSpecId) {
	info_Collection.fetch({
		query : getInfoById + infoSpecId + '"'
	});
	var infoJson = info_Collection.toJSON();

	return infoJson;
}


//-----------------------------------------------------------
// media
//-----------------------------------------------------------
function returnSpecificPics(SpecPicId) {
	media_Collection.fetch({
		query : getImgsByHotspotId + SpecPicId + '"'
	});
	var mediaJson = media_Collection.toJSON();

	return mediaJson;
}

function returnSpecificTrailPics(trailId) {
	media_Collection.fetch({
		query : getImgsForTrailById + trailId + '"'
	});
	var mediaJson = media_Collection.toJSON();

	return mediaJson;
}


//-----------------------------------------------------------
// trail
//-----------------------------------------------------------
function returnTrails() {
	trail_Collection.fetch();
	var trailsJson = trail_Collection.toJSON();

	return trailsJson;
}

function returnSpecificTrail(trailName) {
	trail_Collection.fetch({
		query : getTrailByName + trailName + '"'
	});
	var trailsJson = trail_Collection.toJSON();

	return trailsJson;
}

function returnSpecificTrailById(trailId) {
	trail_Collection.fetch({
		query : getTrailById + trailId + '"'
	});
	var trailsJson = trail_Collection.toJSON();

	return trailsJson;
}


//-----------------------------------------------------------
// infoCoord
//-----------------------------------------------------------
function returnSpecificIconsByTrailId(iconTrailInfId) {
	infoCoord_Collection.fetch({
		query : getDistInfospotsByTrailId + iconTrailInfId + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}

function returnSpecificIconsByType(infoType) {
	infoCoord_Collection.fetch({
		query : getInfoCoordByType + infoType + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}

function returnIconsByTrailId(trailId) {
	infoCoord_Collection.fetch({
		query : getInfospotsByTrailId + trailId + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}


//-----------------------------------------------------------
// hotspot
//-----------------------------------------------------------
function returnHotspots() {
	hotspot_Collection.fetch();
	var hotsJson = hotspot_Collection.toJSON();

	return hotsJson;
}

function returnSpecificHotspotsByTrailId(trailId) {
	hotspot_Collection.fetch({
		query : getHotspotsByTrailId + trailId + '"'
	});
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}

function returnHotspots() {
	hotspot_Collection.fetch();
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}

function returnSpecificHotspotsByName(name) {
	hotspot_Collection.fetch({
		query : getHotspotByName + name + '"'
	});
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}

function returnSpecificTrailsByHotspotId(hotId){
	hotspottrail_Collection.fetch({
		query : getTrailByHotspot + hotId + '"'
	});
	var hotspotTrailJson = hotspottrail_Collection.toJSON();
	
	return hotspotTrailJson;
}


//-----------------------------------------------------------
// jsonFile
//-----------------------------------------------------------
function returnJsonFiles(id) {
	jsonfile_Collection.fetch({
			query : getJsonFileById + id + '"'
		});
	var jsonfileJson = jsonfile_Collection.toJSON();

	return jsonfileJson;
}


//-----------------------------------------------------------
// letters
//-----------------------------------------------------------
function returnLetters() {
	letter_Collection.fetch();
	var letterJson = letter_Collection.toJSON();

	return letterJson;
}
