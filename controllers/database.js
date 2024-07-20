"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = exports.Article = void 0;
//Imports for TypeOrm
var typeorm_1 = require("typeorm");
var Article = /** @class */ (function () {
    function Article() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        __metadata("design:type", String)
    ], Article.prototype, "article_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, unique: true }),
        __metadata("design:type", String)
    ], Article.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Article.prototype, "content", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Article.prototype, "author", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Article.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Article.prototype, "updatedAt", void 0);
    Article = __decorate([
        (0, typeorm_1.Entity)(),
        (0, typeorm_1.Unique)(['article_id']),
        (0, typeorm_1.Unique)(['title'])
    ], Article);
    return Article;
}());
exports.Article = Article;
//Configure Database
var typeorm_2 = require("typeorm");
exports.myDataSource = new typeorm_2.DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    url: process.env.PG_URL,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: +process.env.PG_PORT,
    database: process.env.PG_DB,
    entities: [Article],
    synchronize: process.env.NODE_ENV === 'production' ? false : true,
    ssl: {
        rejectUnauthorized: true,
    },
    logging: true,
});
