import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button} from "../components/Button";
import {useMsal} from "@azure/msal-react";
import {IPublicClientApplication, SilentRequest} from "@azure/msal-browser";

const Root = styled.div`
  display: grid;
  grid-template-rows: max-content minmax(0, 1fr);
  position: absolute;
  inset: 0;
  `
const Header = styled.div`
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-template-columns:  max-content 1fr max-content;
  padding: 0.5rem;
  border-bottom: 1px solid mediumpurple;
`
const Table = styled.table`
     width: 100%;
`

export interface AuthenticatedProps {
    onSignOut: () => void;
}

const Content = styled.div`
  overflow: auto;
  tr {
    height: 2rem;
    border-bottom: 1px solid mediumpurple;
  }
`


async function prepareToken(instance: IPublicClientApplication) {
    const account = instance.getAllAccounts()[0];
    const accessTokenRequest: SilentRequest = {
        scopes: ["user.read"],
        account: account,
    };
    const tokenResponse = await instance.acquireTokenSilent(accessTokenRequest)
    return tokenResponse.idToken;
}


type WeatherEntry = {
    date: string;
    temperatureC: string;
    temperatureF: string;
    summary: string;
};


const useData = () => {
    const {instance} = useMsal()
    const api = "https://localhost:7220/WeatherForecast"
    const [data, setData] = useState<WeatherEntry[]>([])

    useEffect(() => {
        const op = async () => {

            const token = await prepareToken(instance);
            const headers = new Headers();
            const bearer = "Bearer " + token;

            const options = {
                method: "GET",
                headers: headers
            };

            headers.append("Authorization", bearer);

            const data = await fetch(api, options).then(d => d.json())
            setData(data);
        }
        op();
    }, [])
    return data;

}

export function Authenticated(props: AuthenticatedProps) {
    const {onSignOut} = props;
    const data = useData()
    return <Root>
        <Header>
            Authenticated
            <span></span>
            <Button onClick={onSignOut}>
                Log Out
            </Button>
        </Header>
        <Content>
            <Table>
                <thead>
                <th>Date</th>
                <th>Temp C</th>
                <th>Temp F</th>
                <th>Summary</th>
                </thead>
                <tbody>
                {data.map(d =>
                    <tr>
                        <td>{d.date}</td>
                        <td>{d.temperatureC}</td>
                        <td>{d.temperatureF}</td>
                        <td>{d.summary}</td>
                    </tr>)
                }
                </tbody>
            </Table>


            {/*<pre>*/}
            {/*    {JSON.stringify(data, null, 2)}*/}
            {/*</pre>*/}
        </Content>

    </Root>
}
