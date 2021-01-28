const fs = require('fs');
const path = require('path');

const getFilenames = filePath =>
	fs
		.readdirSync(path.resolve(__dirname, filePath))
		.map(filename => filename.replace(/\.[^/.]+$/, ''));

const getHandlerFilePath = extensionsName =>
	`./../Events/${extensionsName}/handlers`;

const getHandlers = handlerFilePath =>
	getFilenames(handlerFilePath).map(handlerName => ({
		handlerName,
		handler: require(`${handlerFilePath}/${handlerName}`)
	}));

const groupByHandlerName = (handlerMap, { handlerName, handler }) => {
	(handlerMap[handlerName] = handlerMap[handlerName] || []).push(handler);
	return handlerMap;
};

module.exports = () =>
	getFilenames('../Events')
		.map(getHandlerFilePath)
		.flatMap(getHandlers)
		.reduce(groupByHandlerName, { ready: [] });