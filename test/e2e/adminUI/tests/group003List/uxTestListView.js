var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIApp.gotoSigninScreen();

		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List view should allow users to create a new list item': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickCreateItemButton();

		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Name Field Test 1' }, modelTestConfig: NameModelTestConfig, },
			{ name: 'fieldA', input: { firstName: 'First 1', lastName: 'Last 1' }, modelTestConfig: NameModelTestConfig, },
		]);

		browser.adminUIInitialFormScreen.save();

		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.assertPageItemCountTextEquals('Showing 1 Name');

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 2, name: 'name', value: 'Name Field Test 1', modelTestConfig: NameModelTestConfig }
		]);
	},
	'List view should allow users to create more new list items': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickCreateItemButton();

		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Name Field Test 2' }, modelTestConfig: NameModelTestConfig, },
			{ name: 'fieldA', input: { firstName: 'First 2', lastName: 'Last 2' }, modelTestConfig: NameModelTestConfig, },
		]);

		// TODO: refactor
		browser.adminUIInitialFormScreen.section.form
			.click('@createButton');

		browser.adminUIApp.waitForItemScreen();

		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.assertPageItemCountTextEquals('Showing 2 Names');

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 2, name: 'name', value: 'Name Field Test 1', modelTestConfig: NameModelTestConfig, },
			{ row: 2, column: 2, name: 'name', value: 'Name Field Test 2', modelTestConfig: NameModelTestConfig, }
		]);
	},
	'List view should allow users to browse an item by clicking the item name': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickItemFieldValue([
			{ row: 1, column: 2, name: 'name', modelTestConfig: NameModelTestConfig, }
		]);

		browser.adminUIApp.waitForItemScreen();
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickItemFieldValue([
			{ row: 1, column: 2, name: 'name', modelTestConfig: NameModelTestConfig, }
		]);

		browser.adminUIApp.waitForItemScreen();

		// TODO: refactor
		browser.adminUIItemScreen.click('@listBreadcrumb');

		browser.adminUIApp.waitForListScreen();
	},
	'List view should allow users to search for items': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		// TODO: refactor
		browser.adminUIListScreen
			.setValue('@searchInputField', 'Name Field Test 2');

		browser.adminUIApp.waitForListScreen();

		browser.adminUIListScreen.assertPageItemCountTextEquals('Showing 1 Name');

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 2, name: 'name', value: 'Name Field Test 2', modelTestConfig: NameModelTestConfig, },
		]);
	},
	'List view should allow users to clear search filter': function (browser) {
		browser.adminUIListScreen.clickSearchInputClearIcon();

		browser.adminUIApp.waitForListScreen();

		browser.adminUIListScreen.assertPageItemCountTextEquals('Showing 2 Names');

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 2, name: 'name', value: 'Name Field Test 1', modelTestConfig: NameModelTestConfig, },
			{ row: 2, column: 2, name: 'name', value: 'Name Field Test 2', modelTestConfig: NameModelTestConfig, },
		]);
	},
	'List view should allow users to delete items': function (browser) {
		browser.adminUIListScreen.clickDeleteItemIcon([
			{ row: 1, column: 1 }
		])

		browser.adminUIApp.waitForDeleteConfirmationScreen();

		// TODO: refactor
		browser.adminUIDeleteConfirmation.click('@deleteButton');

		browser.adminUIApp.waitForListScreen();

		browser.adminUIListScreen.assertPageItemCountTextEquals('Showing 1 Name');

		browser.adminUIListScreen.assertItemFieldValueEquals([
			{ row: 1, column: 2, name: 'name', value: 'Name Field Test 2', modelTestConfig: NameModelTestConfig, },
		]);
	},
	'List view should allow users to delete last item': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Name'});

		browser.adminUIListScreen.clickDeleteItemIcon([
			{ row: 1, column: 1 }
		])

		browser.adminUIApp.waitForDeleteConfirmationScreen();

		// TODO: refactor
		browser.adminUIDeleteConfirmation.click('@deleteButton');

		browser.adminUIApp.waitForListScreen();

		browser.adminUIListScreen.assertNoItemsFoundTextEquals('No names found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... resetting state changes': function (browser) {
	},
};
