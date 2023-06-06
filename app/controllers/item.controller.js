const ITEM = require("../models/item.model");
const ApiError = require("../api-error");
const functions = require("../functions/functions")

async function phanTrang(condition, fields, orderBy, limit, page) {
    const tempt = []; let i = 0;
    do {
        let t;
        if (condition.length !== 0)
            t = await ITEM.find(condition, fields).sort(orderBy).limit(limit).skip(limit * i)
        else {
            t = await ITEM.find({}, fields).sort(orderBy).limit(limit).skip(limit * i)
        }
        if (t.length === 0) {
            break;
        } else if (t.length < limit) {
            tempt.push(t);
            break;
        }
        tempt.push(t);
        i++;
    } while (i < page);
    return tempt;
}

const itemController = {
    addAnItem: async (req, res, next) => {
        try {
            const newItem = new ITEM({ ...req.body, createAt: functions.getTime() });
            const savedItem = await newItem.save();
            // if (req.body.author) {
            //     const author = AUTHOR.findById(req.body.author);
            //     await author.updateOne({
            //         $push: { books: savedItem._id }
            //     });
            // }
            return res.send(savedItem);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while add a book`)
            );
        }
    },

    getAllItems: async (req, res, next) => { //Admin
        try {
            const items = await ITEM.find({}, {
                title: 1,
                price: 1
            });
            return res.send(items);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while getAll books`)
            );
        }
    },

    getDataHome: async (req, res, next) => {
        try {
            const fields = {
                title: 1,
                price: 1,
                image: 1
            }
            const topSale = await phanTrang({}, fields, { sold: -1 }, 8, 1);
            const newArrivals = await phanTrang({}, fields, { createAt: -1 }, 8, 1);
            const feature = await phanTrang({ feature: true }, fields, { createAt: -1 }, 8, 1);
            return res.send([feature[0], topSale[0], newArrivals[0]]);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while getAll books`)
            );
        }
    },

    getDataSuggest: async (req, res, next) => {
        try {
            const fields = {
                title: 1,
                price: 1,
                // category: 1,
                image: 1
            }
            // let loaiSach = []; let i = 0;
            // do {
            //     let t = await ITEM.find({ $and: [{ "category": req.params.caterogy }, { "_id": { $nin: [req.params.id] } }] }, fields).limit(4).skip(4 * i)

            //     if (t.length === 0) {
            //         break;
            //     } else if (t.length < 4) {
            //         loaiSach.push(t);
            //         break;
            //     }
            //     loaiSach.push(t);
            //     i++;
            // } while (i < 3);
            // console.log(req.params.caterogy,req.params.id)
            let dataSuggest = await phanTrang({ $and: [{ "category": req.params.caterogy }, { "_id": { $nin: [req.params.id] } }] }, fields, { sold: -1 }, 4, 1);
            // console.log()
            return res.send(dataSuggest);
        } catch (error) {
            return next(
                new ApiError(400, `An error: ${error} occurred while getAll books`)
            );
        }
    },

    getData: async (req, res, next) => {
        try {
            const fields = {
                title: 1,
                price: 1,
                sold: 1,
                image: 1
            }
            // if (!req.query.category || req.query.category === "all") {
            //     if (req.query.search) {
            //         console.log(req.query.search)
            //         const tempt = []; let i = 0;
            //         do {
            //             let t = [];
            //             if (req.query.search.length !== 0)
            //                 t = await ITEM.find({ $text: { $search: req.query.search } }, fields).limit(12).skip(12 * i)
            //             else {
            //                 t = await ITEM.find({}, fields).limit(12).skip(12 * i)
            //             }
            //             if (t.length === 0) {
            //                 break;
            //             } else if (t.length < 12) {
            //                 tempt.push(t);
            //                 break;
            //             }
            //             tempt.push(t);
            //             i++;
            //         } while (i < 50);
            //         return res.send(tempt)
            //     }
            //     return res.send(await phanTrang({}, fields, {createAt: -1}, 12, 50));
            // } else {
            //     return res.send(await phanTrang({category: req.query.category}, fields, {createAt: -1}, 12, 50));
            // }
            // console.log("query",req.query, )
            if(Object.keys(req.query).length === 0) 
                return res.send(await phanTrang({}, fields, { createAt: -1 }, 12, 50))
            let arr = []
            for (const key in req.query) {
                if (key === "minPrice")
                    arr.push({ 'price': { $gte: req.query[key] } })
                else if (key === "maxPrice")
                    arr.push({ 'price': { $lte: req.query[key] } })
                else if (key === 'search')
                    arr.push({$text: { $search: req.query[key] }})
                else
                    arr.push({ [key]: req.query[key] })
            }
            // console.log(arr)
            const result = await phanTrang({$and: arr}, fields, { createAt: -1 }, 12, 50)

            return res.send(result)
        } catch (error) {
            console.log(error)
            // return next(
            //     new ApiError(500, `An error: ${error} occurred while getData books`)
            // );
        }
    },

    getAnItem: async (req, res, next) => {
        try {
            const item = await ITEM.findById(req.params.id);
            // console.log(req.params.id)
            return res.send(item);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while get a book`)
            );
        }
    },

    updateItem: async (req, res, next) => {
        try {
            const item = await ITEM.findById(req.params.id);

            // if (req.body.author !== book.author) {
            //     await AUTHOR.updateMany({ books: req.params.id }, { $pull: { books: req.params.id } })                      // Được thiết kế bởi Trần Văn Sáng

            //     const author = AUTHOR.findById(req.body.author);
            //     await author.updateOne({
            //         $push: { books: req.params.id }
            //     });
            // }

            await item.updateOne({ $set: req.body });
            return res.send({ message: " Item was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while update item`)
            );
        }
    },

    deleteAnItem: async (req, res, next) => {
        try {
            // await AUTHOR.updateMany({ books: req.params.id }, { $pull: { books: req.params.id } })
            const document = await ITEM.findByIdAndDelete(req.params.id);

            if (!document) {
                return next(new ApiError(404, "Không tìm thấy sản phẩm"));
            }
            return res.send({ message: "Xoá sản phẩm thành công" });

        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while delete a book`)
            );
        }
    }
}

module.exports = itemController;