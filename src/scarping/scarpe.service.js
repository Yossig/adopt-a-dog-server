const cheerio = require('cheerio')
const requestPromise = require('request-promise')

class scrapeService {
  async scrapeDogBreedsFromWikipedia() {
    const html = await requestPromise('https://en.wikipedia.org/wiki/List_of_dog_breeds')
    const $ = cheerio.load(html)
    var titles = []
    var breedTable = []

    $('tr.sortbottom th').each((i, el) => {
      titles.push($(el).text().replace('\n', ''))
    })

    $('table.wikitable').find('tr').each((i, el) => {
      var row = {}

      $(el).children('td').each((i, el) => {
        var text = $(el).text()

        if (titles[i] === 'Image') {
          text = $(el).find('img').attr('src') || ''
        }

        row[titles[i]] = text
      })
      if (!(Object.entries(row).length === 0 && row.constructor === Object)) {
        breedTable.push(row)
      }
    })

    return breedTable;
  }
}

module.exports = new scrapeService()
