//Imports for TypeOrm
import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['article_id'])
@Unique(['title'])
export class Article {
    @PrimaryGeneratedColumn('uuid')
    article_id: String;

    @Column({nullable: false, unique: true})
    title: String;

    @Column({nullable: false})
    content: String;

    @Column({nullable: false})
    author: String;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

//Configure Database
import { DataSource } from 'typeorm';

export const myDataSource = new DataSource({
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