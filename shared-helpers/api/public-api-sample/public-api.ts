import axios from 'axios';

export class PublicApi {
  private api;
  private apiOptions;
  constructor(apiOptions = {}) {
    this.api = axios.create({
      baseURL: 'https://api.publicapis.org',
    });
    this.apiOptions = apiOptions;
  }

  /**
   * Fetch public api entries that do not require prior authorization.
   */
  async fetchNoAuthEntries():Promise<PublicApiEntryType[]> {
    const { data } = await this.api.get('entries');

    const entries = (data?.entries || []) as PublicApiEntryType[];

    return (
      entries
        .filter(entry => {
          return !entry.Auth;
        })
    );
  }
}

export type PublicApiEntryType = {
  API: string,
  Description: string,
  Auth: string,
  HTTPS: boolean,
  Cors: 'yes'|'no',
  Link: string,
  Category: string,
}
