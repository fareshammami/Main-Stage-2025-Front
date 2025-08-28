import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8081', // 🔁 Keycloak server base URL
        realm: 'MainStageRealm',      // 🔁 Your realm
        clientId: 'springboot-frontendC' // 🔁 Your public client
      },
      initOptions: {
        onLoad: 'login-required', // or 'check-sso'
        checkLoginIframe: false
      },
      bearerExcludedUrls: ['/assets'] // Exclude static files
    });
}
