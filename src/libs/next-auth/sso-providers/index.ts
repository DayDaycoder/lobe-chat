import Auth0 from './auth0';
import Authelia from './authelia';
import Authentik from './authentik';
import AzureAD from './azure-ad';
import Casdoor from './casdoor';
import CloudflareZeroTrust from './cloudflare-zero-trust';
import GenericOIDC from './generic-oidc';
import Github from './github';
import Logto from './logto';
import MicrosoftEntraID from './microsoft-entra-id';
import WeChat from './wechat';
import Zitadel from './zitadel';
import Hy4a from './hy4a';
import Hexin from './hexin';

export const ssoProviders = [
  Auth0,
  Authentik,
  AzureAD,
  GenericOIDC,
  Github,
  Zitadel,
  Authelia,
  Logto,
  CloudflareZeroTrust,
  Casdoor,
  MicrosoftEntraID,
  WeChat,
  // 自有4A SSO
  Hy4a,
  Hexin
];
