/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"co/com/PortalCliente/PortalCliente/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});