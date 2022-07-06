import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { IAuthenticationService } from "mgwdev-m365-helpers/lib/services/IAuthenticationService";

export interface ISPEditorContext {
    tenantUrl: string;
    currentSiteUrl: string;
    currentPageUrl: string;
    graphClient: IHttpClient;
    spHttpClient: IHttpClient;
    authProvider: IAuthenticationService
}