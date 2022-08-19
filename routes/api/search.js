const Fuse = require('fuse.js')
const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  includeMatches: true,
  // findAllMatches: false,
  minMatchCharLength: 2,
  // location: 0,
  // threshold: 1,
  // distance: 100,
  // useExtendedSearch: true,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ['title', 'text']
}

function buildData (matches) {
  return matches.map(m => {
    return {
      link: `/articles/${m.item.slug}`,
      matches: m.matches.map(im => {
        const _firstIndex = im.indices[0]
        return {
          indices: im.indices,
          value: im.value,
          highlight: im.value.substring(Math.max(0, _firstIndex[0] - 5), Math.min(_firstIndex[1] + 5, im.value.length))
        }
      })
    }
  })
}

function removeBase64 (text) {
  return text.replaceAll(/\(data:image\/png;base64,.+?\)/g, '')
}

function cleanData (data) {
  return data.map(item => ({
    ...item,
    text: removeBase64(item.text)
  }))
}

/*
 * search all articles by keyword
 * {
 *   method: 'POST',
 *   url: '/api/search',
 *   body: {
 *    keyword:string,
 *   }
 * }
 */
exports.search = async (req, res, next) => {
  const _keyword = req.body.keyword

  const _data = await req.db.get('articles').value()
  const fuse = new Fuse(cleanData(_data), options)

  try {
    const _matches = fuse.search(_keyword)
    const _ret = buildData(_matches)
    res.status(200).json({ message: _ret })
  } catch (error) {
    next(error)
  }
}
