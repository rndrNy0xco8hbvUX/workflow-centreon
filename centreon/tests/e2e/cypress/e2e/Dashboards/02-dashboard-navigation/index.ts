import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

before(() => {
  cy.startWebContainer();
  cy.execInContainer({
    command: `sed -i 's@"dashboard": 0@"dashboard": 3@' /usr/share/centreon/config/features.json`,
    name: Cypress.env('dockerName')
  });
  cy.executeCommandsViaClapi(
    'resources/clapi/config-ACL/dashboard-configuration-creator.json'
  );
});

beforeEach(() => {
  cy.intercept({
    method: 'GET',
    url: '/centreon/api/internal.php?object=centreon_topology&action=navigationList'
  }).as('getNavigationList');
  cy.intercept({
    method: 'GET',
    url: '/centreon/api/latest/configuration/dashboards?page=1&limit=100'
  }).as('listAllDashboards');
  cy.loginByTypeOfUser({
    jsonName: 'user-dashboard-creator',
    loginViaApi: false
  });
});

Given('a user with access to the dashboards library', () => {
  cy.visit(`${Cypress.config().baseUrl}/centreon/monitoring/resources`);
});

When(
  'the user accesses the dashboard listing page on a platform with no dashboards',
  () => {
    cy.navigateTo({
      page: 'Dashboard',
      rootItemNumber: 0
    });
  }
);

Then(
  'a message and a button to create a new dashboard are displayed instead of the dashboards',
  () => {
    cy.get('body').should('contain.text', 'No dashboards found');
    cy.getByLabel({ label: 'view', tag: 'button' }).should('not.exist');
    cy.getByLabel({ label: 'create', tag: 'button' }).should('exist');
  }
);

Given('a non-empty list of dashboards that fits on a single page', () => {
  cy.insertDashboardList('dashboards/navigation/01-onepage.json');
  cy.visit(`${Cypress.config().baseUrl}/centreon/home/dashboards`);
});

When('the user clicks on the dashboard they want to select', () => {
  cy.getByLabel({ label: 'view', tag: 'button' })
    .contains('dashboard-to-locate')
    .click();
});

Then(
  'the user is redirected to the information page for this dashboard',
  () => {
    cy.url().should(
      'not.eq',
      `${Cypress.config().baseUrl}/centreon/home/dashboards`
    );

    cy.requestOnDatabase({
      database: 'centreon',
      query: 'DELETE FROM dashboard'
    });
  }
);

Given(
  'a non-empty library of dashboards that does not fit on a single page',
  () => {
    cy.insertDashboardList('dashboards/navigation/02-morethanonepage.json');
    cy.visit(`${Cypress.config().baseUrl}/centreon/home/dashboards`);
  }
);

When(
  'the user scrolls down on the page to look for a dashboard at the end of the dashboards library',
  () => {
    cy.getByLabel({ label: 'view', tag: 'button' })
      .contains('dashboard-to-locate')
      .should('not.exist');

    cy.getByLabel({ label: 'view', tag: 'button' })
      .contains('dashboard-name-0')
      .should('be.visible');

    cy.get('[data-variant="grid"]')
      .parent()
      .parent()
      .scrollTo('bottom', { duration: 200 });

    cy.getByLabel({ label: 'view', tag: 'button' })
      .contains('dashboard-name-96')
      .should('be.visible');

    cy.get('[data-variant="grid"]')
      .parent()
      .parent()
      .scrollTo('bottom', { duration: 200 });
  }
);

Then(
  'the elements of the library displayed on the screen progressively change and the dashboard to locate ends up appearing',
  () => {
    cy.getByLabel({ label: 'view', tag: 'button' })
      .contains('dashboard-name-0')
      .should('not.be.visible');

    cy.getByLabel({ label: 'view', tag: 'button' })
      .contains('dashboard-to-locate')
      .should('exist');
  }
);

When('the user clicks on the dashboard that just appeared', () => {
  cy.getByLabel({ label: 'view', tag: 'button' })
    .contains('dashboard-to-locate')
    .click();
});

Then(
  'the user is redirected to the information page for that dashboard',
  () => {
    cy.url().should(
      'not.eq',
      `${Cypress.config().baseUrl}/centreon/home/dashboards`
    );

    cy.requestOnDatabase({
      database: 'centreon',
      query: 'DELETE FROM dashboard'
    });
  }
);