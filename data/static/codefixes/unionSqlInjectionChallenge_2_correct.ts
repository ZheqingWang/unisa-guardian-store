import { ProductModel } from '../../../models/product';

module.exports = function searchProducts () {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: any = req.query.q === 'undefined' ? '' : req.query.q ?? ''
    criteria = (criteria.length <= 200) ? criteria : criteria.substring(0, 200)
    ProductModel.findAll({
      where: {
        [Op.or]: [
          {name: {[Op.like]: '%' + criteria + '%' }},
          {description: {[Op.like]: '%' + criteria + '%' }},
        ],
        deletedAt: null,
      }
      order: [['name', 'ASC']],
    })
    .then(([products]: any) => {
        const dataString = JSON.stringify(products)
        for (let i = 0; i < products.length; i++) {
          products[i].name = req.__(products[i].name)
          products[i].description = req.__(products[i].description)
        }
        res.json(utils.queryResultToJson(products))
      }).catch((error: ErrorWithParent) => {
        next(error.parent)
      })
  }
}