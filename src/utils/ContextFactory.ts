import { MsalAuthenticationService } from "mgwdev-m365-helpers/lib-commonjs/services/MsalAuthenticationService";
import { AuthHttpClient } from "mgwdev-m365-helpers/lib/dal/http/AuthHttpClient";
import { FetchHttpClient } from "mgwdev-m365-helpers/lib/dal/http/FetchHttpClient";
import { ISPEditorContext } from "../model/ISPEditorContext";

export class ContextFactory {
    private context?: ISPEditorContext;
    constructor(protected appId: string = "2f694ae4-e15c-410f-9ce4-a99bb39a21f1") {

    }
    public async getExtensionContext(): Promise<ISPEditorContext> {
        if (!this.context) {
            let authService = new MsalAuthenticationService(this.appId);
            let graphClient = new AuthHttpClient(authService, new FetchHttpClient());
            let spHttpClient = new AuthHttpClient(authService, new FetchHttpClient());

            let contextData = await this.getSPContextualData();
            spHttpClient.resourceUri = contextData.tenant;

            this.context = {
                authProvider: authService,
                graphClient,
                spHttpClient,
                tenantUrl: contextData.tenant,
                currentSiteUrl: contextData.siteUrl,
                currentPageUrl: contextData.pageUrl
            }
        }
        return this.context;
    }
    protected getSPContextualData(): Promise<{ tenant: string, siteUrl: string, pageUrl: string }> {
        return new Promise((resolve, error) => {
            chrome.tabs.query({ active: true }, tabs => {
                let urlString = tabs[0].url;
                if (urlString) {
                    let url = new URL(urlString);
                    let tenant = url.origin;
                    let siteRegex = /https?:\/\/(?<hostName>[\w.]*)(\/sites\/.*?(\/|$)|$|\/)/;
                    let regexMatch = urlString.match(siteRegex);
                    if (regexMatch) {
                        let siteUrl = regexMatch[0];
                        if (siteUrl.lastIndexOf("/") === siteUrl.length - 1) {
                            siteUrl = siteUrl.substring(0, siteUrl.length - 1);
                        }
                        resolve({
                            tenant,
                            siteUrl,
                            pageUrl: urlString
                        })
                    }
                    resolve({
                        tenant,
                        siteUrl: "",
                        pageUrl: urlString
                    });
                }
                error("Unable to get the page");
            })
        })
    }
}