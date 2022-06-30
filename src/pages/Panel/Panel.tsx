import { MsalAuthenticationService } from 'mgwdev-m365-helpers/lib/services/MsalAuthenticationService';
import { AuthHttpClient } from 'mgwdev-m365-helpers/lib/dal/http/AuthHttpClient';
import { FetchHttpClient } from 'mgwdev-m365-helpers/lib/dal/http/FetchHttpClient';
import React from 'react';
import './Panel.css';
import { initializeIcons, PrimaryButton, SearchBox } from '@fluentui/react';
import { PaginatedView } from '../Common/PaginatedView';
import { GraphSearchPagedDataProvider } from 'mgwdev-m365-helpers/lib-commonjs/dal/dataProviders';
import { ISPEditorContext } from '../../model/ISPEditorContext';

const Panel = (props: {
  context: ISPEditorContext
}) => {
  React.useEffect(() => {
    initializeIcons();
    props.context.graphClient.get("https://graph.microsoft.com/v1.0/me").then(userResponse => userResponse.json()).then(user => setCurrentUser(user));
    props.context.spHttpClient.get(`${props.context.currentSiteUrl}/_api/web`, {
      headers: {
        accept: "application/json"
      }
    }).then(resp => resp.json()).then(web => setCurrentWeb(web));
  }, []);

  const [currentUser, setCurrentUser] = React.useState<any>();
  const [currentWeb, setCurrentWeb] = React.useState<any>();
  return (
    <div className="container">
      <h1>Dev Tools Panel 3</h1>
      <h2>{currentUser?.displayName}</h2>
      <h2>{currentWeb?.Title}</h2>
      <PrimaryButton onClick={() => {
        let methodString = `fetch(arguments[1] + "/_api/web", {
          headers: {
            Authorization: "Bearer " + arguments[0],
            accept: "application/json"
          }
        }).then(resp => resp.json()).then(data => alert(data.Title))`
        props.context.authProvider.getAccessToken(props.context.tenantUrl).then((token) => {
          let frame: HTMLIFrameElement = document.getElementById("testSandboxFrame") as HTMLIFrameElement;
          frame.contentWindow?.postMessage(JSON.stringify({
            method: methodString,
            token: token,
            siteUrl: props.context.currentSiteUrl
          }), "*");
        });
      }} text="Eval method" />
      <iframe id='testSandboxFrame' src="/Sandbox.html" />
    </div>
  );
};

export default Panel;
