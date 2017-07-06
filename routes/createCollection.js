const pool = require('../db/')
const { 
  randomString,
  createToken
} = require('../functions')

const createCollection = async (req, res) => {
  let url = randomString(5)
  try{

  while(! await uniqueCollectionUrl(url)){
    url = randomString(5)
  }

  const { hidden, nsfw, title } = req.body
  const images = JSON.parse(req.body.images)
  const questions = JSON.parse(req.body.questions)
  const owner_id = req.token.account_id

  if(!hidden || !nsfw || !title){
    return res.status(400).json({ success:false, message:"invalid parameters" })
  }

  const col_query =`
    INSERT INTO
    collection(owner_id, title, url, private, nsfw)
    VALUES($1,$2,$3,$4,$5)
    RETURNING col_id
  `

  const collection_res = 
    await pool.query(col_query, [owner_id, title, url, hidden, nsfw])

  const { col_id } = collection_res.rows[0]

  /* MAP IMAGE ARRAY INTO (col_id=$1, url=$2), (...) INSERT VALUES */
  const insert_query_builder = (prefix, suffix, col_id, array) => {
    const query = array.reduce((loop, url, index, arr) => {
      let delimiter = index<arr.length-1 ? ', ':''
      loop += `($1,$${index+2})${delimiter}`
      if(index==arr.length-1) loop+=suffix
      return loop
    }, prefix )
    array.unshift(col_id)
    return [ query, array ]
  }

  const [ image_query, image_query_params ] =
    insert_query_builder(
      'INSERT INTO image(col_id, url) VALUES ',
      ' RETURNING image_id',
      col_id,
      images
    )

  const image_res = await pool.query(image_query, image_query_params)

  const image_ids = image_res.rows.map(row=>row.image_id)

  const [ question_query, question_query_params ] =
    insert_query_builder(
      'INSERT INTO question(col_id, question) VALUES ',
      ' RETURNING question_id',
      col_id,
      questions
    )

  const question_res = await pool.query(question_query, question_query_params)

  const question_ids = question_res.rows.map(row=>row.question_id)

  const rating_query_builder = (question_ids, image_ids) => {
    let pairs = []
    for(let q=1;q<=question_ids.length;q++){
      for(let i=1;i<=image_ids.length;i++){
        pairs.push(`($${i},$${image_ids.length+q})`)
      }
    }
    const q = pairs.reduce( (query, pair, index, arr) => {
      let delimiter = index<arr.length-1 ? ', ':''
      return query+=pair+delimiter
    }, 'INSERT INTO rating(image_id, question_id) VALUES ')
    return [ q, image_ids.concat(question_ids)]
  }

  const [rating_query, rating_query_params] = 
    rating_query_builder(question_ids, image_ids)
  
  const rating_res = await pool.query(rating_query, rating_query_params)

  if(rating_res.rowCount>0){
    return res.json({ success: true, message: "Collection created", data: { url }})
  }else{
    res.status(404).json({ success: false, message: "Something mysterious happened" })
  }

  }catch(e){
    return res.status(500).json({ success: false, error: e })
  }
}

module.exports = createCollection