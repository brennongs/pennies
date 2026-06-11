export class Fetch {
  public static url: string

  public static async get<Response>(path: string): Promise<Response> {
    this.validate()
    const response = await fetch(`${Fetch.url}/${path}`, {
      method: 'GET'
    })

    return response.json() as Promise<Response>
  }

  public static async post<Response>(path: string, body: unknown): Promise<Response> {
    this.validate()
    const response = await fetch(`${Fetch.url}${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.json() as Promise<Response>
  }

  private static validate() {
    if (!Fetch.url) throw new Error('please provide a base url for fetch')
  }
}