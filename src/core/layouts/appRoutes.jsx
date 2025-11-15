import RequestsRoutesConfig from "../../modules/requests/routesConfig";
import KycRoutesConfig from '../../modules/kyc/routesConfig';

const additionalModuleRoutes = [
  ...BanksRoutes,
  ...CardsRoutes,
  ...RequestsRoutesConfig,
  ...KycRoutesConfig,
];
