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

// }

import {BaseQueryT} from "../config/baseTypes";
import mongoose, {Document, ObjectId} from "mongoose";
import {WithId} from "mongodb";
import {setDefaultQueryParams} from "../helpers";

export type PaginationSortingType<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<I>
}
type ReturnedQueryGetAll<I> = PaginationSortingType<WithId<PaginationSortingType<I> & Document>>;

export const baseRepositry = {
    async find<I>(
        model: mongoose.Model<I>,
        params: BaseQueryT,
        filters: object = {},
        excludeFields: object = {},
        addFields: object = {},
    )  {
        const queryParams = setDefaultQueryParams(params);
        try {
            const skip = +queryParams.pageSize * (+queryParams.pageNumber - 1);

            const payload: any = [
                { $addFields: { id: "$_id", ...addFields } },
                { $project: { _id: 0, __v: 0, ...excludeFields, updatedAt: 0  } },
                {
                    $facet: {
                        items: [{ $skip: skip }, { $limit: +queryParams.pageSize }],
                        totalCount: [{ $count: 'count' }]
                    }
                }
            ];
            if (!['asc', 'desc'].includes(queryParams.sortDirection)) queryParams.sortDirection = 'asc';

            Object.values(filters)
                .filter((arr) => arr && arr.length > 0)
                .length ? payload.unshift({ '$match': filters }) : null;
            payload.unshift({ '$sort': { [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 } });
            const items = await model.aggregate(payload);
            const result: ReturnedQueryGetAll<I> = {
                pagesCount: Math.ceil(+items[0]?.totalCount[0]?.count / +queryParams.pageSize) || 0,
                page: +queryParams.pageNumber,
                pageSize: +queryParams.pageSize,
                totalCount: items[0]?.totalCount[0]?.count || 0,
                items: items[0]?.items,
            };
            return new Promise((resolve: (value: ReturnedQueryGetAll<I>) => void) => resolve(result));
        } catch (e) {
            return new Promise((resolve, reject) => reject(e));
        }
    },

    async findById<I>(model: mongoose.Model<I>, id: string, excludeFields: object = {}) {
        return await model.findOne({ _id: id }, { ...excludeFields  });
    },

    async findByFields<I>(model: mongoose.Model<I>, fields: object, excludeFields: object = {}) {
        return await model.findOne(fields, { ...excludeFields  });
    }
}