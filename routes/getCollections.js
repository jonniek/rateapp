const pool = require('../db/')

const getCollections = (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%%'

  const received_order = req.query.orderfield || 'title'
  const available_orders = {
    title: 'c.title',
    stars: 'stars',
    created: 'c.created_date'
  }
  const orderfield = available_orders[received_order] || 'c.title'

  const received_dir = req.query.order || 'DESC'
  const available_dirs = {
    'DESC': 'DESC',
    'ASC': 'ASC'
  }
  const order = available_dirs[received_dir.toUpperCase()] || 'DESC'

  const offset = req.query.offset || '0'

  const queryparams = [search, offset]

  const query = `
    select CASE WHEN COUNT(x) = 0 THEN '[]' ELSE json_agg(row_to_json(x)) END FROM (
      select 
        c.*,
        json_agg(DISTINCT a.*) as owner,
        count(s.col_id) as stars,
        array_agg(DISTINCT cat.category) as categories
      from collection c
        left outer join star s on s.col_id = c.col_id
        left join collection_category ccat on ccat.col_id = c.col_id
        left join category cat on ccat.cat_id = cat.cat_id
        left join account a on a.account_id = c.owner_id
      group by c.col_id
      HAVING 
        (SELECT array_agg(cat_id) FROM category WHERE category LIKE $1)
        &&
        (array_agg(cat.cat_id))
        or c.title like $1
      order by ${orderfield} ${order}
      OFFSET $2 LIMIT 20
    ) x; `

  console.log(queryparams)

  pool.query(query, queryparams)
  .then( result => {
    const colls = result.rows[0].json_agg.map(row => {
      row.owner = {
        id: row.owner[0].account_id,
        name: row.owner[0].accountname,
        avatar: row.owner[0].avatar_url,
        last_login: row.owner[0].last_login,
        of_age: row.owner[0].of_age
      }
      row.categories = row.categories[0]===null? [] : row.categories
      return row
    })
    res.json({ success: true, data: result.rows[0].json_agg })
  })
  .catch( err => {
    console.log(err)
    res.status(500).json({ success: false, data: err }) 
  })

}

module.exports = getCollections