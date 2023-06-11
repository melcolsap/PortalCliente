/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"co/com/PortalCliente/PortalCliente/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});