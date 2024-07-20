"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var database_1 = require("./database");
var database_2 = require("./database");
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, author, articleRepository, existingTitle, articleEntity, article, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, title = _a.title, content = _a.content, author = _a.author;
                //Validate Input
                if (!title || !content || !author) {
                    return [2 /*return*/, res.status(422).json({
                            errors: [
                                { field: 'title', message: 'Title is required' },
                                { field: 'author', message: 'Author is required' },
                                { field: 'content', message: 'Content is required' }
                            ]
                        })];
                }
                ;
                articleRepository = database_2.myDataSource.getRepository(database_1.Article);
                return [4 /*yield*/, articleRepository.findOne({ where: { title: title } })];
            case 1:
                existingTitle = _b.sent();
                if (existingTitle) {
                    return [2 /*return*/, res.status(422).json({
                            errors: [{ field: 'title', message: 'Article already exists' }]
                        })];
                }
                ;
                return [4 /*yield*/, articleRepository.create({ title: title, content: content, author: author })];
            case 2:
                articleEntity = _b.sent();
                return [4 /*yield*/, articleRepository.save(articleEntity)];
            case 3:
                article = _b.sent();
                res.status(201).json({
                    success: true,
                    message: 'Topic Created Successfully',
                    data: {
                        article_id: article.article_id,
                        content: article.content,
                        author: article.author,
                        title: article.title,
                        createdAt: article.createdAt,
                        updatedAt: article.updatedAt
                    },
                    status_code: 201
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                res.status(400).json({
                    status: 'error',
                    message: error_1.message,
                    status_code: 400
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, author, article_id, articleRepository, existingArticle, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, title = _a.title, content = _a.content, author = _a.author;
                article_id = req.params.id;
                articleRepository = database_2.myDataSource.getRepository(database_1.Article);
                return [4 /*yield*/, articleRepository.findOne({ where: { article_id: article_id } })];
            case 1:
                existingArticle = _b.sent();
                if (!existingArticle) {
                    return [2 /*return*/, res.status(404).json({
                            status: 'error',
                            message: 'Article not found',
                            status_code: 404
                        })];
                }
                ;
                // Update only provided fields
                if (title)
                    existingArticle.title = title;
                if (content)
                    existingArticle.content = content;
                if (author)
                    existingArticle.author = author;
                // Save updated article
                return [4 /*yield*/, articleRepository.save(existingArticle)];
            case 2:
                // Save updated article
                _b.sent();
                res.status(201).json({
                    success: true,
                    message: 'Topic Updated Successfully',
                    data: {
                        article_id: existingArticle.article_id,
                        content: existingArticle.content,
                        author: existingArticle.author,
                        title: existingArticle.title,
                        createdAt: existingArticle.createdAt,
                        updatedAt: existingArticle.updatedAt
                    },
                    status_code: 200
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.status(400).json({
                    status: 'error',
                    message: error_2.message,
                    status_code: 400
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
module.exports = { create: create, update: update };
