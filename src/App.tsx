import './App.scss';
import React from 'react';
import { ChannelInfo } from './background';
import { Loading } from './Loading';
import { ChannelInfoDisplay } from './ChannelInfoDisplay';
import { ErrorDisplay } from './ErrorDisplay';

export enum AppState {
    Loading,
    Error,
    Success,
}

export class App extends React.Component {
    state: {
        appState: AppState,
        channelInfo: ChannelInfo | null,
    }

    constructor(props: any) {
        super(props);
        this.state = {
            appState: AppState.Loading,
            channelInfo: null,
        };

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type !== 'urlChanged') {
                sendResponse(false);
            }

            this.requestChannelInfo();
            sendResponse(true);
        });
    }

    componentDidMount() {
        this.requestChannelInfo(); 
    }

    requestChannelInfo() {
        this.setState({
            appState: AppState.Loading,
            channelInfo: null,
        });
        const videoId = window.location.href.split('v=')[1];
        chrome.runtime.sendMessage({
            type: 'getChannelInfo',
            videoId,
        }).then((response) => {
            if (!response) {
                this.setState({
                    appState: AppState.Error,
                    channelInfo: null,
                });
                return;
            }

            this.setState({
                appState: AppState.Success,
                channelInfo: response,
            });
        }).catch((_) => {
            this.setState({
                appState: AppState.Error,
                channelInfo: null,
            });
        }
        );
    }
        
    render() {
        let content;
        switch (this.state.appState) {
            case AppState.Loading:
                content = Loading();
                break;
            case AppState.Error:
                content = ErrorDisplay();
                break;
            case AppState.Success:
                content = ChannelInfoDisplay(this.state.channelInfo);
                break;
        }

        return (
            <div className="app">
                {content}
            </div>
        );
    }
}