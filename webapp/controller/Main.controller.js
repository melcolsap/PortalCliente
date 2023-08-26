sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/layout/BlockLayoutRow",
	"sap/ui/layout/BlockLayoutCell",
	"sap/m/HBox",
	"sap/m/VBox",
	"sap/m/Toolbar",
	"sap/m/FlexBox",
	"sap/m/Link",
	"sap/m/Label",
	"sap/m/Button",
	"sap/ui/core/Fragment",
	"sap/ui/core/syncStyleClass",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, BlockLayoutRow, BlockLayoutCell, HBox, VBox, Toolbar, FlexBox, Link, Label, Button, Fragment, syncStyleClass, MessageToast, Filter,
	FilterOperator) {
	"use strict";
	var iTimeoutId;
//GPT4 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
	return Controller.extend("co.com.PortalCliente.PortalCliente.controller.Main", {
		onInit: function () {
			const valores = window.location.search;
			const urlParams = new URLSearchParams(valores);
			var sUsuario = urlParams.get('portalUser');
			var sPernr = urlParams.get('pernr');
			//this.byId("url").setText(urlParams);
			this.sPernr = sPernr;
			if (sUsuario !== undefined && sUsuario !== "" && sUsuario !== null) {
				sUsuario = sUsuario.toUpperCase();
			}
			
			const oJSONModelMenuSide = new sap.ui.model.json.JSONModel();
			oJSONModelMenuSide.loadData("model/MenuSide.json", false);
			this.getView().setModel(oJSONModelMenuSide, "viewModel");
			
			const oJSONModelFacturas = new sap.ui.model.json.JSONModel();
			oJSONModelFacturas.loadData("model/Facturas.json", false);
			this.getView().setModel(oJSONModelFacturas, "modelFacturas");
			
			this.BlockLayout = this.byId("BlockLayout");
			this.onConsultaDoc('100958');
			this.onConsultaFacturas('100950');
		},
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			switch (oItem.getText()) {
			case "Nuevo Elemento":
				this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
				this.onListarFacturas('1234');
				break;
			default:
				this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
				break;
			}
		},
		onConsultaDoc: function (kunnr){
			var aFilter = new Filter({
									path: "Kunnr",
									operator: FilterOperator.EQ,
									value1: kunnr 
								});	
			this.getView().getModel().read("/DocumentoVaSet('" + kunnr + "')", {
				urlParameters: {
					"$expand": "NavClienteToContratos"
				},
				method: "GET",
				success: jQuery.proxy(this.onSuccessDocument, this),
				error: jQuery.proxy(this.onErrorDocument, this)
				//filters: [aFilter]
			});					
		},
		onConsultaFacturas: function(kunnr){
			var aFilter = new Filter({
									path: "Zzkunnr",
									operator: FilterOperator.EQ,
									value1: kunnr
								});	
			this.getView().getModel().read("/FacturasSet", {
				async: false,
				success: jQuery.proxy(this.onSuccessFactura, this),
				error: jQuery.proxy(this.onErrorFactura, this),
				filters: [aFilter]
			});	
		},
		addItem: function (Vbeln, Kunnr, Bstnk){
			var oRow = new BlockLayoutRow();
			var oCell = new BlockLayoutCell();
			var oHBox = new HBox();
			var oVBox = new VBox();
			var oVBoxInside = new VBox();
			var oToolbarTitle = new Toolbar();
			var oToolbarFooter = new Toolbar();
			var oFlexBox = new FlexBox();
			var oLink = new Link();
			var oLabel = new Label();
			var oButton = new Button();
			
			oVBox.addStyleClass("tileContainerBorder tileContainerBackground sapUiSmallMargin");
			oToolbarTitle.addStyleClass("noBoarderToolbar");
			oLink.setText(Vbeln);
			oToolbarTitle.addContent(oLink);
			
			oVBox.addItem(oToolbarTitle);
			
			oFlexBox.setWrap("Wrap");
			oFlexBox.setAlignItems("Center");
			//oFlexBox.setRenderType("Bare");
			oFlexBox.addStyleClass("tileContainerFlexBox");
			oLabel.setText(Kunnr);
			//oLabel.addStyleClass("sapUiSmallMarginEnd");
			oVBoxInside.addItem(oLabel);
			//oFlexBox.addStyleClass("sapUiSmallMarginEnd");
			oFlexBox.addItem(oLabel);
			oVBox.addItem(oFlexBox);
			
			oToolbarFooter.addStyleClass("noBoderToolbar");
			oButton.setType("Transparent");
			oButton.setIcon("sap-icon://edit");
			oToolbarFooter.addContent(oButton);
			oVBox.addItem(oToolbarFooter);
			
			
			oCell.addContent(oVBox);
			oRow.addContent(oCell);
			//this.addRow();
			var maxContent = this.byId("BlockLayout").mAggregations.content.length - 1 > 0 ? this.byId("BlockLayout").mAggregations.content.length - 1 : 0;
			var maxCell = this.byId("BlockLayout").mAggregations.content[maxContent].mAggregations.content.length
			
			if(maxCell < 4){
				this.byId("BlockLayout").mAggregations.content[maxContent].addContent(oCell);
			}else{
				this.BlockLayout.addContent(oRow);	
			}
		},
		addRow: function (){
			var oRow = new BlockLayoutRow();
			var oCell = new BlockLayoutCell();
			let cell = 0;
			
			do {
				cell++
				oRow.addContent(oCell);
			}while(cell < 4);
			this.BlockLayout.addContent(oRow);
		},
		onWompiPrueba: function (oEvent){
			//sap.m.URLHelper.redirect("https://checkout.wompi.co/l/test_VPOS_5siX5j", true);
			var url = 'https://sandbox.wompi.co/v1?pub_test_Pkv7ZNMSTY13BetcJMmZEsyoMZCe7WKl';
			var urlPrd = 'https://production.wompi.co/v1';
			$wompi.initialize(function ( data, error ) {
			  if ( error === null ) {
			    var sessionId = data.sessionId
			    // `sessionId` es un string, por ejemplo: "1289_1696830983722-ab493d40c02e-278bab34-323va3"
			  }
			});
			var data = {
				  "acceptance_token": "eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2NzYyMjgyMzQtODQyMjQiLCJleHAiOjE2NzYyMzE4MzR9.8jMnrBwBRByW5aIbFFHjJSkl9xNdEVVe_qrqchaL-sE",
				  "amount_in_cents": 3000000,
				  "currency": "COP",
				  "customer_email": "example@wompi.co",
				  "payment_method": {
				    "type": "CARD",
				    "token": "tok_prod_280_32326B334c47Ec49a516bf1785247ba2",
				    "installments": 2
				  },
				  "payment_source_id": 1234,
				  "redirect_url": "https://mitienda.com.co/pago/resultado",
				  "reference": "TUPtdnVugyU40XlkhixhhGE6uYV2gh89",
				  "customer_data": {
				    "phone_number": "573307654321",
				    "full_name": "Juan Alfonso Pérez Rodríguez",
				    "legal_id": "1234567890",
				    "legal_id_type": "CC"
				  },
				  "shipping_address": {
				    "address_line_1": "Calle 34 # 56 - 78",
				    "address_line_2": "Apartamento 502, Torre I",
				    "country": "CO",
				    "region": "Cundinamarca",
				    "city": "Bogotá",
				    "name": "Pepe Perez",
				    "phone_number": "573109999999",
				    "postal_code": "111111"
				  }
				};
			this.onOpenDialog();	
	        $.ajax({
	            beforeSend: function() {
	                //armamos la url y la asignamos a una var       
	            },
	            url: url,
	            type: 'POST',
	            accepts: "application/json",
        		data: data,
	            success: function (resp) {
	                console.log(resp)
	            },
	            error: function (jqXHR, estado, error) {
	                console.log(error +":" + " " + estado)
	            },
	            timeout: 10000
	        });
		},
		onWompi: function (oEvent){
			var url = 'https://sandbox.wompi.co/v1/merchants/pub_test_Pkv7ZNMSTY13BetcJMmZEsyoMZCe7WKl';
			this.onOpenDialog();
			$.ajax({
	            beforeSend: function() {
	                //armamos la url y la asignamos a una var       
	            },
	            context: this,
	            url: url,
	            type: 'GET',
	            accepts: "application/json",
        		//data: data,
	            success: function (resp) {
	                console.log(resp)
	                this.acceptance_token = resp.data.presigned_acceptance.acceptance_token;
	                this.permalink = resp.data.presigned_acceptance.permalink;
	                this.id = resp.data.id; 
					this.closedBusyDialog();
	            },
	            error: function (jqXHR, estado, error) {
	                console.log(error +":" + " " + estado);
					this.closedBusyDialog();
	            },
	            timeout: 10000
	        });
		},
		onWompiPOST: function (oEvent){
			var url = 'https://sandbox.wompi.co/v1/transactions';
			var data = {
				  "acceptance_token": this.acceptance_token,//"eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2NzYyMjgyMzQtODQyMjQiLCJleHAiOjE2NzYyMzE4MzR9.8jMnrBwBRByW5aIbFFHjJSkl9xNdEVVe_qrqchaL-sE",
				  "amount_in_cents": 3000000,
				  "currency": "COP",
				  "customer_email": "example@wompi.co",
				  //"payment_source_id": this.id,
				  "redirect_url": "https://mitienda.com.co/pago/resultado",
				  "reference": "verge:3",
				  "customer_data": {
				    "legal_id": "1234567890",
				    "full_name": "Juan Alfonso Pérez Rodríguez",
				    "phone_number": "573307654321",
				    "legal_id_type": "CC"
				  },
				  "payment_method": {
				    "type": "BANCOLOMBIA_TRANSFER",
				    "user_type": "PERSON", // Tipo de persona
				    "payment_description": "Pago Malta",
				    "sandbox_status": "APPROVED"
				    //"token": "tok_prod_280_32326B334c47Ec49a516bf1785247ba2",
				    //"installments": 2
				  },
				  "shipping_address": {
				    "address_line_1": "Calle 34 # 56 - 78",
				    "address_line_2": "Apartamento 502, Torre I",
				    "country": "CO",
				    "region": "Cundinamarca",
				    "city": "Bogotá",
				    "name": "Pepe Perez",
				    "phone_number": "573109999999",
				    "postal_code": "111111"
				  }
				};
			$.ajax({
	            beforeSend: function() {
	                //armamos la url y la asignamos a una var       
	            },
	            context: this,
	            url: url,
	            type: 'POST',
	            accepts: "application/json",
        		data: JSON.stringify(data),
        		headers: {"Authorization": 'Bearer pub_test_Pkv7ZNMSTY13BetcJMmZEsyoMZCe7WKl'},
	            success: function (resp) {
	                console.log(resp);
					this.closedBusyDialog();
	            },
	            error: function (jqXHR, estado, error) {
	                console.log(error +":" + " " + jqXHR.responseJSON.error.reason);
					this.closedBusyDialog();
	            },
	            timeout: 10000
	        });
		},
		onOpenDialog: function () {
			// load BusyDialog fragment asynchronously
			if (!this._pBusyDialog) {
				this._pBusyDialog = Fragment.load({
					name: "co.com.PortalCliente.PortalCliente.view.BusyDialog",
					controller: this
				}).then(function (oBusyDialog) {
					this.getView().addDependent(oBusyDialog);
					syncStyleClass("sapUiSizeCompact", this.getView(), oBusyDialog);
					return oBusyDialog;
				}.bind(this));
			}

			this._pBusyDialog.then(function(oBusyDialog) {
				oBusyDialog.open();
				//this.simulateServerRequest();
			}.bind(this));
		},

		simulateServerRequest: function () {
			// simulate a longer running operation
			iTimeoutId = setTimeout(function() {
				this._pBusyDialog.then(function(oBusyDialog) {
					oBusyDialog.close();
				});
			}.bind(this), 3000);
		},

		closedBusyDialog: function (){
			this._pBusyDialog.then(function(oBusyDialog) {
				oBusyDialog.close();
			});
		},

		onDialogClosed: function (oEvent) {
			clearTimeout(iTimeoutId);

			if (oEvent.getParameter("cancelPressed")) {
				MessageToast.show("The operation has been cancelled");
			} else {
				MessageToast.show("The operation has been completed");
			}
		},
		onListarFacturas: function (Aufnr) {
			var oTable = this.byId("TablaFacturas");
			var aFilter = [];
			var oItemTemplate = new sap.ui.core.ListItem({text:"{Descripcion}"});
			
			oTable.bindItems({
				path: "/modelFacturas",
				template: oItemTemplate
			});
			this.byId("TablaFacturas").setVisible(true);
		},
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("rootPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Ampliar barra Navegación.');
			} else {
				oToggleButton.setTooltip('Contraer barra Navegación.');
			}
		},
		onSuccessDocument: function (oData){
			console.log(oData);
			oData.results.forEach(element=>{
				this.addItem(element.Vbeln, element.Kunnr, element.Bstnk);	
			});
		},
		onErrorDocument: function (oError){
			console.log(oError);
		},
		onSuccessFactura: function (oData){
			console.log(oData);
			//https://ui5.sap.com/#/entity/sap.m.StandardListItem/sample/sap.m.sample.StandardListItemWrapping/code
		},
		onErrorFactura: function (oError){
			console.log(oError);
		},
		onAfterRendering: function(){
			var oToolPage = this.byId("rootPage");
			oToolPage.setSideExpanded(false);
			var oToggleButton = this.byId('sideNavigationToggleButton');
			oToggleButton.setTooltip('Ampliar barra Navegación.');
		
		}
	});
});