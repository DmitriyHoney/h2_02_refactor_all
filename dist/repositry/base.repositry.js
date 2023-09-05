"use strict";
// import { WithId, Collection } from 'mongodb';
// import mongoose, { IfAny, Document, Require_id, ObjectId } from 'mongoose';
// import { PaginationSortingType } from '../types/types';
// import {injectable, unmanaged} from "inversify";
//
// interface GenericRepoCommandLayerFn<Payload> {
//     create: (payload: Payload) => Promise<string | number>
//     update: (id: string, payload: Payload) => Promise<boolean>
//     delete: (id: string) => Promise<boolean>
//     _deleteAll: () => Promise<boolean>
// }
//
// @injectable()
// export class CommandRepo<I, P> implements GenericRepoCommandLayerFn<P> {
//     public collection: mongoose.Model<I>;
//     public constructor(collection: mongoose.Model<I>) {
//         this.collection = collection;
//     }
//     // @ts-ignore
//     async create(payload: P) {
//         const res = await this.collection.create(payload);
//         return res._id;
//     }
//     async update(_id: string, payload: P) {
//         // @ts-ignore
//         const result = await this.collection.updateOne({ _id }, { $set: payload });
//         return result.matchedCount === 1
//     }
//     async delete(_id: string) {
//         const result = await this.collection.deleteOne({ _id });
//         return result.deletedCount === 1;
//     }
//     async _deleteAll() {
//         const result = await this.collection.deleteMany();
//         return result.deletedCount > 0;
//     };
// }
//
//
// interface GenericRepoQueryLayerFn<ItemType> {
//     find: (
//         pageSize: string,
//         pageNumber: string,
//         sortBy: string,
//         sortDirection: 'asc' | 'desc',
//         filters: object,
//     ) => Promise<PaginationSortingType<WithId<PaginationSortingType<ItemType> & Document>>>
//     findAll: (
//         filters?: object,
//         excludeFields?: object,
//     ) => Promise<IfAny<ItemType, any, Document<unknown, {}, ItemType> & Omit<Require_id<ItemType>, never>>[]>
//     findById: (id: ObjectId, excludeFields: object) => Promise<IfAny<ItemType, any, Document<unknown, {}, ItemType> & Omit<Require_id<ItemType>, never>> | null>
// }
//
// type ReturnedQueryGetAll<I> = PaginationSortingType<WithId<PaginationSortingType<I> & Document>>;
//
// @injectable()
// export class QueryRepo<I> implements GenericRepoQueryLayerFn<I> {
//     public collection: mongoose.Model<I>;
//     public constructor(collection: mongoose.Model<I>) {
//         this.collection = collection;
//     }
//     // @ts-ignore
//
//     async findAll(filters: object = {}, excludeFields: object = {}) {
//         return this.collection.find({ ...filters }, { ...excludeFields, updatedAt: 0  });
//     }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseRepositry = void 0;
const helpers_1 = require("../helpers");
exports.baseRepositry = {
    find(model, params, filters = {}, excludeFields = {}, addFields = {}) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = (0, helpers_1.setDefaultQueryParams)(params);
            try {
                const skip = +queryParams.pageSize * (+queryParams.pageNumber - 1);
                const payload = [
                    { $addFields: Object.assign({ id: "$_id" }, addFields) },
                    { $project: Object.assign(Object.assign({ _id: 0, __v: 0 }, excludeFields), { updatedAt: 0 }) },
                    {
                        $facet: {
                            items: [{ $skip: skip }, { $limit: +queryParams.pageSize }],
                            totalCount: [{ $count: 'count' }]
                        }
                    }
                ];
                if (!['asc', 'desc'].includes(queryParams.sortDirection))
                    queryParams.sortDirection = 'asc';
                Object.values(filters)
                    .filter((arr) => arr && arr.length > 0)
                    .length ? payload.unshift({ '$match': filters }) : null;
                payload.unshift({ '$sort': { [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 } });
                const items = yield model.aggregate(payload);
                const result = {
                    pagesCount: Math.ceil(+((_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.totalCount[0]) === null || _b === void 0 ? void 0 : _b.count) / +queryParams.pageSize) || 0,
                    page: +queryParams.pageNumber,
                    pageSize: +queryParams.pageSize,
                    totalCount: ((_d = (_c = items[0]) === null || _c === void 0 ? void 0 : _c.totalCount[0]) === null || _d === void 0 ? void 0 : _d.count) || 0,
                    items: (_e = items[0]) === null || _e === void 0 ? void 0 : _e.items,
                };
                return new Promise((resolve) => resolve(result));
            }
            catch (e) {
                return new Promise((resolve, reject) => reject(e));
            }
        });
    },
    findById(model, id, excludeFields = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findOne({ _id: id }, Object.assign({}, excludeFields));
        });
    },
    findByFields(model, fields, excludeFields = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findOne(fields, Object.assign({}, excludeFields));
        });
    }
};
//# sourceMappingURL=base.repositry.js.map