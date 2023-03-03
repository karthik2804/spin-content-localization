import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
import { parse } from 'node-html-parser';
// @ts-ignore
import { parse as languageParser } from 'accept-language-parser';

const decoder = new TextDecoder()

interface LanguageListItem {
  code: string
  region: string
  quality: number
}

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {

  let requestPath = ""
  if (request.headers["spin-path-info"] == "/") {
    requestPath = "/index"
  } else {
    requestPath = request.headers["spin-path-info"]
  }

  // Sort language header by preference
  let language: Array<LanguageListItem> = languageParser(request.headers["accept-language"])

  // Find the page of the given path
  try {
    let html = decoder.decode(await fsPromises.readFile(`./src/html_content${requestPath}.html`))
    let dom = parse(html)
    let contentForLocalization = dom.querySelectorAll("[data-i18n-key]")
    let localizationData: Record<string, string> = {}

    // Check for the localization data file
    try {
      let data = JSON.parse(decoder.decode(await fsPromises.readFile(`./src/localization_data${requestPath}.json`)))
      // Check for the highest preferred language and its availability
      language.find(k => {
        if (data[k.code]) {
          localizationData = data[k.code]
          return true
        }
        return false
      })
    } catch { }

    // Replace all the content that needs to be localized with the data
    contentForLocalization.map(k => {
      let key = k.getAttribute("data-i18n-key")
      if (key && localizationData[key]) {
        k.textContent = localizationData[key]
      }
    })
    return {
      status: 200,
      headers: { "content-type": "text/html" },
      body: dom.toString()
    }
  } catch {
    // Return page not found
    return {
      status: 404,
      headers: { "content-type": "text/html" },
      body: "Page not found"
    }
  }
}
